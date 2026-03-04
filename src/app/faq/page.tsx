import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Accordion from "@/components/ui/Accordion";
import { faqItems } from "@/data/faq";

export const metadata: Metadata = {
  title: "FAQ",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about Swim for Life."
      />

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion items={faqItems} />
        </div>
      </section>
    </>
  );
}
