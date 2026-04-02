import Link from "next/link";

const TIERS = [
  {
    emoji: "🌫️",
    name: "미스트",
    englishName: "Mist",
    condition: "회원가입 즉시",
    price: "무료",
    priceNote: "",
    booking: "일반 예매",
    fee: "+₩4,000",
    transfer: "양도 불가",
    features: [
      "회원가입 즉시 자동 부여",
      "일반 예매 참여 가능",
      "아티스트 홈 탭 접근",
      "공연 정보 열람",
    ],
    featured: false,
    badge: null,
    btnStyle: {
      border: "1px solid rgba(255,94,50,0.2)",
      background: "rgba(255,94,50,0.06)",
      color: "#e8edf3",
    },
  },
  {
    emoji: "☁️",
    name: "클라우드",
    englishName: "Cloud",
    condition: "멤버십 가입",
    price: "₩30,000",
    priceNote: "/ 년",
    booking: "선예매 +1day",
    fee: "+₩3,000",
    transfer: "10% 수수료",
    features: [
      "선예매 3순위 (+1일)",
      "양도 판매·구매 가능",
      "아티스트 공연/양도 탭 접근",
      "티켓 월렛 관리",
    ],
    featured: false,
    badge: null,
    btnStyle: {
      border: "1px solid rgba(255,94,50,0.2)",
      background: "rgba(255,94,50,0.06)",
      color: "#e8edf3",
    },
  },
  {
    emoji: "⚡",
    name: "썬더",
    englishName: "Thunder",
    condition: "멜론 연동 + 꾸준한 팬 활동",
    price: "₩30,000",
    priceNote: "/ 년",
    booking: "선예매 +1h",
    fee: "+₩2,000",
    transfer: "5% 수수료",
    features: [
      "선예매 2순위 (+1시간)",
      "Fast Track 대기열",
      "양도 판매·구매 가능",
      "낮은 수수료 혜택",
    ],
    featured: false,
    badge: null,
    btnStyle: {
      border: "1px solid rgba(255,94,50,0.2)",
      background: "rgba(255,94,50,0.06)",
      color: "#e8edf3",
    },
  },
  {
    emoji: "🌩️",
    name: "라이트닝",
    englishName: "Lightning",
    condition: "멜론 연동 + 상위 스트리밍 팬",
    price: "₩30,000",
    priceNote: "/ 년",
    booking: "선예매 1순위",
    fee: "+₩1,000",
    transfer: "5% 수수료",
    features: [
      "선예매 1순위",
      "Fast Track 직행",
      "최저 예매 수수료",
      "양도 판매·구매 가능",
    ],
    featured: true,
    badge: "선예매 1순위",
    btnStyle: {
      background: "#FF5E32",
      color: "white",
      border: "none",
    },
  },
];

export function MembershipTierSection() {
  return (
    <section
      id="membership"
      className="relative py-[120px]"
      style={{ background: "#0D0D1F" }}
    >
      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,94,50,0.08), transparent)" }}
      />

      <div className="max-w-[1200px] mx-auto px-6">
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
            Membership
          </div>
          <h2
            className="font-light mb-4"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#e8edf3", letterSpacing: "-0.03em", fontWeight: 200 }}
          >
            나의 팬심이 등급이 됩니다
          </h2>
          <p style={{ fontSize: "0.88rem", color: "#94a3b8", maxWidth: "520px", margin: "0 auto", fontWeight: 300, lineHeight: 1.7 }}>
            활동이 많을수록 더 높은 등급. 연간 ₩30,000으로 공정한 티켓팅을 시작하세요.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-4 gap-5 items-center landing-stagger">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-[18px] transition-transform duration-300 landing-child${tier.featured ? "" : " hover:-translate-y-1"}`}
              style={
                tier.featured
                  ? {
                      transform: "scale(1.05)",
                      animation: "landing-border-spin 4s linear infinite",
                      boxShadow: "0 8px 60px rgba(255,94,50,0.2)",
                      zIndex: 1,
                      padding: "36px",
                      background: "#0D0D1F",
                    }
                  : {
                      padding: "36px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,94,50,0.10)",
                    }
              }
            >
              {/* Conic border for featured */}
              {tier.featured && (
                <>
                  <span
                    className="absolute pointer-events-none"
                    style={{
                      inset: "-2px",
                      borderRadius: "20px",
                      background:
                        "conic-gradient(from var(--border-angle), #FF5E32, #FF7A56, #1F2792, #FF8060, #FF5E32)",
                      zIndex: -2,
                      animation: "landing-border-spin 4s linear infinite",
                    }}
                  />
                  <span
                    className="absolute pointer-events-none"
                    style={{
                      inset: "2px",
                      borderRadius: "16px",
                      background: "#0D0D1F",
                      zIndex: -1,
                    }}
                  />
                </>
              )}

              {/* Badge */}
              {tier.badge && (
                <div
                  className="inline-block px-3 py-1 rounded-full text-[0.64rem] font-semibold uppercase tracking-[0.05em] text-white mb-4"
                  style={{ background: "linear-gradient(135deg, #FF5E32, #FF8060)" }}
                >
                  {tier.badge}
                </div>
              )}

              {/* Tier name */}
              <div className="flex items-center gap-2 mb-2">
                <img src={`/membership/${tier.englishName.toLowerCase()}.svg`} width={24} height={24} alt={tier.name} />
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 500, color: "#e8edf3" }}>{tier.name}</div>
                  <div style={{ fontSize: "0.68rem", color: "#4b5e78" }}>{tier.condition}</div>
                </div>
              </div>

              {/* Price */}
              <div className="mt-3 mb-1">
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "2.2rem",
                    fontWeight: 200,
                    letterSpacing: "-0.03em",
                    color: "#e8edf3",
                  }}
                >
                  {tier.price}
                </span>
                {tier.priceNote && (
                  <span style={{ fontSize: "0.88rem", color: "#94a3b8", fontWeight: 300 }}>
                    {tier.priceNote}
                  </span>
                )}
              </div>

              <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 300, marginBottom: "24px", lineHeight: 1.6 }}>
                예매 창: {tier.booking} · 수수료: {tier.fee}
                <br />
                양도: {tier.transfer}
              </div>

              {/* Features */}
              <div className="flex flex-col gap-2.5 mb-7">
                {tier.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5" style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 300 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF7A56" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/onboarding"
                className="block w-full py-3 rounded-[10px] text-center text-[0.82rem] font-medium transition-all duration-300 hover:opacity-90"
                style={tier.btnStyle as React.CSSProperties}
              >
                {tier.featured ? "지금 시작하기" : "시작하기"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
