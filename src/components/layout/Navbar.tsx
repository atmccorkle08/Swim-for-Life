"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X } from "lucide-react";
import { siteConfig } from "@/data/config";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 12C2 12 5 9 8 9C11 9 13 12 16 12C19 12 22 9 22 9"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M2 17C2 17 5 14 8 14C11 14 13 17 16 17C19 17 22 14 22 14"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="text-lg font-bold text-slate-800">Swim For Life</span>
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-primary border-b-2 border-primary pb-0.5"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#"
              className="inline-flex items-center gap-1.5 bg-primary text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-primary-hover transition-colors"
            >
              <Heart className="h-4 w-4" />
              Donate
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-slate-600 hover:text-slate-800"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40">
          <div className="flex flex-col items-center gap-6 pt-12">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-medium ${
                  pathname === link.href ? "text-primary" : "text-slate-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/register"
              className="text-lg font-medium text-slate-800"
            >
              Register
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-8 py-3 font-semibold hover:bg-primary-hover transition-colors mt-4"
            >
              <Heart className="h-4 w-4" />
              Donate
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
