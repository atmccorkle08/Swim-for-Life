"use client";

import { GalleryCategory } from "@/data/gallery";

interface CategoryFilterProps {
  categories: GalleryCategory[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const sorted = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {sorted.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <button
            key={cat.slug}
            onClick={() => onCategoryChange(cat.slug)}
            aria-pressed={isActive}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-ocean text-white shadow-sm"
                : "bg-white text-deep border border-ocean/20 hover:bg-ocean/10"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
