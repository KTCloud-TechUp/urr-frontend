import Image from "next/image";

const FEATURED = {
  quote:
    "작년까지는 매크로 때문에 티켓을 한 번도 못 샀어요. URR은 달라요. 팬 점수가 높을수록 먼저 들어가는 게 진짜 공평하고, 대기 시간에 긴장은 해도 불안하지 않아요.",
  name: "이수연",
  tier: "LIGHTNING" as const,
  tierLabel: "라이트닝 멤버",
  fanLabel: "IVE 팬",
  initials: "이수",
};

const CARDS = [
  {
    quote: "선예매 1순위 됐을 때 소리 질렀어요. 3년 동안 aespa 콘서트 못 갔는데 드디어 가게 됐어요.",
    name: "김민준",
    tier: "THUNDER" as const,
    tierLabel: "썬더 멤버",
    fanLabel: "aespa 팬",
    initials: "김민",
  },
  {
    quote: "양도 마켓에서 정가보다 30% 비싼 티켓을 에스크로로 안전하게 샀어요. 사기 걱정 없어서 너무 좋아요.",
    name: "박지훈",
    tier: "CLOUD" as const,
    tierLabel: "클라우드 멤버",
    fanLabel: "BTS 팬",
    initials: "박지",
  },
  {
    quote: "멜론 연동하고 FTS 점수 올라가는 거 보면 진짜 내 팬심이 수치화되는 느낌. 열심히 스트리밍하게 돼요.",
    name: "최유나",
    tier: "THUNDER" as const,
    tierLabel: "썬더 멤버",
    fanLabel: "BLACKPINK 팬",
    initials: "최유",
  },
];

export function TestimonialsSection() {
  return (
    <section
      className="relative py-[120px]"
      style={{ background: "#0A0A1A" }}
    >
      {/* Section glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "40%",
          left: "20%",
          width: "500px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(255,94,50,0.06), transparent 70%)",
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
            Testimonials
          </div>
          <h2
            className="font-light mb-4"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#e8edf3", letterSpacing: "-0.03em", fontWeight: 200 }}
          >
            찐팬들의 이야기
          </h2>
          <p style={{ fontSize: "0.88rem", color: "#94a3b8", maxWidth: "520px", margin: "0 auto", fontWeight: 300, lineHeight: 1.7 }}>
            URR과 함께 처음으로 좋아하는 아티스트의 공연을 직접 경험한 팬들의 후기입니다.
          </p>
        </div>

        {/* Featured */}
        <div
          className="relative p-10 rounded-[20px] mb-5 overflow-hidden landing-reveal"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,94,50,0.10)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Top-edge gradient line */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{
              background: "linear-gradient(90deg, #FF5E32, #FF7A56, #1F2792)",
            }}
          />
          <div
            className="block font-light leading-[1.7] mb-6"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "1.2rem",
              color: "#e8edf3",
              letterSpacing: "-0.01em",
            }}
          >
            <span
              className="block leading-none mb-2"
              style={{ fontSize: "3rem", color: "#FF5E32", fontFamily: "Georgia, serif", lineHeight: 1 }}
            >
              &#8220;
            </span>
            {FEATURED.quote}
          </div>
          <div className="flex items-center gap-3.5">
            <div
              className="flex items-center justify-center text-white font-semibold shrink-0"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF5E32, #1F2792)",
                fontSize: "0.82rem",
              }}
            >
              {FEATURED.initials}
            </div>
            <div>
              <div style={{ fontSize: "0.84rem", fontWeight: 500, color: "#e8edf3" }}>{FEATURED.name}</div>
              <div className="flex items-center gap-1" style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 300 }}>
                <Image src={`/membership/${FEATURED.tier}.svg`} width={14} height={14} alt="" style={{ objectFit: "contain" }} />
                {FEATURED.tierLabel} · {FEATURED.fanLabel}
              </div>
            </div>
          </div>
        </div>

        {/* 3-col grid */}
        <div className="grid grid-cols-3 gap-4 landing-stagger">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="p-6 rounded-[14px] transition-all duration-300 landing-child cursor-default"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,94,50,0.10)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(255,94,50,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.borderColor = "rgba(255,94,50,0.10)";
              }}
            >
              <div
                className="block font-light leading-[1.7] mb-4"
                style={{ fontSize: "0.84rem", color: "#e8edf3", letterSpacing: "-0.01em" }}
              >
                <span
                  className="block leading-none mb-1"
                  style={{ fontSize: "2rem", color: "#FF5E32", fontFamily: "Georgia, serif", lineHeight: 1 }}
                >
                  &#8220;
                </span>
                {card.quote}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center text-white font-semibold shrink-0"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #FF5E32, #1F2792)",
                    fontSize: "0.72rem",
                  }}
                >
                  {card.initials}
                </div>
                <div>
                  <div style={{ fontSize: "0.84rem", fontWeight: 500, color: "#e8edf3" }}>{card.name}</div>
                  <div className="flex items-center gap-1" style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 300 }}>
                    <Image src={`/membership/${card.tier}.svg`} width={14} height={14} alt="" style={{ objectFit: "contain" }} />
                    {card.tierLabel} · {card.fanLabel}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
