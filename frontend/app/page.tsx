"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/landing/HeroSection";
import OutcomeSection from "@/components/landing/OutcomeSection";
import MatchSection from "@/components/landing/MatchSection";
import EcosystemSection from "@/components/landing/EcosystemSection";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import JourneySection from "@/components/landing/JourneySection";
import PrincipleSection from "@/components/landing/PrincipleSection";
import CompareSection from "@/components/landing/CompareSection";
import PersonaSection from "@/components/landing/PersonaSection";
import ArchiveSection from "@/components/landing/ArchiveSection";
import LeaderSection from "@/components/landing/LeaderSection";
import FinalCtaSection from "@/components/landing/FinalCtaSection";
import LandingFooter from "@/components/landing/LandingFooter";
import { myGroups } from "@/lib/store";
import { useCurrentUser, useMounted } from "@/lib/useStore";

/**
 * 랜딩 — 거시 생태계(Macro View) → 관심사×연관도서(핵심 논지) → 최종 결과물(기획안) → 문제 퍼널 → 3단계 동작 → SMILE+P → 비교 → CTA
 */
export default function LandingPage() {
  const mounted = useMounted();
  const user = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!mounted || !user) return;
    const gs = myGroups();
    if (gs.length > 0) router.replace(`/groups/${gs[0].id}`);
  }, [mounted, user, router]);

  return (
    <div className="bg-black">
      <HeroSection />
      <EcosystemSection />
      <MatchSection />
      <OutcomeSection />
      <ProblemSection />
      <HowItWorksSection />
      <JourneySection />
      <PrincipleSection />
      <CompareSection />
      <PersonaSection />
      <ArchiveSection />
      <LeaderSection />
      <FinalCtaSection />
      <LandingFooter />
    </div>
  );
}
