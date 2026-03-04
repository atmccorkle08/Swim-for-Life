import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export default function MissionPreview() {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading
            eyebrow="WHO WE ARE"
            heading="Spreading Ripples of Inclusion"
            centered
          />

          <div className="mt-8 space-y-4 text-slate-600 text-base md:text-lg leading-relaxed">
            <p>
              While organizing a Swim for Understanding Meet with Best Buddies
              International, we learned of the need for water safety lessons
              within various groups in our community, including the Intellectual
              and Developmental Disabilities (IDD) community.
            </p>
            <p>
              Swim for Life was born to help close that gap. We provide 10 free
              swim lessons per session, teaching water safety, confidence, and
              essential swimming skills in a supportive, inclusive environment.
            </p>
          </div>

          <div className="mt-8">
            <Button href="/about" variant="primary" showArrow>
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
