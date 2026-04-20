"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { GalleryPhoto, galleryCategories } from "@/data/gallery";

export default function AdminGalleryPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [images, setImages] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Upload form state
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("summer-2025");
  const [sortOrder, setSortOrder] = useState(0);

  const uploadCategories = galleryCategories.filter((c) => c.slug !== "all");

  function handleLogin() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthenticated(true);
      setMessage("");
    } else {
      setMessage("Incorrect password");
    }
  }

  async function fetchImages() {
    try {
      const res = await fetch("/api/admin/gallery");
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch {
      console.error("Failed to fetch images");
    }
  }

  useEffect(() => {
    if (authenticated) fetchImages();
  }, [authenticated]);

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setMessage("");

    try {
      // Read actual pixel dimensions from the file before uploading
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
      });
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      URL.revokeObjectURL(img.src);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", alt);
      formData.append("caption", caption);
      formData.append("category", category);
      formData.append("width", String(width));
      formData.append("height", String(height));
      formData.append("sort_order", String(sortOrder));

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage("Error: " + data.error);
      } else {
        setMessage("Image uploaded successfully!");
        setFile(null);
        setAlt("");
        setCaption("");
        setSortOrder(0);
        const fileInput = document.getElementById(
          "file-input"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        await fetchImages();
      }
    } catch {
      setMessage("Upload failed — check console for details.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, src: string) {
    if (!confirm("Delete this image? This cannot be undone.")) return;

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, src }),
      });

      if (res.ok) {
        setMessage("Image deleted.");
        await fetchImages();
      } else {
        const data = await res.json();
        setMessage("Error: " + data.error);
      }
    } catch {
      setMessage("Delete failed — check console for details.");
    } finally {
      setLoading(false);
    }
  }

  // ── Password gate ──────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Admin Access
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter admin password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            onClick={handleLogin}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Login
          </button>
          {message && (
            <p className="mt-3 text-red-600 text-sm text-center">{message}</p>
          )}
        </div>
      </div>
    );
  }

  // ── Admin UI ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gallery Manager</h1>
          <a
            href="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            View gallery &rarr;
          </a>
        </div>

        {message && (
          <div
            className={`mb-6 p-3 rounded-lg text-sm border ${
              message.startsWith("Error")
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-green-50 border-green-200 text-green-800"
            }`}
          >
            {message}
          </div>
        )}

        {/* ── Upload Form ── */}
        <section className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Upload New Image
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label
                htmlFor="file-input"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Image File *
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100 cursor-pointer"
              />
            </div>

            <div>
              <label
                htmlFor="alt-text"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Alt Text *
              </label>
              <input
                id="alt-text"
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                required
                placeholder="Describe the image for accessibility"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="caption-text"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Caption{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="caption-text"
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Short caption displayed on the photo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="category-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category *
                </label>
                <select
                  id="category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  {uploadCategories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="sort-order"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sort Order
                </label>
                <input
                  id="sort-order"
                  type="number"
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(parseInt(e.target.value, 10) || 0)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Uploading\u2026" : "Upload Image"}
            </button>
          </form>
        </section>

        {/* ── Image List ── */}
        <section className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Current Images{" "}
            <span className="text-gray-400 font-normal text-base">
              ({images.length})
            </span>
          </h2>

          {images.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No images uploaded yet. Use the form above to add your first
              photo.
            </p>
          ) : (
            <div className="space-y-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="relative w-20 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {img.alt}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {img.category} &middot; {img.width}&times;{img.height}px
                      {img.caption && (
                        <span className="italic">
                          {" "}
                          &middot; &ldquo;{img.caption}&rdquo;
                        </span>
                      )}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(img.id, img.src)}
                    disabled={loading}
                    className="flex-shrink-0 text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-40 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
