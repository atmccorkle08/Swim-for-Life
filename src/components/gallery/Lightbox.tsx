"use client";

import LightboxComponent from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { GalleryPhoto } from "@/data/gallery";

interface LightboxProps {
  photos: GalleryPhoto[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function Lightbox({
  photos,
  initialIndex,
  isOpen,
  onClose,
}: LightboxProps) {
  const slides = photos.map((photo) => ({
    src: photo.src,
    alt: photo.alt,
    title: photo.caption,
    width: photo.width,
    height: photo.height,
  }));

  return (
    <LightboxComponent
      open={isOpen}
      close={onClose}
      index={initialIndex}
      slides={slides}
      plugins={[Captions, Counter, Zoom]}
      styles={{
        container: { backgroundColor: "rgba(22, 78, 99, 0.95)" },
      }}
      carousel={{ finite: false }}
      animation={{ swipe: 250 }}
    />
  );
}
