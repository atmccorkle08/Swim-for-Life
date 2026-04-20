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
  youtubeId: string;
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
  { slug: "summer-2025", label: "Summer 2025", order: 1 },
  { slug: "spring-2025", label: "Spring 2025", order: 2 },
  { slug: "events", label: "Events", order: 3 },
];

export const galleryVideos: GalleryVideo[] = [
  {
    id: "video-1",
    youtubeId: "placeholder_id_1",
    title: "Swim for Life — Summer 2025 Highlights",
    description:
      "Watch our swimmers grow in confidence and skill over the summer session.",
    category: "summer-2025",
  },
  {
    id: "video-2",
    youtubeId: "placeholder_id_2",
    title: "What is Swim for Life?",
    description:
      "Learn about our mission to provide inclusive aquatic education for children of all abilities.",
    category: "events",
  },
  {
    id: "video-3",
    youtubeId: "placeholder_id_3",
    title: "Spring 2025 Session Recap",
    category: "spring-2025",
  },
];
