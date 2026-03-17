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

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: "photo-1",
    src: "/images/gallery/placeholder-1.jpg",
    alt: "Children learning to float during a Swim for Life lesson",
    caption: "First-time floaters!",
    category: "summer-2025",
    width: 800,
    height: 600,
  },
  {
    id: "photo-2",
    src: "/images/gallery/placeholder-2.jpg",
    alt: "Coach Aidan helping a swimmer practice the backstroke",
    category: "summer-2025",
    width: 800,
    height: 600,
  },
  {
    id: "photo-3",
    src: "/images/gallery/placeholder-3.jpg",
    alt: "Group water safety exercise at North Palm Beach Country Club",
    caption: "Teamwork makes the dream work",
    category: "spring-2025",
    width: 800,
    height: 600,
  },
  {
    id: "photo-4",
    src: "/images/gallery/placeholder-4.jpg",
    alt: "Swimmer celebrating after completing the front crawl",
    category: "summer-2025",
    width: 800,
    height: 600,
  },
  {
    id: "photo-5",
    src: "/images/gallery/placeholder-5.jpg",
    alt: "Coach Blake demonstrating treading water technique",
    category: "spring-2025",
    width: 800,
    height: 600,
  },
  {
    id: "photo-6",
    src: "/images/gallery/placeholder-6.jpg",
    alt: "Swim for Life community event group photo",
    caption: "Our amazing community",
    category: "events",
    width: 800,
    height: 600,
  },
  {
    id: "photo-7",
    src: "/images/gallery/placeholder-7.jpg",
    alt: "Young swimmers lined up at the pool edge for safety drill",
    category: "summer-2025",
    width: 800,
    height: 600,
  },
  {
    id: "photo-8",
    src: "/images/gallery/placeholder-8.jpg",
    alt: "Parent and child at the pool during a lesson",
    category: "spring-2025",
    width: 800,
    height: 600,
  },
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
