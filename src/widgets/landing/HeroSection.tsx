"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AuroraBackground } from "./AuroraBackground";

export function HeroSection() {
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const indicator = scrollIndicatorRef.current;
    if (!indicator) return;
    const onScroll = () => {
      indicator.style.opacity = String(Math.max(0, 1 - window.scrollY / 300));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "#0A0A1A" }}
    >
      {/* Aurora background — UnicornStudio + Three.js particles */}
      <AuroraBackground />

      {/* Bottom fade to next section */}
      <div
        className="absolute bottom-0 left-0 w-full h-[30%] z-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #0A0A1A)" }}
      />

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center max-w-[700px] mx-auto w-full">
        {/* Badge */}
        <div className="landing-reveal">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-[0.72rem] font-medium tracking-[0.02em]"
            style={{
              border: "1px solid rgba(255,94,50,0.2)",
              background: "rgba(255,94,50,0.06)",
              color: "#FF7A56",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#FF7A56",
                animation: "landing-pulse-dot 2s ease-in-out infinite",
              }}
            />
            K-POP 찐팬을 위한 공정 티켓팅
          </div>

          {/* Headline */}
          <h1
            className="font-light leading-[1.1] mb-0"
            style={{
              fontSize: "clamp(2.4rem, 5.5vw, 3.6rem)",
              letterSpacing: "-0.04em",
              color: "#e8edf3",
              fontWeight: 200,
            }}
          >
            매크로는 이제 그만.
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #FF5E32 0%, #FF7A56 50%, #FFB347 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 400,
              }}
            >
              진짜 팬
            </span>
            이 먼저입니다.
          </h1>
        </div>

        {/* Description + CTAs */}
        <div className="landing-reveal flex flex-col items-center gap-5 mt-6">
          <p
            className="font-light leading-[1.7] max-w-[420px]"
            style={{
              fontSize: "0.92rem",
              color: "#94a3b8",
              fontWeight: 300,
            }}
          >
            좋아한 만큼, 먼저 예매하세요.
            <br />
            팬 신뢰 점수가 높을수록 티켓에 가까워집니다.
          </p>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            {/* Primary CTA — conic border */}
            <Link
              href="/onboarding"
              className="relative z-10 overflow-hidden px-8 py-3.5 rounded-xl text-[0.84rem] font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
              style={{ background: "#0A0A1A" }}
            >
              {/* conic border */}
              <span
                className="absolute pointer-events-none"
                style={{
                  inset: "-2px",
                  borderRadius: "14px",
                  background:
                    "conic-gradient(from var(--border-angle), #FF5E32, #FF7A56, #1F2792, #FF8060, #FF5E32)",
                  zIndex: -2,
                  animation: "landing-border-spin 3s linear infinite",
                }}
              />
              {/* inner bg */}
              <span
                className="absolute pointer-events-none"
                style={{
                  inset: "2px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, rgba(255,94,50,0.15), rgba(10,10,26,0.95))",
                  zIndex: -1,
                }}
              />
              {/* shimmer */}
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
                  backgroundSize: "200% 100%",
                  animation: "landing-shimmer 2.5s ease-in-out infinite",
                  backgroundPosition: "var(--shimmer-pos) center",
                }}
              />
              무료로 시작하기
            </Link>

            {/* Ghost CTA */}
            <Link
              href="/onboarding"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-[0.84rem] font-light transition-all duration-300 hover:-translate-y-0.5"
              style={{
                color: "#94a3b8",
                border: "1px solid rgba(255,94,50,0.15)",
                background: "rgba(255,94,50,0.04)",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#e8edf3";
                e.currentTarget.style.borderColor = "rgba(255,94,50,0.3)";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(255,94,50,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.borderColor = "rgba(255,94,50,0.15)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* play icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              기능 살펴보기
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 pointer-events-none"
        style={{
          color: "#4b5e78",
          fontSize: "0.68rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        <span>scroll</span>
        <div
          className="w-px h-10"
          style={{
            background: "linear-gradient(to bottom, #FF5E32, transparent)",
            animation: "landing-scroll-bounce 2s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
