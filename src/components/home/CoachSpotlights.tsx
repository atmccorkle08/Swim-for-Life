import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { coaches } from "@/data/coaches";

const cardAccents = ["border-t-4 border-t-ocean", "border-t-4 border-t-coral"];
const ringColors = ["ring-4 ring-ocean/20", "ring-4 ring-coral/20"];

export default function CoachSpotlights() {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="MEET YOUR COACHES"
          heading="Led by Certified Instructors"
          accentWord="Certified"
          accentColor="text-ocean"
          centered
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {coaches.map((coach, index) => (
            <div
              key={coach.name}
              className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-8 text-center ${cardAccents[index % cardAccents.length]}`}
            >
              <div
                className={`relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 ${ringColors[index % ringColors.length]}`}
              >
                <Image
                  src={coach.photo}
                  alt={`${coach.name}, Swim for Life coach`}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-display text-xl font-bold text-deep">
                {coach.name}
              </h3>
              <p className="mt-3 text-stone-600 text-sm leading-relaxed">
                {coach.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
