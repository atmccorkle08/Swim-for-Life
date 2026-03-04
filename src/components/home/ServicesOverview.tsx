import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { serviceFeatures } from "@/data/services";

export default function ServicesOverview() {
  return (
    <section className="bg-navy py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <SectionHeading
              eyebrow="OUR PROGRAMS"
              heading="Specialized Aquatic Education"
              dark
            />

            <ul className="mt-8 space-y-4">
              {serviceFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-base md:text-lg">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button href="/programs" variant="primary" showArrow>
                Explore Programs
              </Button>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative h-80 lg:h-[28rem] rounded-xl overflow-hidden">
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
  );
}
