import Image from "next/image";
import Link from "next/link";

const FOOTER_COLS = [
  {
    title: "서비스",
    links: [
      { label: "기능 소개", href: "#features" },
      { label: "멤버십 등급", href: "#membership" },
      { label: "이용방법", href: "#how" },
      { label: "공연 목록", href: "/events" },
      { label: "아티스트", href: "/artists" },
    ],
  },
  {
    title: "이용안내",
    links: [
      { label: "공지사항", href: "#" },
      { label: "자주 묻는 질문", href: "#" },
      { label: "고객센터", href: "#" },
      { label: "양도 가이드", href: "#" },
    ],
  },
  {
    title: "법적정보",
    links: [
      {
        label: "개인정보처리방침",
        href: "/policies/urr-02-privacy-policy.html",
      },
      { label: "이용약관", href: "/policies/urr-01-terms-of-service.html" },
      { label: "청소년 보호정책", href: "/policies/urr-05-youth-policy.html" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer
      className="pt-[60px] pb-8"
      style={{
        background: "#080812",
        borderTop: "1px solid rgba(255,94,50,0.08)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Grid */}
        <div
          className="grid gap-10 mb-12"
          style={{ gridTemplateColumns: "1.5fr repeat(3, 1fr)" }}
        >
          {/* Brand */}
          <div>
            <Link href="/landing" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/icons/logo_final.svg"
                alt="URR"
                width={28}
                height={28}
                className="brightness-0 invert"
              />
              <span
                className="font-semibold text-[1.05rem] tracking-tight"
                style={{ color: "#e8edf3", letterSpacing: "-0.02em" }}
              >
                URR
              </span>
            </Link>
            <p
              style={{
                fontSize: "0.78rem",
                color: "#94a3b8",
                fontWeight: 300,
                lineHeight: 1.7,
                maxWidth: "260px",
                marginBottom: "20px",
              }}
            >
              K-POP 찐팬을 위한 공정 티켓팅 플랫폼. 팬 신뢰 점수 기반 우선
              예매와 에스크로 보호 양도 마켓.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {[
                {
                  label: "Instagram",
                  path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
                },
                {
                  label: "Twitter",
                  path: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
                },
                {
                  label: "Discord",
                  path: "M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.04.033.05a19.896 19.896 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z",
                },
              ].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={s.label}
                  className="flex items-center justify-center transition-all duration-200"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,94,50,0.08)",
                    color: "#4b5e78",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#FF7A56";
                    e.currentTarget.style.borderColor = "rgba(255,94,50,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#4b5e78";
                    e.currentTarget.style.borderColor = "rgba(255,94,50,0.08)";
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4
                className="mb-4 font-medium"
                style={{ fontSize: "0.82rem", color: "#e8edf3" }}
              >
                {col.title}
              </h4>
              <div className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="transition-colors duration-200"
                    style={{
                      fontSize: "0.78rem",
                      color: "#4b5e78",
                      fontWeight: 300,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#94a3b8")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#4b5e78")
                    }
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex items-center justify-between pt-6"
          style={{
            borderTop: "1px solid rgba(255,94,50,0.06)",
            fontSize: "0.72rem",
            color: "#4b5e78",
            fontWeight: 300,
          }}
        >
          <span>© 2026 URR. All rights reserved.</span>
          <div className="flex gap-6">
            <Link
              href="/policies/urr-02-privacy-policy.html"
              style={{ color: "#4b5e78" }}
            >
              개인정보처리방침
            </Link>
            <Link
              href="/policies/urr-01-terms-of-service.html"
              style={{ color: "#4b5e78" }}
            >
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
