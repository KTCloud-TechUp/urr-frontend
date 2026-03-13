import {
  Building2,
  Info,
  Armchair,
  AlertCircle,
  Ticket,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { PriceDisplay } from "@/shared/ui";
import type { EventDetail } from "@/shared/lib/mocks/event-detail";

interface SalesInfoTabProps {
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

export function SalesInfoTab({ event }: SalesInfoTabProps) {
  return (
    <div className="space-y-6">
      {/* 1. 기획사 정보 */}
      <SectionCard icon={Building2} title="기획사 정보">
        <div className="space-y-1.5 text-sm">
          <p>주최: {event.organizer.host}</p>
          <p>주관: {event.organizer.manager}</p>
          <p>문의: {event.organizer.contact}</p>
        </div>
      </SectionCard>

      {/* 2. 상품관련 정보 */}
      <SectionCard icon={Info} title="상품관련 정보">
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-border">
                <td className="py-3 px-4 text-sm text-muted-foreground bg-muted/30 w-[120px] font-medium">
                  주최/기획
                </td>
                <td className="py-3 px-4 text-sm">{event.organizer.host}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground bg-muted/30 w-[120px] font-medium">
                  고객문의
                </td>
                <td className="py-3 px-4 text-sm">{event.organizer.contact}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-4 text-sm text-muted-foreground bg-muted/30 font-medium">
                  공연시간
                </td>
                <td className="py-3 px-4 text-sm">{event.runtime}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground bg-muted/30 font-medium">
                  관람등급
                </td>
                <td className="py-3 px-4 text-sm">{event.ageRating}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-4 text-sm text-muted-foreground bg-muted/30 font-medium">
                  주연
                </td>
                <td className="py-3 px-4 text-sm">{event.castInfo || "해당없음"}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground bg-muted/30 font-medium">
                  공연장소
                </td>
                <td className="py-3 px-4 text-sm">{event.venue}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-4 text-sm text-muted-foreground bg-muted/30 font-medium">
                  예매수수료
                </td>
                <td className="py-3 px-4 text-sm">{event.bookingFee}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground bg-muted/30 font-medium">
                  배송료
                </td>
                <td className="py-3 px-4 text-sm">{event.shippingFee}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-muted-foreground bg-muted/30 font-medium">
                  유효기간/이용조건
                </td>
                <td colSpan={3} className="py-3 px-4 text-sm">
                  {event.validityPeriod}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* 3. 좌석/가격 정보 */}
      <SectionCard icon={Armchair} title="좌석/가격 정보">
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">구역</th>
                <th className="text-right py-2.5 px-4 font-medium text-muted-foreground">가격</th>
                <th className="text-right py-2.5 px-4 font-medium text-muted-foreground">총 좌석</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {event.sections.map((sec) => (
                <tr key={sec.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-4 font-medium">{sec.name}</td>
                  <td className="py-2.5 px-4 text-right">
                    <PriceDisplay amount={sec.price} size="sm" />
                  </td>
                  <td className="py-2.5 px-4 text-right text-muted-foreground">
                    {sec.totalSeats.toLocaleString()}석
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* 4. 예매취소조건 */}
      <SectionCard icon={AlertCircle} title="예매취소조건">
        <p className="text-sm text-muted-foreground mb-3">
          취소일자에 따라서 아래와 같이 취소수수료가 부과됩니다. 예매 일 기준보다 관람일 기준이
          우선 적용됩니다. 단, 예매 당일 밤 12시 이전 취소 시에는 취소수수료가 없으며, 예매
          수수료도 환불됩니다. (취소기한 내에 한함)
        </p>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">취소일</th>
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">취소수수료</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {event.cancellationPolicy.map((rule, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-4">{rule.period}</td>
                  <td className="py-2.5 px-4">{rule.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* 5. 티켓 수령 안내 */}
      <SectionCard icon={Ticket} title="티켓 수령 안내">
        <ul className="space-y-2">
          {event.ticketDelivery.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed flex items-start gap-2">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {event.mobileTicketInfo.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-sm font-semibold mb-3">모바일티켓 안내</h4>
            <ul className="space-y-2">
              {event.mobileTicketInfo.map((item, i) => (
                <li key={i} className="text-sm leading-relaxed flex items-start gap-2">
                  <span className="text-muted-foreground shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </SectionCard>

      {/* 6. 판매자 정보 + 에스크로 */}
      <SectionCard icon={Building2} title="판매자 정보">
        <div className="rounded-lg border border-border overflow-hidden mb-4">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-border">
                <td className="py-3 px-4 text-sm text-muted-foreground bg-muted/30 w-[100px] font-medium">
                  상호
                </td>
                <td className="py-3 px-4 text-sm">{event.sellerInfo.name}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground bg-muted/30 w-[100px] font-medium">
                  대표자명
                </td>
                <td className="py-3 px-4 text-sm">{event.sellerInfo.ceo}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-4 text-sm text-muted-foreground bg-muted/30 font-medium">
                  사업자등록번호
                </td>
                <td className="py-3 px-4 text-sm">{event.sellerInfo.bizNumber}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground bg-muted/30 font-medium">
                  E-mail
                </td>
                <td className="py-3 px-4 text-sm">{event.organizer.email}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-4 text-sm text-muted-foreground bg-muted/30 font-medium">
                  연락처
                </td>
                <td className="py-3 px-4 text-sm">{event.organizer.contact}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground bg-muted/30 font-medium" />
                <td className="py-3 px-4 text-sm" />
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-muted-foreground bg-muted/30 font-medium">
                  주소
                </td>
                <td colSpan={3} className="py-3 px-4 text-sm">
                  {event.sellerInfo.address}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Escrow notice */}
        <div className="rounded-lg bg-muted/30 p-4 flex items-start gap-2">
          <ShieldCheck size={16} className="text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
            {event.escrowInfo}
          </p>
        </div>
      </SectionCard>

      {/* 7. 예매 유의사항 */}
      <SectionCard icon={AlertTriangle} title="예매 유의사항">
        <ul className="space-y-2">
          {event.precautions.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed flex items-start gap-2">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
