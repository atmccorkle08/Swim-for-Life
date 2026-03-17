import SectionHeading from "@/components/ui/SectionHeading";
import NewsletterForm from "@/components/forms/NewsletterForm";

export default function NewsletterCTA() {
  return (
    <section className="bg-deep py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeading
          eyebrow="STAY CONNECTED"
          heading="Never Miss a Session"
          accentWord="Session"
          accentColor="text-coral"
          dark
          centered
        />
        <div className="mt-8">
          <NewsletterForm />
        </div>
        <p className="mt-4 text-sm text-cyan-300/60">
          We respect your inbox. No spam -- just updates that matter.
        </p>
      </div>
    </section>
  );
}
