"use client";

import { useEffect, useRef } from "react";

const STEPS = [
  {
    num: 1,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "소셜 로그인",
    desc: "카카오 또는 네이버로 가입하세요. 30초 완료.",
  },
  {
    num: 2,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
    title: "멜론 연동",
    desc: "스트리밍 내역으로 팬 신뢰 점수(FTS)를 산정합니다.",
  },
  {
    num: 3,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "등급 획득",
    desc: "점수에 따라 라이트닝·썬더·클라우드 등급이 자동 부여됩니다.",
  },
  {
    num: 4,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M13 5v2" />
        <path d="M13 17v2" />
        <path d="M13 11v2" />
      </svg>
    ),
    title: "선예매 시작",
    desc: "매크로 없는 공정한 티켓팅을 경험하세요.",
  },
];

export function HowItWorksSection() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stepsEl = stepsRef.current;
    const lineEl = lineRef.current;
    if (!stepsEl || !lineEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          lineEl.classList.add("visible");
          observer.unobserve(stepsEl);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(stepsEl);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how"
      className="relative py-[120px]"
      style={{
        background: "#0D0D1F",
        borderTop: "1px solid transparent",
        backgroundImage: "linear-gradient(#0D0D1F, #0D0D1F), linear-gradient(90deg, transparent, rgba(255,94,50,0.08), transparent)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      {/* Top border shimmer line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,94,50,0.08), transparent)",
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-[80px] landing-reveal">
          <div
            className="flex items-center justify-center gap-2.5 mb-4"
            style={{
              fontSize: "0.72rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#FF7A56",
            }}
          >
            <span className="w-5 h-px" style={{ background: "#FF7A56" }} />
            How It Works
          </div>
          <h2
            className="font-light mb-4"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#e8edf3", letterSpacing: "-0.03em", fontWeight: 200 }}
          >
            4단계면 선예매 완료
          </h2>
          <p style={{ fontSize: "0.88rem", color: "#94a3b8", maxWidth: "520px", margin: "0 auto", fontWeight: 300, lineHeight: 1.7 }}>
            복잡한 설치 없이, 소셜 로그인 하나로 모든 과정을 시작할 수 있습니다.
          </p>
        </div>

        {/* Steps */}
        <div ref={stepsRef} className="relative grid grid-cols-4 landing-stagger">
          {/* Connecting shimmer line */}
          <div
            ref={lineRef}
            className="landing-how-line absolute"
            style={{
              top: "40px",
              left: "calc(12.5% + 20px)",
              right: "calc(12.5% + 20px)",
              height: "2px",
              background:
                "linear-gradient(90deg, #FF5E32, #FF7A56, #1F2792, #FF5E32)",
              backgroundSize: "200% 100%",
              animation: "landing-line-shimmer 3s linear infinite",
            }}
          />

          {STEPS.map((step) => (
            <div
              key={step.num}
              className="flex flex-col items-center text-center px-6 relative landing-child"
            >
              {/* Step node */}
              <div
                className="relative flex items-center justify-center mb-6 z-10"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "#0D0D1F",
                  border: "2px solid #FF5E32",
                  color: "#FF7A56",
                  animation: "landing-glow-pulse 3s ease-in-out infinite",
                }}
              >
                {step.icon}
                {/* Number badge */}
                <span
                  className="absolute flex items-center justify-center text-white font-semibold"
                  style={{
                    top: "-6px",
                    right: "-6px",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #FF5E32, #1F2792)",
                    fontSize: "0.62rem",
                  }}
                >
                  {step.num}
                </span>
              </div>

              <h3
                className="font-medium mb-2"
                style={{ fontSize: "1.1rem", color: "#e8edf3", letterSpacing: "-0.02em" }}
              >
                {step.title}
              </h3>
              <p
                style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 300, lineHeight: 1.6, maxWidth: "200px" }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
