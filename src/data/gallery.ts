export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: string;
  width: number;
  height: number;
}

export interface GalleryVideo {
  id: string;
  /** A YouTube video ID or any YouTube link (watch, youtu.be, shorts, or embed URL). */
  youtube: string;
  title: string;
  description?: string;
  category: string;
}

export interface GalleryCategory {
  slug: string;
  label: string;
  order: number;
}

export const galleryCategories: GalleryCategory[] = [
  { slug: "all", label: "All", order: 0 },
  { slug: "summer-2026", label: "Summer 2026", order: 1 },
  { slug: "summer-2025", label: "Summer 2025", order: 2 },
  { slug: "summer-2024", label: "Summer 2024", order: 3 },
  { slug: "events", label: "Events", order: 4 },
];

// To add a video: upload it to YouTube, then add an entry here, e.g.
// {
//   id: "summer-2026-highlights",
//   youtube: "https://youtu.be/VIDEO_ID",
//   title: "Summer 2026 Highlights",
//   description: "Our swimmers' progress over the summer session.",
//   category: "summer-2026",
// },
export const galleryVideos: GalleryVideo[] = [];

/** Extracts the 11-character video ID from a YouTube ID or URL, or null if invalid. */
export function getYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match ? match[1] : null;
}
