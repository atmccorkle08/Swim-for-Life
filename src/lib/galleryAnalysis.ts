// Shared (client + server) constants and types for AI-assisted gallery uploads.
// Keep this file free of server-only imports so the admin UI can use it too.

/** Flags the AI model may report for a photo. */
export const AI_PHOTO_FLAGS = [
  "blurry",
  "poor_lighting",
  "no_people",
  "face_close_up_of_child",
  "visible_personal_info",
  "inappropriate",
] as const;

/**
 * Flags computed in the browser (the model sees one photo at a time, so it
 * cannot detect near-duplicates within a batch).
 */
export const CLIENT_PHOTO_FLAGS = ["duplicate_like"] as const;

export type AiPhotoFlag = (typeof AI_PHOTO_FLAGS)[number];
export type PhotoFlag = AiPhotoFlag | (typeof CLIENT_PHOTO_FLAGS)[number];

export const PHOTO_FLAG_LABELS: Record<PhotoFlag, string> = {
  blurry: "Blurry",
  poor_lighting: "Poor lighting",
  no_people: "No people",
  face_close_up_of_child: "Child face close-up",
  visible_personal_info: "Visible personal info",
  inappropriate: "Inappropriate",
  duplicate_like: "Possible duplicate",
};

/** Flags that cause a photo to be unchecked (excluded) by default. */
export const AUTO_EXCLUDE_FLAGS: ReadonlySet<PhotoFlag> = new Set<PhotoFlag>([
  "blurry",
  "inappropriate",
]);

/** DB column limits for gallery_images. */
export const ALT_MAX_CHARS = 300;
export const CAPTION_MAX_CHARS = 500;

export interface PhotoAnalysis {
  alt: string;
  caption: string;
  category: string;
  quality: number; // 1–10
  flags: AiPhotoFlag[];
}
