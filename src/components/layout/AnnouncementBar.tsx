"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { siteConfig } from "@/data/config";

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-navy-light text-white text-sm py-2 px-4 relative">
      <div className="max-w-7xl mx-auto text-center">
        <p>{siteConfig.announcement}</p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
