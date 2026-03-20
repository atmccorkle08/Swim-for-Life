import { Metadata } from "next";
import GalleryPageClient from "@/components/gallery/GalleryPageClient";
import WaveDivider from "@/components/ui/WaveDivider";
import {
  galleryPhotos,
  galleryVideos,
  galleryCategories,
} from "@/data/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse photos and videos from Swim for Life lessons and events.",
};

export default function GalleryPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative gradient-hero">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-[20%] w-64 h-64 rounded-full bg-ocean-light/10 blur-3xl" />
          <div className="absolute bottom-10 left-[10%] w-48 h-48 rounded-full bg-coral/5 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-28">
          <p className="text-sm uppercase tracking-widest font-semibold text-ocean-light mb-3">
            OUR COMMUNITY
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white">
            Moments from <span className="text-coral">the Pool</span>
          </h1>
          <p className="mt-4 text-lg text-cyan-200 max-w-2xl mx-auto">
            See our swimmers in action! Browse photos and videos from our
            lessons and events.
          </p>
        </div>
        <WaveDivider variant="gentle" fill="#ECFEFF" />
      </section>

      {/* Gallery Content */}
      <GalleryPageClient
        photos={galleryPhotos}
        videos={galleryVideos}
        categories={galleryCategories}
      />
    </>
  );
}
