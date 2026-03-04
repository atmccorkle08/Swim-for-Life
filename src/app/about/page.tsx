import type { Metadata } from "next";
import { Shield, Users, Heart } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
};

const values = [
  {
    icon: Users,
    title: "Inclusion",
    description:
      "Every child deserves the chance to learn to swim, regardless of ability. Our program welcomes children of all backgrounds and skill levels.",
  },
  {
    icon: Shield,
    title: "Safety",
    description:
      "Water safety is at the core of everything we do. Our Red Cross certified instructors ensure every lesson prioritizes the well-being of each participant.",
  },
  {
    icon: Heart,
    title: "Community",
    description:
      "We believe in the power of community. Swim for Life brings together families, volunteers, and local organizations to support our mission.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Swim for Life"
        subtitle="Our story, our mission, and the team behind it all."
      />

      {/* Mission Section */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="OUR STORY"
            heading="How It All Started"
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
            <p>
              Our coaches are active competitive swimmers with years of
              experience and a deep commitment to making aquatic education
              accessible for everyone. Through patience, adaptive instruction
              techniques, and genuine care, we create an environment where every
              child can thrive.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="WHAT WE STAND FOR"
            heading="Our Core Values"
            centered
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white rounded-xl shadow-lg p-8 text-center"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 mb-6">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading
            eyebrow="CREDENTIALS"
            heading="Certified & Trusted"
            centered
          />
          <p className="mt-6 text-slate-600 text-base md:text-lg leading-relaxed">
            All Swim for Life coaches are American Red Cross Certified Water
            Safety Instructors (WSI) and Certified Lifeguards. Our program is
            connected to Best Buddies International and is a registered 501(c)(3)
            non-profit organization.
          </p>
          <div className="mt-8">
            <Button href="/register" variant="primary" showArrow>
              Ready to Join?
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
