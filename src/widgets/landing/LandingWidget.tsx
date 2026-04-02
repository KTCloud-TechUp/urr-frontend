"use client";

import { useEffect } from "react";
import { LandingNav } from "./LandingNav";
import { HeroSection } from "./HeroSection";
import { ArtistMarquee } from "./ArtistMarquee";
import { BentoFeaturesSection } from "./BentoFeaturesSection";
import { ArtistScrollSection } from "./ArtistScrollSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { MetricsSection } from "./MetricsSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { MembershipTierSection } from "./MembershipTierSection";
import { FinalCTASection } from "./FinalCTASection";
import { LandingFooter } from "./LandingFooter";

export function LandingWidget() {
  // Global scroll reveal via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document
      .querySelectorAll(".landing-reveal, .landing-stagger")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "#0A0A1A", overflowX: "hidden" }}>
      <LandingNav />
      <div style={{ paddingTop: "53px" }}>
        <HeroSection />
        <ArtistMarquee />
        <BentoFeaturesSection />
        <ArtistScrollSection />
        <HowItWorksSection />
        <MetricsSection />
        <TestimonialsSection />
        <MembershipTierSection />
        <FinalCTASection />
        <LandingFooter />
      </div>
    </div>
  );
}
