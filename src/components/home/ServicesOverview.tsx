import Image from "next/image";
import { GraduationCap, ShieldCheck, Heart, Waves } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import WaveDivider from "@/components/ui/WaveDivider";

const programFeatures = [
  {
    icon: Waves,
    title: "Free Lessons",
    description: "10 free lessons, 20 minutes each, Monday through Thursday",
    color: "bg-ocean/15 text-ocean-light",
  },
  {
    icon: GraduationCap,
    title: "Certified Instructors",
    description: "Red Cross certified Water Safety Instructors",
    color: "bg-coral/15 text-coral-light",
  },
  {
    icon: Heart,
    title: "Adaptive Program",
    description: "Adaptive instruction for children with IDD",
    color: "bg-sand text-amber-500",
  },
  {
    icon: ShieldCheck,
    title: "Safe Environment",
    description: "Safe, inclusive environment at North Palm Beach Country Club",
    color: "bg-ocean-light/15 text-ocean-light",
  },
];

export default function ServicesOverview() {
  return (
    <>
      <WaveDivider variant="gentle" fill="#164E63" className="-mb-1" />
      <section className="bg-deep py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Feature Cards */}
            <div>
              <SectionHeading
                eyebrow="OUR PROGRAMS"
                heading="Specialized Aquatic Education"
                accentWord="Aquatic"
                accentColor="text-ocean-light"
                dark
              />

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {programFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="rounded-2xl bg-deep-light/50 border border-cyan-800/50 p-5"
                    >
                      <div
                        className={`w-11 h-11 rounded-xl ${feature.color} flex items-center justify-center mb-3`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display font-bold text-white text-sm">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-cyan-200 text-xs leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8">
                <Button href="/programs" variant="primary" showArrow>
                  Explore Programs
                </Button>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative h-80 lg:h-[28rem] rounded-2xl overflow-hidden ring-4 ring-ocean/20">
              <Image
                src="/images/pool-atmosphere.svg"
                alt="Children learning to swim in a pool with instructors"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <WaveDivider variant="gentle" fill="#FFFFFF" bgColor="#164E63" className="-mt-1" />
    </>
  );
}
