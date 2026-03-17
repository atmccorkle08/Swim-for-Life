import { Metadata } from "next";
import {
  galleryPhotos,
  galleryVideos,
  galleryCategories,
} from "@/data/gallery";
import GalleryPageClient from "@/components/gallery/GalleryPageClient";

export const metadata: Metadata = {
  title: "Gallery",
};

export default function GalleryPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-widest font-semibold text-primary mb-3">
            OUR COMMUNITY
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Moments from <span className="text-primary">the Pool</span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            See our swimmers in action! Browse photos and videos from our
            lessons and events.
          </p>
        </div>
      </section>

      <GalleryPageClient
        photos={galleryPhotos}
        videos={galleryVideos}
        categories={galleryCategories}
      />
    </>
  );
}
