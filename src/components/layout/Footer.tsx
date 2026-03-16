import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Youtube } from "lucide-react";
import { siteConfig } from "@/data/config";

function FooterLogo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-9 h-9 bg-ocean rounded-lg flex items-center justify-center">
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
      <span className="text-lg font-display font-bold text-white">
        Swim For Life
      </span>
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-deep text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Logo + Tagline + Social */}
          <div>
            <FooterLogo />
            <p className="mt-4 text-cyan-200 text-sm leading-relaxed">
              {siteConfig.tagline}
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="text-cyan-300 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe on YouTube"
                className="text-cyan-300 hover:text-white transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 text-ocean-light">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-cyan-200">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="hover:text-white transition-colors"
                >
                  Programs
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-white transition-colors"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Programs */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 text-ocean-light">
              Our Programs
            </h3>
            <ul className="space-y-3 text-sm text-cyan-200">
              <li>Free Swim Lessons</li>
              <li>Water Safety Basics</li>
              <li>Adaptive Instruction</li>
            </ul>
          </div>

          {/* Column 4: Get In Touch */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 text-ocean-light">
              Get In Touch
            </h3>
            <ul className="space-y-3 text-sm text-cyan-200">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-ocean-light" />
                <span>{siteConfig.location.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-ocean-light" />
                <a
                  href="tel:+19178213667"
                  className="hover:text-white transition-colors"
                >
                  (917)-821-3667
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-ocean-light" />
                <a
                  href="mailto:atmccorkle08@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  atmccorkle08@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-cyan-800">
          <p className="text-sm text-cyan-300 text-center">
            Swim for Life is a registered 501(c)(3) non-profit. All donations
            are tax-deductible. | &copy; {new Date().getFullYear()} Swim for
            Life. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
