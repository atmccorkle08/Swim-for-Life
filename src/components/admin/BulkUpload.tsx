"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import Image from "next/image";
import { galleryCategories } from "@/data/gallery";
import {
  ALT_MAX_CHARS,
  AUTO_EXCLUDE_FLAGS,
  CAPTION_MAX_CHARS,
  PHOTO_FLAG_LABELS,
  type PhotoAnalysis,
  type PhotoFlag,
} from "@/lib/galleryAnalysis";

// ── Tunables ────────────────────────────────────────────────────────────────
const CONCURRENCY = 3;
const FULL_MAX_EDGE = 2400; // published version
const ANALYZE_MAX_EDGE = 1024; // copy sent to the AI
// Vercel serverless bodies are capped at ~4.5 MB (incl. multipart overhead).
const FULL_MAX_BYTES = 4 * 1024 * 1024;
const ANALYZE_MAX_BYTES = 1.5 * 1024 * 1024;
const ENCODE_QUALITIES = [0.85, 0.75, 0.65, 0.5];
const DUPLICATE_HAMMING_THRESHOLD = 5; // of 64 bits

const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);
const ACCEPTED_EXTENSIONS = /\.(jpe?g|png|webp|heic|heif)$/i;

const uploadCategories = galleryCategories.filter((c) => c.slug !== "all");
const DEFAULT_CATEGORY = "summer-2026";

// ── Types ───────────────────────────────────────────────────────────────────
type ItemStatus =
  | "queued"
  | "preparing"
  | "analyzing"
  | "ready"
  | "failed"
  | "publishing"
  | "published"
  | "publish_failed";

interface BulkItem {
  id: string;
  fileName: string;
  previewUrl: string | null;
  width: number;
  height: number;
  status: ItemStatus;
  error: string | null;
  alt: string;
  caption: string;
  category: string;
  quality: number | null;
  flags: PhotoFlag[];
  include: boolean;
}

/** Non-render data kept per item (original file + encoded blobs). */
interface ItemSource {
  file: File;
  defaultCategory: string;
  takenAt: string;
  full: Blob | null;
  small: Blob | null;
  hash: string | null;
}

interface PreparedImage {
  full: Blob;
  small: Blob;
  width: number;
  height: number;
  hash: string;
}

const IN_FLIGHT: ReadonlySet<ItemStatus> = new Set<ItemStatus>([
  "queued",
  "preparing",
  "analyzing",
  "publishing",
]);

// ── Image helpers (browser only) ────────────────────────────────────────────
async function decodeImage(file: File): Promise<{
  source: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
}> {
  if (typeof createImageBitmap === "function") {
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bmp, width: bmp.width, height: bmp.height, release: () => bmp.close() };
    } catch {
      // Fall through to <img> decoding (e.g. HEIC in Safari).
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new window.Image();
    img.src = url;
    await img.decode();
    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    };
  } catch {
    URL.revokeObjectURL(url);
    throw new Error(
      "This browser can't decode this image (HEIC usually only works in Safari). Convert it to JPEG and try again."
    );
  }
}

function drawScaled(
  source: CanvasImageSource,
  srcWidth: number,
  srcHeight: number,
  maxEdge: number
): HTMLCanvasElement {
  const scale = Math.min(1, maxEdge / Math.max(srcWidth, srcHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(srcWidth * scale));
  canvas.height = Math.max(1, Math.round(srcHeight * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/** Encode as WebP (falls back to JPEG where WebP encoding is unsupported), shrinking quality to fit. */
async function encodeCanvas(canvas: HTMLCanvasElement, maxBytes: number): Promise<Blob> {
  let type = "image/webp";
  let last: Blob | null = null;
  for (const q of ENCODE_QUALITIES) {
    let blob = await canvasToBlob(canvas, type, q);
    if (!blob || blob.type !== type) {
      // Older Safari returns PNG when asked for WebP.
      type = "image/jpeg";
      blob = await canvasToBlob(canvas, type, q);
    }
    if (!blob) continue;
    last = blob;
    if (blob.size <= maxBytes) return blob;
  }
  if (!last) throw new Error("Could not encode image.");
  throw new Error(`Image is still over ${Math.round(maxBytes / 1024 / 1024)} MB after compression.`);
}

/** 64-bit difference hash, used to spot near-duplicate shots in a batch. */
function differenceHash(source: HTMLCanvasElement): string {
  const canvas = document.createElement("canvas");
  canvas.width = 9;
  canvas.height = 8;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.drawImage(source, 0, 0, 9, 8);
  const { data } = ctx.getImageData(0, 0, 9, 8);
  const gray: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    gray.push(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
  }
  let bits = "";
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      bits += gray[y * 9 + x] > gray[y * 9 + x + 1] ? "1" : "0";
    }
  }
  return bits;
}

function hammingDistance(a: string, b: string): number {
  if (!a || !b || a.length !== b.length) return Infinity;
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

async function prepareImage(file: File): Promise<PreparedImage> {
  const decoded = await decodeImage(file);
  try {
    const fullCanvas = drawScaled(decoded.source, decoded.width, decoded.height, FULL_MAX_EDGE);
    const smallCanvas = drawScaled(fullCanvas, fullCanvas.width, fullCanvas.height, ANALYZE_MAX_EDGE);
    const [full, small] = await Promise.all([
      encodeCanvas(fullCanvas, FULL_MAX_BYTES),
      encodeCanvas(smallCanvas, ANALYZE_MAX_BYTES),
    ]);
    return {
      full,
      small,
      width: fullCanvas.width,
      height: fullCanvas.height,
      hash: differenceHash(smallCanvas),
    };
  } finally {
    decoded.release();
  }
}

function extensionFor(blob: Blob): string {
  return blob.type === "image/webp" ? "webp" : "jpg";
}

function baseName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "").replace(/[^\w-]+/g, "-").slice(0, 60) || "photo";
}

async function readError(res: Response, fallback: string): Promise<string> {
  if (res.status === 401) return "Session expired — reload the page and log in again.";
  const data = (await res.json().catch(() => null)) as { error?: unknown } | null;
  return typeof data?.error === "string" ? data.error : `${fallback} (${res.status})`;
}

async function runPool<T>(items: T[], limit: number, worker: (item: T) => Promise<void>) {
  let next = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const item = items[next++];
      await worker(item);
    }
  });
  await Promise.all(runners);
}

// ── Component ───────────────────────────────────────────────────────────────
interface BulkUploadProps {
  onPublished: () => void | Promise<void>;
}

export default function BulkUpload({ onPublished }: BulkUploadProps) {
  const [batchCategory, setBatchCategory] = useState(DEFAULT_CATEGORY);
  const [items, setItems] = useState<BulkItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [notice, setNotice] = useState<{ kind: "info" | "error"; text: string } | null>(null);

  const sourcesRef = useRef(new Map<string, ItemSource>());
  const urlsRef = useRef(new Set<string>());
  const queueRef = useRef<string[]>([]);
  const activeRef = useRef(0);
  const idCounterRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke every preview URL when the component unmounts.
  useEffect(() => {
    const urls = urlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  function updateItem(id: string, patch: Partial<BulkItem> | ((item: BulkItem) => Partial<BulkItem>)) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...(typeof patch === "function" ? patch(item) : patch) } : item
      )
    );
  }

  function markDuplicates(id: string, hash: string) {
    const dupes: string[] = [];
    sourcesRef.current.forEach((src, otherId) => {
      if (otherId !== id && src.hash && hammingDistance(src.hash, hash) <= DUPLICATE_HAMMING_THRESHOLD) {
        dupes.push(otherId);
      }
    });
    if (dupes.length === 0) return;
    const affected = new Set([id, ...dupes]);
    setItems((prev) =>
      prev.map((item) =>
        affected.has(item.id) && !item.flags.includes("duplicate_like")
          ? { ...item, flags: [...item.flags, "duplicate_like"] }
          : item
      )
    );
  }

  async function processItem(id: string) {
    const src = sourcesRef.current.get(id);
    if (!src) return; // removed while queued

    try {
      if (!src.full || !src.small) {
        updateItem(id, { status: "preparing", error: null });
        const prepared = await prepareImage(src.file);
        if (!sourcesRef.current.has(id)) return;
        src.full = prepared.full;
        src.small = prepared.small;
        src.hash = prepared.hash;
        const previewUrl = URL.createObjectURL(prepared.small);
        urlsRef.current.add(previewUrl);
        updateItem(id, { previewUrl, width: prepared.width, height: prepared.height });
        if (prepared.hash) markDuplicates(id, prepared.hash);
      }

      updateItem(id, { status: "analyzing", error: null });
      const formData = new FormData();
      formData.append("file", src.small, `analyze.${extensionFor(src.small)}`);
      formData.append("defaultCategory", src.defaultCategory);
      formData.append("takenAt", src.takenAt);

      const res = await fetch("/api/admin/gallery/analyze", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await readError(res, "Analysis failed"));
      const analysis = (await res.json()) as PhotoAnalysis;

      updateItem(id, (item) => {
        const flags: PhotoFlag[] = [...analysis.flags];
        if (item.flags.includes("duplicate_like")) flags.push("duplicate_like");
        return {
          status: "ready",
          error: null,
          alt: analysis.alt,
          caption: analysis.caption,
          category: analysis.category,
          quality: analysis.quality,
          flags,
          include: !flags.some((f) => AUTO_EXCLUDE_FLAGS.has(f)),
        };
      });
    } catch (err) {
      updateItem(id, {
        status: "failed",
        include: false,
        error: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }

  function pump() {
    while (activeRef.current < CONCURRENCY && queueRef.current.length > 0) {
      const id = queueRef.current.shift();
      if (!id) break;
      activeRef.current++;
      void processItem(id).finally(() => {
        activeRef.current--;
        pump();
      });
    }
  }

  function enqueue(ids: string[]) {
    queueRef.current.push(...ids);
    pump();
  }

  function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    const skipped: string[] = [];
    const newItems: BulkItem[] = [];

    for (const file of files) {
      const accepted = ACCEPTED_TYPES.has(file.type) || (!file.type && ACCEPTED_EXTENSIONS.test(file.name));
      if (!accepted) {
        skipped.push(file.name);
        continue;
      }
      const id = `bulk-${Date.now()}-${idCounterRef.current++}`;
      sourcesRef.current.set(id, {
        file,
        defaultCategory: batchCategory,
        takenAt: new Date(file.lastModified || Date.now()).toISOString(),
        full: null,
        small: null,
        hash: null,
      });
      newItems.push({
        id,
        fileName: file.name,
        previewUrl: null,
        width: 0,
        height: 0,
        status: "queued",
        error: null,
        alt: "",
        caption: "",
        category: batchCategory,
        quality: null,
        flags: [],
        include: false,
      });
    }

    if (skipped.length > 0) {
      setNotice({
        kind: "error",
        text: `Skipped ${skipped.length} unsupported file${skipped.length === 1 ? "" : "s"}: ${skipped
          .slice(0, 5)
          .join(", ")}${skipped.length > 5 ? "…" : ""}. Use JPEG, PNG, WebP, or HEIC.`,
      });
    } else {
      setNotice(null);
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      enqueue(newItems.map((i) => i.id));
    }
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (publishing) return;
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  }

  function retry(id: string) {
    updateItem(id, { status: "queued", error: null });
    enqueue([id]);
  }

  function releaseItem(id: string, previewUrl: string | null) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      urlsRef.current.delete(previewUrl);
    }
    sourcesRef.current.delete(id);
    queueRef.current = queueRef.current.filter((q) => q !== id);
  }

  function removeItem(id: string) {
    const item = items.find((i) => i.id === id);
    if (!item || IN_FLIGHT.has(item.status)) return;
    releaseItem(id, item.previewUrl);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearFinished() {
    const keep: BulkItem[] = [];
    for (const item of items) {
      if (IN_FLIGHT.has(item.status)) keep.push(item);
      else releaseItem(item.id, item.previewUrl);
    }
    setItems(keep);
    setNotice(null);
  }

  async function publishSelected() {
    const selected = items
      .filter((i) => i.include && (i.status === "ready" || i.status === "publish_failed"))
      .sort((a, b) => (b.quality ?? 0) - (a.quality ?? 0));
    if (selected.length === 0) return;

    const missingAlt = selected.filter((i) => !i.alt.trim());
    if (missingAlt.length > 0) {
      setNotice({
        kind: "error",
        text: `${missingAlt.length} selected photo${missingAlt.length === 1 ? " is" : "s are"} missing alt text.`,
      });
      return;
    }

    setPublishing(true);
    setNotice(null);
    let ok = 0;
    let failed = 0;

    await runPool(selected, CONCURRENCY, async (item) => {
      const src = sourcesRef.current.get(item.id);
      if (!src?.full) {
        failed++;
        updateItem(item.id, { status: "publish_failed", error: "Prepared image is missing — remove and re-add it." });
        return;
      }
      updateItem(item.id, { status: "publishing", error: null });
      try {
        const quality = item.quality ?? 5;
        const formData = new FormData();
        formData.append("file", src.full, `${baseName(item.fileName)}.${extensionFor(src.full)}`);
        formData.append("alt", item.alt.trim().slice(0, ALT_MAX_CHARS));
        formData.append("caption", item.caption.trim().slice(0, CAPTION_MAX_CHARS));
        formData.append("category", item.category);
        formData.append("width", String(item.width));
        formData.append("height", String(item.height));
        // Existing order is sort_order ASC, created_at DESC: quality 10 → 0 (first), quality 1 → 9.
        formData.append("sort_order", String(10 - quality));

        const res = await fetch("/api/admin/gallery", { method: "POST", body: formData });
        if (!res.ok) throw new Error(await readError(res, "Upload failed"));
        ok++;
        updateItem(item.id, { status: "published", include: false });
      } catch (err) {
        failed++;
        updateItem(item.id, {
          status: "publish_failed",
          error: err instanceof Error ? err.message : "Upload failed.",
        });
      }
    });

    setPublishing(false);
    setNotice(
      failed === 0
        ? { kind: "info", text: `Published ${ok} photo${ok === 1 ? "" : "s"}.` }
        : { kind: "error", text: `Published ${ok}, ${failed} failed — fix or retry the highlighted photos.` }
    );
    if (ok > 0) await onPublished();
  }

  // ── Derived view data ─────────────────────────────────────────────────────
  const sorted = items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const qa = a.item.quality ?? -1;
      const qb = b.item.quality ?? -1;
      return qb - qa || a.index - b.index;
    })
    .map(({ item }) => item);

  const counts = {
    pending: items.filter((i) => i.status === "queued" || i.status === "preparing" || i.status === "analyzing").length,
    ready: items.filter((i) => i.status === "ready").length,
    failed: items.filter((i) => i.status === "failed").length,
    published: items.filter((i) => i.status === "published").length,
  };
  const publishable = items.filter(
    (i) => i.include && (i.status === "ready" || i.status === "publish_failed")
  );
  const consentCount = publishable.filter((i) => i.flags.includes("face_close_up_of_child")).length;
  const anyInFlight = items.some((i) => IN_FLIGHT.has(i.status));

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-1">Bulk upload with AI</h2>
      <p className="text-sm text-gray-500 mb-4">
        Drop in a batch of photos. They&apos;re resized in your browser, then AI drafts alt text,
        captions, a category, and a quality score for you to review before publishing.
      </p>

      <div className="grid sm:grid-cols-[220px_1fr] gap-4 mb-4">
        <div>
          <label htmlFor="bulk-category" className="block text-sm font-medium text-gray-700 mb-1">
            Batch default category
          </label>
          <select
            id="bulk-category"
            value={batchCategory}
            onChange={(e) => setBatchCategory(e.target.value)}
            disabled={publishing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          >
            {uploadCategories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">Applies to photos added after changing it.</p>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!publishing) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
          }`}
        >
          <p className="text-sm text-gray-600">Drag &amp; drop photos here, or</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={publishing}
            className="mt-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Choose photos
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
            onChange={handleFileInput}
            className="hidden"
          />
          <p className="text-xs text-gray-400 mt-2">JPEG, PNG, WebP, or HEIC (HEIC needs Safari)</p>
        </div>
      </div>

      {notice && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm border ${
            notice.kind === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-green-50 border-green-200 text-green-800"
          }`}
        >
          {notice.text}
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <p className="text-sm text-gray-600">
              {items.length} photo{items.length === 1 ? "" : "s"}
              {counts.pending > 0 && <> &middot; {counts.pending} processing</>}
              {counts.ready > 0 && <> &middot; {counts.ready} ready</>}
              {counts.failed > 0 && <span className="text-red-600"> &middot; {counts.failed} failed</span>}
              {counts.published > 0 && <span className="text-green-700"> &middot; {counts.published} published</span>}
            </p>
            <button
              type="button"
              onClick={clearFinished}
              disabled={publishing || items.every((i) => IN_FLIGHT.has(i.status))}
              className="text-sm text-gray-500 hover:text-gray-800 disabled:opacity-40 transition-colors"
            >
              Clear finished
            </button>
          </div>

          {consentCount > 0 && (
            <div className="mb-4 p-3 rounded-lg text-sm border bg-amber-50 border-amber-200 text-amber-900">
              {consentCount} selected photo{consentCount === 1 ? " shows" : "s show"} a close-up of a
              child&apos;s face. Confirm a photo release is on file for each child before publishing.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {sorted.map((item) => (
              <BulkItemCard
                key={item.id}
                item={item}
                disabled={publishing}
                onChange={(patch) => updateItem(item.id, patch)}
                onRetry={() => retry(item.id)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void publishSelected()}
              disabled={publishing || publishable.length === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {publishing ? "Publishing…" : `Publish selected (${publishable.length})`}
            </button>
            {anyInFlight && !publishing && (
              <span className="text-sm text-gray-500">Still analyzing — you can publish what&apos;s ready.</span>
            )}
          </div>
        </>
      )}
    </section>
  );
}

// ── Review card ─────────────────────────────────────────────────────────────
const STATUS_LABELS: Record<ItemStatus, string> = {
  queued: "Queued",
  preparing: "Resizing…",
  analyzing: "Analyzing…",
  ready: "Ready",
  failed: "Failed",
  publishing: "Publishing…",
  published: "Published",
  publish_failed: "Publish failed",
};

function qualityBadgeClass(quality: number): string {
  if (quality >= 8) return "bg-green-100 text-green-800";
  if (quality >= 5) return "bg-blue-100 text-blue-800";
  return "bg-amber-100 text-amber-800";
}

function flagChipClass(flag: PhotoFlag): string {
  if (flag === "face_close_up_of_child") return "bg-amber-100 text-amber-900 border-amber-300";
  if (AUTO_EXCLUDE_FLAGS.has(flag) || flag === "visible_personal_info")
    return "bg-red-50 text-red-700 border-red-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
}

interface BulkItemCardProps {
  item: BulkItem;
  disabled: boolean;
  onChange: (patch: Partial<BulkItem>) => void;
  onRetry: () => void;
  onRemove: () => void;
}

function BulkItemCard({ item, disabled, onChange, onRetry, onRemove }: BulkItemCardProps) {
  const editable = !disabled && (item.status === "ready" || item.status === "publish_failed");
  const busy = IN_FLIGHT.has(item.status);
  const inputClass =
    "w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500";

  return (
    <div
      className={`border rounded-lg p-3 transition-colors ${
        item.status === "published"
          ? "border-green-200 bg-green-50/40"
          : item.status === "failed" || item.status === "publish_failed"
            ? "border-red-200"
            : item.include
              ? "border-blue-300"
              : "border-gray-200"
      }`}
    >
      <div className="flex gap-3">
        <div className="relative w-28 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
          {item.previewUrl ? (
            <Image
              src={item.previewUrl}
              alt={item.alt || item.fileName}
              fill
              unoptimized
              className="object-cover"
              sizes="112px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              {busy ? "…" : "No preview"}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-gray-500 truncate" title={item.fileName}>
              {item.fileName}
            </p>
            {item.quality !== null && (
              <span
                className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${qualityBadgeClass(item.quality)}`}
                title="AI quality score (1–10)"
              >
                {item.quality}/10
              </span>
            )}
          </div>

          <p
            className={`text-xs mt-0.5 ${
              item.status === "failed" || item.status === "publish_failed"
                ? "text-red-600"
                : item.status === "published"
                  ? "text-green-700"
                  : "text-gray-500"
            }`}
          >
            {STATUS_LABELS[item.status]}
            {item.width > 0 && (
              <span className="text-gray-400">
                {" "}
                &middot; {item.width}&times;{item.height}px
              </span>
            )}
          </p>
          {item.error && <p className="text-xs text-red-600 mt-0.5">{item.error}</p>}

          {item.flags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {item.flags.map((flag) => (
                <span key={flag} className={`text-[11px] px-1.5 py-0.5 rounded border ${flagChipClass(flag)}`}>
                  {PHOTO_FLAG_LABELS[flag]}
                </span>
              ))}
            </div>
          )}
          {item.flags.includes("face_close_up_of_child") && (
            <p className="text-[11px] text-amber-800 mt-1">Confirm photo release consent before publishing.</p>
          )}

          <div className="flex items-center gap-3 mt-2">
            <label className="flex items-center gap-1.5 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={item.include}
                disabled={!editable}
                onChange={(e) => onChange({ include: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Include
            </label>
            {item.status === "failed" && (
              <button
                type="button"
                onClick={onRetry}
                disabled={disabled}
                className="text-sm text-blue-600 hover:underline disabled:opacity-40"
              >
                Retry
              </button>
            )}
            {!busy && (
              <button
                type="button"
                onClick={onRemove}
                disabled={disabled}
                className="text-sm text-red-600 hover:text-red-800 disabled:opacity-40 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {(item.status === "ready" || item.status === "publish_failed" || item.status === "publishing" || item.status === "published") && (
        <div className="mt-3 space-y-2">
          <div>
            <label htmlFor={`${item.id}-alt`} className="block text-xs font-medium text-gray-700 mb-0.5">
              Alt text *
            </label>
            <textarea
              id={`${item.id}-alt`}
              value={item.alt}
              rows={2}
              maxLength={ALT_MAX_CHARS}
              disabled={!editable}
              onChange={(e) => onChange({ alt: e.target.value })}
              className={`${inputClass} resize-y`}
            />
          </div>
          <div>
            <label htmlFor={`${item.id}-caption`} className="block text-xs font-medium text-gray-700 mb-0.5">
              Caption
            </label>
            <input
              id={`${item.id}-caption`}
              type="text"
              value={item.caption}
              maxLength={CAPTION_MAX_CHARS}
              disabled={!editable}
              onChange={(e) => onChange({ caption: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor={`${item.id}-category`} className="block text-xs font-medium text-gray-700 mb-0.5">
              Category
            </label>
            <select
              id={`${item.id}-category`}
              value={item.category}
              disabled={!editable}
              onChange={(e) => onChange({ category: e.target.value })}
              className={`${inputClass} bg-white`}
            >
              {uploadCategories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
