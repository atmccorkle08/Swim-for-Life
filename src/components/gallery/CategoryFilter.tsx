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
  return (
    <div className="flex flex-wrap justify-center gap-2 overflow-x-auto">
      {categories
        .sort((a, b) => a.order - b.order)
        .map((category) => {
          const isActive = activeCategory === category.slug;
          return (
            <button
              key={category.slug}
              onClick={() => onCategoryChange(category.slug)}
              aria-pressed={isActive}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {category.label}
            </button>
          );
        })}
    </div>
  );
}
