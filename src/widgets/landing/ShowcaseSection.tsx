const SHOWCASE_FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "CI 1인 1계정 인증",
    desc: "통신사 본인인증으로 계정 중복 생성을 원천 차단합니다.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "팬 신뢰 점수 투명 공개",
    desc: "나의 FTS 점수와 등급 산정 기준이 대시보드에 투명하게 표시됩니다.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
    title: "에스크로 보호 양도 거래",
    desc: "구매자 결제 → 플랫폼 보관 → 소유권 이전 → 판매자 지급.",
  },
];

const MOCK_ROWS = [
  { artist: "IVE", concert: "팬콘 2026", status: "예매 완료", statusColor: "#34d399", statusBg: "rgba(52,211,153,0.1)", tier: "🌩️ 라이트닝", tierColor: "#FF7A56", price: "₩150,000" },
  { artist: "aespa", concert: "SYNK Tour", status: "예매 완료", statusColor: "#34d399", statusBg: "rgba(52,211,153,0.1)", tier: "🌩️ 라이트닝", tierColor: "#FF7A56", price: "₩110,000" },
  { artist: "BTS", concert: "YET TO COME", status: "대기 중", statusColor: "#fbbf24", statusBg: "rgba(251,191,36,0.1)", tier: "☁️ 클라우드", tierColor: "#7E8CDA", price: "—" },
  { artist: "BLACKPINK", concert: "Born Pink", status: "예매 완료", statusColor: "#34d399", statusBg: "rgba(52,211,153,0.1)", tier: "🌩️ 라이트닝", tierColor: "#FF7A56", price: "₩130,000" },
  { artist: "NewJeans", concert: "OMG Tour", status: "선예매", statusColor: "#FF7A56", statusBg: "rgba(255,122,86,0.1)", tier: "⚡ 썬더", tierColor: "#9B6DFF", price: "₩95,000" },
];

export function ShowcaseSection() {
  return (
    <section
      className="relative py-[120px] overflow-hidden"
      style={{ background: "#0D0D1F" }}
    >
      {/* Section glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "30%",
          right: 0,
          width: "500px",
          height: "500px",
          background: "radial-gradient(ellipse, rgba(31,39,146,0.06), transparent 70%)",
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid gap-[60px]" style={{ gridTemplateColumns: "1fr 1.2fr" }}>
          {/* Left — text */}
          <div className="landing-reveal">
            <div
              className="flex items-center gap-2.5 mb-4"
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#FF7A56",
              }}
            >
              <span className="w-5 h-px" style={{ background: "#FF7A56" }} />
              Platform
            </div>
            <h2
              className="font-light mb-4"
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                color: "#e8edf3",
                letterSpacing: "-0.03em",
                fontWeight: 200,
                lineHeight: 1.15,
              }}
            >
              모든 티켓팅을
              <br />
              한 곳에서
            </h2>
            <p
              style={{
                fontSize: "0.88rem",
                color: "#94a3b8",
                maxWidth: "520px",
                fontWeight: 300,
                lineHeight: 1.7,
              }}
            >
              예매 현황, 등급 정보, 양도 내역을 하나의 대시보드에서 확인하세요. 매크로 없이, 투명하게.
            </p>

            <div className="flex flex-col gap-7 mt-8">
              {SHOWCASE_FEATURES.map((f, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "rgba(255,94,50,0.1)",
                      color: "#FF7A56",
                    }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.88rem", fontWeight: 500, color: "#e8edf3", marginBottom: "4px" }}>
                      {f.title}
                    </h4>
                    <p style={{ fontSize: "0.76rem", color: "#94a3b8", fontWeight: 300, lineHeight: 1.6 }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Dashboard mock */}
          <div
            className="landing-reveal rounded-2xl overflow-hidden relative"
            style={{
              border: "1px solid rgba(255,94,50,0.10)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            {/* mac-style header */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{
                borderBottom: "1px solid rgba(255,94,50,0.08)",
                background: "rgba(0,0,0,0.2)",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[#f87171]" />
              <span className="w-2 h-2 rounded-full bg-[#fbbf24]" />
              <span className="w-2 h-2 rounded-full bg-[#34d399]" />
              <span
                className="ml-2"
                style={{
                  fontSize: "0.68rem",
                  color: "#4b5e78",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                urr-booking — 예매 목록
              </span>
            </div>

            {/* Table body */}
            <div className="p-5 overflow-auto">
              <table className="w-full" style={{ fontSize: "0.72rem" }}>
                <thead>
                  <tr>
                    {["아티스트", "공연명", "상태", "등급", "가격"].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-3"
                        style={{
                          color: "#4b5e78",
                          fontWeight: 500,
                          fontFamily: "var(--font-mono, monospace)",
                          textTransform: "uppercase",
                          fontSize: "0.62rem",
                          letterSpacing: "0.08em",
                          borderBottom: "1px solid rgba(255,94,50,0.08)",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ROWS.map((row, i) => (
                    <tr
                      key={i}
                      style={{ borderBottom: "1px solid rgba(255,94,50,0.04)" }}
                    >
                      <td className="py-2.5 px-3" style={{ color: "#e8edf3", fontFamily: "var(--font-mono, monospace)" }}>
                        {row.artist}
                      </td>
                      <td className="py-2.5 px-3" style={{ color: "#94a3b8", fontFamily: "var(--font-mono, monospace)" }}>
                        {row.concert}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-[0.62rem] font-medium"
                          style={{ background: row.statusBg, color: row.statusColor }}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3" style={{ color: row.tierColor, fontFamily: "var(--font-mono, monospace)" }}>
                        {row.tier}
                      </td>
                      <td className="py-2.5 px-3" style={{ color: "#94a3b8", fontFamily: "var(--font-mono, monospace)" }}>
                        {row.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
