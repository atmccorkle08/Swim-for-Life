import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { coaches } from "@/data/coaches";

export default function CoachSpotlights() {
  return (
    <section className="py-20 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="MEET YOUR COACHES"
          heading="Led by Certified Instructors"
          centered
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {coaches.map((coach) => (
            <div
              key={coach.name}
              className="bg-white rounded-xl shadow-lg p-8 text-center"
            >
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-6">
                <Image
                  src={coach.photo}
                  alt={`${coach.name}, Swim for Life coach`}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                {coach.name}
              </h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                {coach.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
