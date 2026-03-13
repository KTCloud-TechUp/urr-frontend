import { Clock, Info, Crown, ShieldCheck, Mic2 } from "lucide-react";
import { TierBadge } from "@/entities/user";
import { PriceDisplay } from "@/shared/ui";
import type { EventDetail } from "@/shared/lib/mocks/event-detail";

interface PerformanceInfoTabProps {
  event: EventDetail;
}

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
        <Icon size={18} className="text-primary" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function formatShowDate(isoDate: string): string {
  const d = new Date(isoDate);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${weekdays[d.getDay()]}) ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} (KST)`;
}

function formatTierWindowDate(isoDate: string): string {
  const d = new Date(isoDate);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} (${weekdays[d.getDay()]}) ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function PerformanceInfoTab({ event }: PerformanceInfoTabProps) {
  const bookingWindows = event.dates[0]?.bookingWindows ?? [];

  return (
    <div className="space-y-6">
      {/* 1. 공연시간 정보 */}
      <SectionCard icon={Clock} title="공연시간 정보">
        <ul className="space-y-1.5">
          {event.dates.map((d) => (
            <li key={d.id} className="text-sm flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              {formatShowDate(d.date)}
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 text-[13px] text-muted-foreground">
          <p>* 예매 마감 시간 : 각 공연 시작 시간까지</p>
          <p>* 취소 마감 시간 : 전일 17시(월~토 관람 시)까지/전일 11시(일요일 관람 시)까지</p>
        </div>
      </SectionCard>

      {/* 2. 공지사항 */}
      <SectionCard icon={Info} title="공지사항">
        <div className="space-y-4">
          {event.notices.map((notice, i) => (
            <p key={i} className="text-sm leading-relaxed">
              {notice.startsWith("NOL") || notice.startsWith("일반") ? (
                <span className="text-primary font-medium">• {notice}</span>
              ) : (
                <span className="text-muted-foreground">* {notice}</span>
              )}
            </p>
          ))}

          {event.membershipPreSaleNotice.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-sm font-semibold mb-3">일반 예매 및 휠체어석 전화 예매 오픈 안내</h4>
              <ul className="space-y-1.5">
                {event.membershipPreSaleNotice.map((item, i) => (
                  <li key={i} className="text-sm leading-relaxed">
                    {item.startsWith("일반 예매 오픈") || item.startsWith("휠체어석") ? (
                      <span className="text-primary font-medium">• {item}</span>
                    ) : (
                      <span className="text-muted-foreground">* {item}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </SectionCard>

      {/* 3. 멤버십 선예매 일정 */}
      <SectionCard icon={Crown} title="멤버십 선예매 일정">
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">티어</th>
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">오픈 시간</th>
                <th className="text-right py-2.5 px-4 font-medium text-muted-foreground">예매 수수료</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookingWindows.map((w) => (
                <tr key={w.tier} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-4">
                    <TierBadge tier={w.tier} size="sm" />
                  </td>
                  <td className="py-2.5 px-4 text-sm">{formatTierWindowDate(w.opensAt)}</td>
                  <td className="py-2.5 px-4 text-right">
                    {w.fee === 0 ? (
                      <span className="text-sm font-medium text-success">무료</span>
                    ) : (
                      <PriceDisplay amount={w.fee} size="sm" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">* 매수 제한 : 회차별 1인 1매</p>
      </SectionCard>

      {/* 4. 본인확인 안내 */}
      <SectionCard icon={ShieldCheck} title="공연 당일 본인 인증 관련 사항">
        <ul className="space-y-2">
          {event.identityVerification.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed flex items-start gap-2">
              <span className="text-muted-foreground shrink-0">•</span>
              <span
                className={
                  item.includes("엄격히 금지") || item.includes("불가")
                    ? "text-primary font-medium"
                    : "text-foreground"
                }
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* 5. 공연상세 / 출연진 */}
      <SectionCard icon={Mic2} title="공연상세 / 출연진정보">
        <div className="space-y-3">
          <div className="text-sm whitespace-pre-line leading-relaxed">
            {event.performanceDescription}
          </div>
          {event.castInfo && (
            <div className="pt-3 border-t border-border">
              <p className="text-sm">
                <span className="text-muted-foreground">출연진 : </span>
                <span className="font-medium">{event.castInfo}</span>
              </p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
