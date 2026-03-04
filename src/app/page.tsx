import HeroSection from "@/components/home/HeroSection";
import ImpactStats from "@/components/home/ImpactStats";
import MissionPreview from "@/components/home/MissionPreview";
import ServicesOverview from "@/components/home/ServicesOverview";
import CoachSpotlights from "@/components/home/CoachSpotlights";
import FundraisingPlaceholder from "@/components/home/FundraisingPlaceholder";
import NewsletterPlaceholder from "@/components/home/NewsletterPlaceholder";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ImpactStats />
      <MissionPreview />
      <ServicesOverview />
      <CoachSpotlights />
      <FundraisingPlaceholder />
      <NewsletterPlaceholder />
    </>
  );
}
