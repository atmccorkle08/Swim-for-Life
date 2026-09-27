import type { Metadata } from "next";
import { HeartHandshake, Waves, Users } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import DonationForm from "@/components/donate/DonationForm";
import { stats } from "@/data/stats";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Swim for Life, a 501(c)(3) nonprofit providing free swim lessons to children of all abilities in North Palm Beach, FL. Give once or monthly.",
};

const reasons = [
  {
    icon: Waves,
    title: "Lessons stay 100% free",
    body: "Families never pay for lessons. Donations cover what it takes to keep the program running.",
  },
  {
    icon: Users,
    title: "Every ability welcome",
    body: "Your gift helps us teach children of all abilities, including adaptive lessons for kids with intellectual and developmental disabilities.",
  },
  {
    icon: HeartHandshake,
    title: "Community powered",
    body: "Swim for Life is funded entirely by donations and community support. Every dollar makes a difference.",
  },
];

export default function DonatePage() {
  return (
    <>
      <PageHero
        title="Support Our Mission"
        subtitle="Help us keep swim lessons free for every child in our community."
      />

      <section className="py-20 md:py-24 bg-sky">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            {/* Impact copy */}
            <div className="lg:col-span-3">
              <SectionHeading
                eyebrow="WHY GIVE"
                heading="Every Dollar Keeps Lessons Free"
                accentWord="Free"
                subtitle="Learning to swim is a life skill every child deserves. Your donation helps Swim for Life offer free lessons to children of all abilities in North Palm Beach."
              />

              <ul className="mt-10 space-y-6">
                {reasons.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-coral/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-coral" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-deep">
                        {title}
                      </h3>
                      <p className="mt-1 text-stone-600 leading-relaxed">
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col bg-white rounded-2xl p-4 text-center border border-ocean/10 shadow-sm"
                  >
                    <dt className="text-xs uppercase tracking-wide font-semibold text-stone-500">
                      {stat.label}
                    </dt>
                    <dd className="order-first font-display text-2xl md:text-3xl font-bold text-ocean">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Donation form */}
            <div className="order-first lg:order-last lg:col-span-2 lg:sticky lg:top-24">
              <h2 className="font-display text-2xl font-bold text-deep mb-4">
                Make a Donation
              </h2>
              <DonationForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
