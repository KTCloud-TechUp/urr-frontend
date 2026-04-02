"use client";

import { useEffect, useRef } from "react";

const BAR_HEIGHTS = [0.35, 0.72, 0.55, 0.90, 0.45, 0.82, 0.65, 0.78];

const LOG_LINES = [
  { time: "13:04:21", type: "BLOCK", typeColor: "#f87171", msg: "매크로 봇 차단 — IP 203.xx.xx.12" },
  { time: "13:04:22", type: "BOOK", typeColor: "#FF7A56", msg: "⚡ 이수연 — IVE 팬콘 예매 성공" },
  { time: "13:04:23", type: "BLOCK", typeColor: "#f87171", msg: "매크로 봇 차단 — 자동입력 감지" },
  { time: "13:04:24", type: "BOOK", typeColor: "#FF7A56", msg: "⚡ 김민준 — aespa SYNK 예매 성공" },
  { time: "13:04:25", type: "BLOCK", typeColor: "#f87171", msg: "매크로 봇 차단 — 비정상 요청 패턴" },
  { time: "13:04:26", type: "BOOK", typeColor: "#34d399", msg: "☁️ 박지훈 — SEVENTEEN 예매 성공" },
];


const PRIORITY_TIERS = [
  { key: "lightning", name: "라이트닝", timing: "선예매 1순위", bar: 100, color: "#FF7A56" },
  { key: "thunder", name: "썬더", timing: "선예매 +1h", bar: 75, color: "#FFA060" },
  { key: "cloud", name: "클라우드", timing: "선예매 +1day", bar: 50, color: "#7E8CDA" },
  { key: "mist", name: "미스트", timing: "일반 예매", bar: 25, color: "#4b5e78" },
];

const PROGRESS_ITEMS = [
  { label: "멜론 스트리밍", value: "86%", width: "86%" },
  { label: "티켓 활동", value: "72%", width: "72%" },
  { label: "플랫폼 활동", value: "45%", width: "45%" },
];

interface BentoCardProps {
  children: React.ReactNode;
  span2?: boolean;
  onAnimate?: (el: HTMLDivElement) => void;
}

function BentoCard({ children, span2, onAnimate }: BentoCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("landing-bento-animated");
          onAnimate?.(el);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onAnimate]);

  return (
    <div
      ref={ref}
      className={`relative p-7 rounded-2xl overflow-hidden transition-all duration-350 group${span2 ? " col-span-2" : ""}`}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,94,50,0.10)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(-3px)";
        el.style.borderColor = "rgba(255,94,50,0.15)";
        el.style.background = "rgba(255,255,255,0.045)";
        el.style.boxShadow = "0 8px 32px rgba(255,94,50,0.06)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "";
        el.style.borderColor = "rgba(255,94,50,0.10)";
        el.style.background = "rgba(255,255,255,0.03)";
        el.style.boxShadow = "";
      }}
    >
      {/* Top-edge glow on hover */}
      <div
        className="absolute top-0 pointer-events-none transition-all duration-400"
        style={{
          left: "20%",
          right: "20%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, #FF7A56, #FF5E32, #FF7A56, transparent)",
          opacity: 0,
        }}
        ref={(lineEl) => {
          if (!lineEl) return;
          const card = lineEl.parentElement;
          if (!card) return;
          card.addEventListener("mouseenter", () => {
            lineEl.style.opacity = "1";
            lineEl.style.left = "10%";
            lineEl.style.right = "10%";
          });
          card.addEventListener("mouseleave", () => {
            lineEl.style.opacity = "0";
            lineEl.style.left = "20%";
            lineEl.style.right = "20%";
          });
        }}
      />
      {children}
    </div>
  );
}

export function BentoFeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-[120px]"
      style={{ background: "#0A0A1A" }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,94,50,0.12) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)",
        }}
      />
      {/* Section glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(255,94,50,0.08), transparent 70%)",
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-[60px] landing-reveal">
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
            Why URR
          </div>
          <h2
            className="font-light mb-4"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#e8edf3", letterSpacing: "-0.03em", fontWeight: 200 }}
          >
            찐팬을 위한 모든 것
          </h2>
          <p style={{ fontSize: "0.88rem", color: "#94a3b8", maxWidth: "520px", margin: "0 auto", fontWeight: 300, lineHeight: 1.7 }}>
            팬 신뢰 점수 기반 공정 티켓팅, 매크로 차단, 투명한 양도 마켓을 하나의 플랫폼에서.
          </p>
        </div>

        {/* Bento Grid — Row 1: Bar chart (span-2) + 선예매 우선권 (span-2) */}
        {/* Row 2: 팬 신뢰 점수 (1) + 티켓팅 로그 (span-2) + 양도 마켓 (1) */}
        <div className="grid grid-cols-4 gap-4 landing-stagger">

          {/* Row 1 Left — Bar chart (span 2) */}
          <BentoCard span2>
            <h3 className="font-medium mb-2 landing-child" style={{ fontSize: "1rem", color: "#e8edf3", letterSpacing: "-0.02em" }}>
              매크로·봇 완전 차단
            </h3>
            <p className="mb-5 landing-child" style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 300, lineHeight: 1.6 }}>
              AI 기반 실시간 감지로 매크로와 봇을 원천 차단합니다.
            </p>
            <div className="flex items-end gap-1.5 h-20 pt-2">
              {BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t landing-bento-bar"
                  style={{
                    "--bar-h": h,
                    height: "100%",
                    background: "linear-gradient(to top, #FF5E32, #FF8060)",
                  } as React.CSSProperties}
                />
              ))}
            </div>
            <p className="mt-2 landing-child" style={{ fontSize: "0.62rem", color: "#4b5e78" }}>
              일별 매크로 차단 건수
            </p>
          </BentoCard>

          {/* Row 1 Right — 선예매 우선권 (span 2, enlarged) */}
          <BentoCard span2>
            <h3 className="font-medium mb-1.5 landing-child" style={{ fontSize: "1rem", color: "#e8edf3", letterSpacing: "-0.02em" }}>
              선예매 우선권
            </h3>
            <p className="mb-5 landing-child" style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 300, lineHeight: 1.6 }}>
              등급이 높을수록 더 먼저 예매합니다.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {PRIORITY_TIERS.map((tier, i) => (
                <div
                  key={i}
                  className="landing-child"
                  style={{
                    padding: "12px 14px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${tier.color}22`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5" style={{ fontSize: "0.84rem", color: "#e8edf3" }}>
                      <img src={`/membership/${tier.key}.svg`} width={14} height={14} alt="" style={{ objectFit: "contain" }} />
                      {tier.name}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: tier.color, fontWeight: 500 }}>
                      {tier.timing}
                    </span>
                  </div>
                  {/* Priority bar */}
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div
                      className="h-full rounded-full landing-progress-fill"
                      style={{
                        "--progress-w": `${tier.bar}%`,
                        background: `linear-gradient(90deg, ${tier.color}, ${tier.color}88)`,
                        opacity: 0.8,
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Row 2 Left — 팬 신뢰 점수 (1) */}
          <BentoCard>
            <h3 className="font-medium mb-2 landing-child" style={{ fontSize: "1rem", color: "#e8edf3", letterSpacing: "-0.02em" }}>
              팬 신뢰 점수 (FTS)
            </h3>
            <p className="mb-4 landing-child" style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 300, lineHeight: 1.6 }}>
              활동이 쌓일수록 등급이 올라갑니다.
            </p>
            <div className="flex flex-col gap-3">
              {PROGRESS_ITEMS.map((item, i) => (
                <div key={i} className="landing-progress-item">
                  <div className="flex justify-between mb-1" style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div
                      className="h-full rounded-full landing-progress-fill"
                      style={{
                        "--progress-w": item.width,
                        background: "linear-gradient(90deg, #FF5E32, #FF8060)",
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Row 2 Middle — 실시간 티켓팅 로그 (span 2) */}
          <BentoCard span2>
            <h3 className="font-medium mb-2 landing-child" style={{ fontSize: "1rem", color: "#e8edf3", letterSpacing: "-0.02em" }}>
              실시간 티켓팅 로그
            </h3>
            <p className="mb-4 landing-child" style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 300, lineHeight: 1.6 }}>
              모든 예매 이벤트가 투명하게 기록됩니다.
            </p>
            <div className="flex flex-col gap-1">
              {LOG_LINES.map((line, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-2 py-1 rounded landing-log-line"
                  style={{ background: "rgba(0,0,0,0.3)", fontSize: "0.64rem" }}
                >
                  <span style={{ color: "#4b5e78" }}>{line.time}</span>
                  <span
                    className="px-1.5 py-px rounded text-[0.6rem] font-medium uppercase"
                    style={{ background: `${line.typeColor}22`, color: line.typeColor }}
                  >
                    {line.type}
                  </span>
                  <span style={{ color: "#94a3b8" }}>{line.msg}</span>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Row 2 Right — 공정 양도 마켓 (1) */}
          <BentoCard>
            <h3 className="font-medium mb-2 landing-child" style={{ fontSize: "1rem", color: "#e8edf3", letterSpacing: "-0.02em" }}>
              공정 양도 마켓
            </h3>
            <p className="mb-4 landing-child" style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 300, lineHeight: 1.6 }}>
              정가의 0.5x~1.5x 에스크로 보호 거래.
            </p>
            <div className="flex flex-col gap-2">
              {[
                { value: "0.5x ~ 1.5x", label: "가격 범위" },
                { value: "에스크로", label: "보호 방식" },
                { value: "5 ~ 10%", label: "수수료" },
              ].map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg landing-child"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,94,50,0.08)" }}
                >
                  <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{m.label}</span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 400, color: "#e8edf3" }}>
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}
