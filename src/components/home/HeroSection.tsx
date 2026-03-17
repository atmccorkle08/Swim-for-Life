"use client";

import { motion } from "framer-motion";
import { ChevronDown, Heart } from "lucide-react";
import Button from "@/components/ui/Button";
import WaveDivider from "@/components/ui/WaveDivider";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[15%] right-[10%] w-80 h-80 rounded-full bg-ocean-light/10 blur-3xl" />
        <div className="absolute bottom-[20%] left-[5%] w-64 h-64 rounded-full bg-coral/8 blur-3xl" />
        <div className="absolute top-[40%] left-[30%] w-48 h-48 rounded-full bg-ocean/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl md:text-7xl font-extrabold text-white"
        >
          Swimming Without
          <br />
          <span className="text-ocean-light">Boundaries</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-cyan-200 max-w-2xl mx-auto"
        >
          An inclusive aquatic program for children of all abilities,
          specializing in adaptive lessons for those with intellectual and
          developmental disabilities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button href="/programs" variant="primary" showArrow>
            View Programs
          </Button>
          <Button
            href="#"
            variant="coral"
            icon={<Heart className="h-4 w-4" />}
          >
            Support Our Mission
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="h-8 w-8 text-white/40" />
      </motion.div>

      
    </section>
  );
}
