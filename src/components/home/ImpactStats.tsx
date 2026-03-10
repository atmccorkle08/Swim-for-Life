"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, BookOpen, Calendar, Heart } from "lucide-react";
import { stats } from "@/data/stats";
import SectionHeading from "@/components/ui/SectionHeading";
import WaveDivider from "@/components/ui/WaveDivider";

const statIcons = [Users, BookOpen, Calendar, Heart];
const statColors = [
  "bg-ocean/20 text-ocean-light border border-ocean/30",
  "bg-coral/20 text-coral-light border border-coral/30",
  "bg-ocean-light/20 text-ocean-light border border-ocean-light/30",
  "bg-coral/20 text-coral-light border border-coral/30",
];

function CountUp({
  target,
  suffix,
  inView,
}: {
  target: number;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function ImpactStats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="gradient-ocean-deep pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="OUR IMPACT"
          heading="Making a Difference"
          dark
          centered
        />

        <div
          ref={ref}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = statIcons[index];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`text-center rounded-2xl p-6 ${statColors[index]}`}
              >
                <div className="flex justify-center mb-3">
                  <Icon className="h-7 w-7" />
                </div>
                <p className="text-3xl md:text-4xl font-display font-extrabold text-white">
                  <CountUp
                    target={stat.numericValue}
                    suffix={stat.suffix}
                    inView={inView}
                  />
                </p>
                <p className="mt-2 text-cyan-200 text-sm font-medium">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <WaveDivider variant="gentle" fill="#ECFEFF" className="mt-16" />
    </section>
  );
}
