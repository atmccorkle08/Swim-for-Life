"use client";

import { useState } from "react";
import {
  GalleryPhoto,
  GalleryVideo,
  GalleryCategory,
} from "@/data/gallery";
import CategoryFilter from "./CategoryFilter";
import PhotoGrid from "./PhotoGrid";
import VideoGrid from "./VideoGrid";
import SectionHeading from "@/components/ui/SectionHeading";
import WaveDivider from "@/components/ui/WaveDivider";
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
      <div className="bg-sky py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </div>

      {/* Photo Gallery */}
      <section className="bg-sky py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="PHOTOS"
            heading="Our Gallery"
            accentWord="Gallery"
            accentColor="text-coral"
            centered
          />
          <div className="mt-12">
            <PhotoGrid photos={filteredPhotos} />
          </div>
        </div>
      </section>

      <WaveDivider variant="gentle" fill="#164E63" bgColor="#ECFEFF" />

      {/* Video Section */}
      <section className="bg-deep py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="VIDEOS"
            heading="Watch Our Swimmers in Action"
            accentWord="Action"
            accentColor="text-coral"
            dark
            centered
          />
          <div className="mt-12">
            <VideoGrid videos={filteredVideos} />
          </div>
        </div>
      </section>

      <WaveDivider variant="gentle" fill="#ECFEFF" bgColor="#164E63" />

      {/* CTA Section */}
      <section className="bg-sky py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-deep">
            Want to See Your Child Here?
          </h2>
          <p className="mt-4 text-stone-600 text-base md:text-lg max-w-xl mx-auto">
            Register for free swim lessons and join our inclusive aquatic
            community.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/register" variant="primary" showArrow>
              Register Now
            </Button>
            <Button href="#" variant="coral">
              Support Our Mission
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
