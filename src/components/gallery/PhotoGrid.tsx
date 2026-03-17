"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { GalleryPhoto } from "@/data/gallery";
import Lightbox from "./Lightbox";

interface PhotoGridProps {
  photos: GalleryPhoto[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <p className="text-center text-slate-500 py-12">
        No photos yet for this session. Check back soon!
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => {
                setSelectedIndex(index);
                setLightboxOpen(true);
              }}
              className="group relative aspect-[4/3] w-full rounded-xl overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {photo.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="p-4 text-white text-sm font-medium">
                    {photo.caption}
                  </p>
                </div>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      <Lightbox
        photos={photos}
        initialIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
