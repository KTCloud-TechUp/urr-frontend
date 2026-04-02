"use client";

import { useEffect, useRef } from "react";

interface MetricItem {
  target: number;
  prefix?: string;
  suffix: string;
  decimals: number;
  label: string;
}

const METRICS: MetricItem[] = [
  { target: 50000, suffix: "+", decimals: 0, label: "가입 팬" },
  { target: 99.7, suffix: "%", decimals: 1, label: "매크로 차단율" },
  { target: 150, suffix: "+", decimals: 0, label: "파트너 공연" },
  { prefix: "₩", target: 30000, suffix: "", decimals: 0, label: "연간 멤버십" },
];

function animateCount(
  el: HTMLSpanElement,
  target: number,
  prefix: string,
  suffix: string,
  decimals: number,
  duration = 2000
) {
  const start = performance.now();
  function tick(now: number) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const v = target * ease;
    if (target >= 1000) {
      el.textContent = prefix + Math.floor(v).toLocaleString("ko-KR") + suffix;
    } else {
      el.textContent = prefix + v.toFixed(decimals) + suffix;
    }
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

export function MetricsSection() {
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const metric = METRICS[i];
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            animateCount(el, metric.target, metric.prefix ?? "", metric.suffix, metric.decimals);
            obs.unobserve(el);
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section
      className="py-5"
      style={{
        background: "#0A0A1A",
        borderTop: "1px solid rgba(255,94,50,0.08)",
        borderBottom: "1px solid rgba(255,94,50,0.08)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-4 gap-10">
          {METRICS.map((m, i) => (
            <div key={i} className="text-center landing-reveal">
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                  fontWeight: 200,
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(135deg, #e8edf3 0%, #FF7A56 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.1,
                }}
              >
                <span ref={(el) => { itemRefs.current[i] = el; }}>
                  {m.prefix ?? ""}{m.target >= 1000 ? m.target.toLocaleString("ko-KR") : m.target.toFixed(m.decimals)}{m.suffix}
                </span>
              </div>
              <div style={{ fontSize: "0.76rem", color: "#94a3b8", marginTop: "4px", fontWeight: 300 }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
