"use client";

import { useState } from "react";
import { GalleryPhoto, GalleryVideo, GalleryCategory } from "@/data/gallery";
import CategoryFilter from "./CategoryFilter";
import PhotoGrid from "./PhotoGrid";
import VideoGrid from "./VideoGrid";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

interface GalleryPageClientProps {
  photos: GalleryPhoto[];
  videos: GalleryVideo[];
  categories: GalleryCategory[];
}

export default function GalleryPageClient({
  photos,
  videos,
  categories,
}: GalleryPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPhotos =
    activeCategory === "all"
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  const filteredVideos =
    activeCategory === "all"
      ? videos
      : videos.filter((v) => v.category === activeCategory);

  return (
    <>
      {/* Category Filter */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="PHOTOS" heading="Our Gallery" centered />
          <div className="mt-10">
            <PhotoGrid photos={filteredPhotos} />
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="bg-navy py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="VIDEOS"
            heading="Watch Our Swimmers in Action"
            dark
            centered
          />
          <div className="mt-10">
            <VideoGrid videos={filteredVideos} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            Want to See Your Child Here?
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-600 max-w-xl mx-auto">
            Register for free swim lessons and join our inclusive aquatic
            community.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/register" variant="primary" showArrow>
              Register Now
            </Button>
            <Button href="/donate" variant="secondary">
              Support Our Mission
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
