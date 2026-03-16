"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`border rounded-2xl overflow-hidden transition-colors duration-200 ${
              isOpen
                ? "border-ocean/30 bg-white shadow-md"
                : "border-ocean/15 bg-white"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(index);
                }
              }}
              className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-deep hover:bg-sky/50 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-display">{item.question}</span>
              <ChevronDown
                className={`h-5 w-5 text-ocean transition-transform duration-200 flex-shrink-0 ml-4 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                isOpen ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="px-6 pb-4 text-stone-600 leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
