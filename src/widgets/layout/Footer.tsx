import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-[1200px] mx-auto px-8 pt-12 pb-14">
        <div className="flex items-start justify-between">
          {/* Left: Brand column */}
          <div className="shrink-0 space-y-7">
            <Image src="/logos/logo5.svg" alt="URR" width={44} height={44} />

            {/* Social icons */}
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
              <a href="#" className="hover:text-foreground transition-colors" aria-label="X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" className="hover:text-foreground transition-colors" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
              </a>
            </div>
          </div>

          {/* Right: Link columns */}
          <div className="flex gap-20">
            <div className="space-y-4">
              <h4 className="text-sm font-bold">서비스</h4>
              <nav className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">URR 소개</a>
                <a href="#" className="hover:text-foreground transition-colors">이용 가이드</a>
                <a href="#" className="hover:text-foreground transition-colors">요금 안내</a>
                <a href="#" className="hover:text-foreground transition-colors">멤버십 혜택</a>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">고객지원</h4>
              <nav className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">도움말 센터</a>
                <a href="#" className="hover:text-foreground transition-colors">자주 묻는 질문</a>
                <a href="#" className="hover:text-foreground transition-colors">1:1 문의</a>
                <a href="#" className="hover:text-foreground transition-colors">공지사항</a>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">아티스트</h4>
              <nav className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">아티스트 등록</a>
                <a href="#" className="hover:text-foreground transition-colors">공연 등록</a>
                <a href="#" className="hover:text-foreground transition-colors">파트너 프로그램</a>
                <Link href="/artists" className="text-foreground font-semibold hover:text-primary transition-colors">더 살펴보기 &rarr;</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">URR 요금제</h4>
              <nav className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">멤버십 라이트닝</a>
                <a href="#" className="hover:text-foreground transition-colors">멤버십 썬더</a>
                <a href="#" className="hover:text-foreground transition-colors">멤버십 클라우드</a>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom: Legal links */}
        <div className="flex items-center justify-between mt-12 text-xs text-muted-foreground">
          <p>&copy; 2026 URR Inc.</p>
          <nav className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground transition-colors">이용약관</a>
            <a href="#" className="hover:text-foreground transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-foreground transition-colors">취소 및 환불 정책</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
