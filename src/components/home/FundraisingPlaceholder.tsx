import { Heart } from "lucide-react";
import Button from "@/components/ui/Button";

export default function FundraisingPlaceholder() {
  return (
    <section className="bg-navy py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Support Our Mission
        </h2>
        <p className="mt-4 text-slate-400 text-base md:text-lg max-w-xl mx-auto">
          Help us continue providing free swim lessons to children in our
          community.
        </p>
        <div className="mt-8">
          <Button href="#" variant="primary" icon={<Heart className="h-4 w-4" />}>
            Donate
          </Button>
        </div>
      </div>
    </section>
  );
}
