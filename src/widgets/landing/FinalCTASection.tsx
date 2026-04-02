import Link from "next/link";

export function FinalCTASection() {
  return (
    <section
      className="relative flex items-center justify-center text-center overflow-hidden"
      style={{ minHeight: "80vh", background: "#0A0A1A" }}
    >
      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "500px",
          background: "radial-gradient(ellipse, rgba(255,94,50,0.1), transparent 70%)",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,94,50,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, black, transparent)",
        }}
      />

      <div className="relative z-10 max-w-[600px] mx-auto px-6 landing-reveal">
        <div
          className="flex items-center justify-center gap-2.5 mb-6"
          style={{
            fontSize: "0.72rem",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#FF7A56",
          }}
        >
          <span className="w-5 h-px" style={{ background: "#FF7A56" }} />
          Get Started
        </div>

        <h2
          className="font-light mb-5"
          style={{
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            color: "#e8edf3",
            letterSpacing: "-0.04em",
            fontWeight: 200,
          }}
        >
          지금 시작하세요,{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #FF5E32 0%, #FF7A56 50%, #FFB347 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 400,
            }}
          >
            진짜 팬의 특권
          </span>
        </h2>

        <p
          className="mb-8"
          style={{
            fontSize: "0.88rem",
            color: "#94a3b8",
            fontWeight: 300,
            lineHeight: 1.7,
          }}
        >
          30초면 가입 완료. 매크로 없는 티켓팅을 지금 경험하세요.
        </p>

        {/* Social login buttons */}
        <div className="flex justify-center gap-4 flex-wrap mb-10">
          {/* Kakao CTA */}
          <Link
            href="/onboarding"
            className="relative z-10 overflow-hidden px-8 py-3.5 rounded-xl text-[0.84rem] font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: "#0A0A1A" }}
          >
            <span
              className="absolute pointer-events-none"
              style={{
                inset: "-2px",
                borderRadius: "14px",
                background: "conic-gradient(from var(--border-angle), #FF5E32, #FF7A56, #1F2792, #FF8060, #FF5E32)",
                zIndex: -2,
                animation: "landing-border-spin 3s linear infinite",
              }}
            />
            <span
              className="absolute pointer-events-none"
              style={{
                inset: "2px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, rgba(255,94,50,0.15), rgba(10,10,26,0.95))",
                zIndex: -1,
              }}
            />
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "landing-shimmer 2.5s ease-in-out infinite",
                backgroundPosition: "var(--shimmer-pos) center",
              }}
            />
            무료로 시작하기
          </Link>

          {/* Naver ghost */}
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
            기능 살펴보기
          </Link>
        </div>

      </div>
    </section>
  );
}
