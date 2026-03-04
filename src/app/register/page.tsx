import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import RegistrationForm from "@/components/forms/RegistrationForm";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <>
      <PageHero
        title="Register for Lessons"
        subtitle="Sign up your child for free adaptive swim lessons."
      />

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-slate-600 text-base md:text-lg mb-10 text-center">
            Once you submit the form below, one of our coaches will reach out to
            you shortly with the next available date and time.
          </p>
          <RegistrationForm />
        </div>
      </section>
    </>
  );
}
