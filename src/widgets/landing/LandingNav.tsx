"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[1000] transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(10,10,26,0.85)"
          : "rgba(10,10,26,0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,94,50,0.08)",
        padding: scrolled ? "8px 0" : "12px 0",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/landing" className="flex items-center gap-2.5">
          <Image
            src="/logos/logo5.svg"
            alt="URR"
            width={32}
            height={32}
            className="brightness-0 invert"
          />
          <span
            className="font-semibold text-[1.05rem] tracking-tight"
            style={{ color: "#e8edf3", letterSpacing: "-0.02em" }}
          >
            URR
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-8">
          <a
            href="#features"
            className="text-[0.82rem] transition-colors duration-200"
            style={{ color: "#94a3b8" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "#e8edf3")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "#94a3b8")
            }
          >
            기능
          </a>
          <a
            href="#membership"
            className="text-[0.82rem] transition-colors duration-200"
            style={{ color: "#94a3b8" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "#e8edf3")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "#94a3b8")
            }
          >
            멤버십
          </a>
          <a
            href="#how"
            className="text-[0.82rem] transition-colors duration-200"
            style={{ color: "#94a3b8" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "#e8edf3")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "#94a3b8")
            }
          >
            이용방법
          </a>

          <Link
            href="/onboarding"
            className="text-[0.82rem] transition-colors duration-200"
            style={{ color: "#94a3b8" }}
          >
            로그인
          </Link>

          {/* CTA */}
          <Link
            href="/onboarding"
            className="relative overflow-hidden px-5 py-2 rounded-full text-[0.8rem] font-medium text-white transition-all duration-200 hover:-translate-y-[1px]"
            style={{ background: "#FF5E32" }}
          >
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "landing-shimmer 2.5s ease-in-out infinite",
                backgroundPosition: "var(--shimmer-pos) center",
              }}
            />
            무료로 시작하기 →
          </Link>
        </div>
      </div>
    </nav>
  );
}
