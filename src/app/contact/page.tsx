import type { Metadata } from "next";
import { Mail, Phone, Instagram, Youtube } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { coaches } from "@/data/coaches";
import { siteConfig } from "@/data/config";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Get in Touch"
        subtitle="Have questions? We'd love to hear from you."
      />

      <section className="py-20 md:py-24 bg-sky">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Coach Contact Cards */}
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-deep">
                Our Coaches
              </h2>
              {coaches.map((coach) => (
                <div
                  key={coach.name}
                  className="bg-white rounded-2xl p-6 border border-ocean/10 shadow-sm"
                >
                  <h3 className="font-display text-lg font-bold text-deep">
                    {coach.name}
                  </h3>
                  <div className="mt-3 space-y-2">
                    <a
                      href={`mailto:${coach.email}`}
                      className="flex items-center gap-2 text-stone-600 hover:text-ocean transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {coach.email}
                    </a>
                    <a
                      href={`tel:${coach.phone.replace(/[^+\d]/g, "")}`}
                      className="flex items-center gap-2 text-stone-600 hover:text-ocean transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      {coach.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps */}
            <div>
              <h2 className="font-display text-2xl font-bold text-deep mb-6">
                Our Location
              </h2>
              <div className="rounded-2xl overflow-hidden shadow-md border border-ocean/10">
                <iframe
                  src={siteConfig.location.mapsUrl}
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="North Palm Beach Country Club location"
                />
              </div>
              <p className="mt-4 text-stone-600 text-sm">
                {siteConfig.location.name} — {siteConfig.location.address}
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-16 text-center">
            <h2 className="font-display text-2xl font-bold text-deep">
              Follow Us
            </h2>
            <div className="mt-6 flex items-center justify-center gap-6">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-stone-600 hover:text-ocean transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-6 w-6" />
                <span className="font-medium">Instagram</span>
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-stone-600 hover:text-ocean transition-colors"
                aria-label="Subscribe on YouTube"
              >
                <Youtube className="h-6 w-6" />
                <span className="font-medium">YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
