import type { Metadata } from "next";
import { Clock, MapPin } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { lessonDescription } from "@/data/services";
import { siteConfig } from "@/data/config";

export const metadata: Metadata = {
  title: "Programs",
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        title="Our Programs"
        subtitle="Structured swim lessons designed for children of all abilities."
      />

      {/* Lesson Structure */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="LESSON STRUCTURE"
            heading="What to Expect"
            centered
          />
          <p className="mt-8 text-slate-600 text-base md:text-lg leading-relaxed">
            {lessonDescription}
          </p>
        </div>
      </section>

      {/* Schedule & Location */}
      <section className="py-20 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Schedule Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Schedule</h3>
              </div>
              <p className="text-slate-600 text-base leading-relaxed">
                Lessons run <strong>Monday through Thursday</strong> from{" "}
                <strong>11:00 AM to 12:00 PM</strong>. Each participant receives
                10 free lessons, approximately 20 minutes each.
              </p>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Location</h3>
              </div>
              <p className="text-slate-600 text-base leading-relaxed">
                <strong>{siteConfig.location.name}</strong>
                <br />
                {siteConfig.location.address}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading heading="Find Us" centered />
          <div className="mt-8 rounded-xl overflow-hidden shadow-lg">
            <iframe
              src={siteConfig.location.mapsUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="North Palm Beach Country Club location"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-navy text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-slate-400 text-lg">
            Register your child for our next available session.
          </p>
          <div className="mt-8">
            <Button href="/register" variant="primary" showArrow>
              Register Now
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
