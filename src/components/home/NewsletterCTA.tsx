import SectionHeading from "@/components/ui/SectionHeading";
import NewsletterForm from "@/components/forms/NewsletterForm";

export default function NewsletterCTA() {
  return (
    <section className="bg-slate-800 py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeading
          eyebrow="STAY CONNECTED"
          heading="Never Miss a Session"
          subtitle="Get notified when new sessions open, see impact updates, and stay connected with our community."
          dark
          centered
        />
        <div className="mt-8">
          <NewsletterForm />
        </div>
        <p className="mt-4 text-sm text-slate-500">
          We respect your inbox. No spam -- just updates that matter.
        </p>
      </div>
    </section>
  );
}
