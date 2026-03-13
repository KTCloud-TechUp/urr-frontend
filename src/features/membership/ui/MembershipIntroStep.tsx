'use client'

import { ArrowLeft, Crown, Check, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { TierBadge } from '@/entities/user'
import { cn } from '@/shared/lib/utils'
import type { Artist, TierLevel } from '@/shared/types'

interface MembershipIntroStepProps {
  artist: Artist
  onBack: () => void
  onSubscribe: () => void
}

const tierBenefits: {
  tier: TierLevel
  booking: string
  openTiming: string
  fee: string
  transferFee: string
  vqa: boolean
}[] = [
  { tier: 'lightning', booking: '우선 예매', openTiming: '개별 오픈', fee: '1,000원', transferFee: '5%', vqa: false },
  { tier: 'thunder', booking: '우선 예매', openTiming: '라이트닝 +1시간', fee: '2,000원', transferFee: '5%', vqa: false },
  { tier: 'cloud', booking: '일반 예매', openTiming: '썬더 +2일', fee: '3,000원', transferFee: '10%', vqa: true },
  { tier: 'mist', booking: '일반 예매', openTiming: '클라우드 +1시간', fee: '4,000원', transferFee: '10%', vqa: true },
]

export function MembershipIntroStep({ artist, onBack, onSubscribe }: MembershipIntroStepProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          돌아가기
        </button>
        <div className="flex items-center gap-4">
          <Avatar className="size-14 shrink-0">
            <AvatarImage src={artist.avatar} alt={artist.name} />
            <AvatarFallback className="text-lg font-bold bg-muted">
              {artist.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{artist.name} 멤버십</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              멤버십 혜택을 확인하고 가입하세요
            </p>
          </div>
        </div>
      </div>

      {/* Benefits intro */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Crown size={18} className="text-primary" />
          <h2 className="text-lg font-bold">멤버십 혜택</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {artist.name} 멤버십에 가입하면 선예매 우선권, 양도 마켓 이용, 전용 굿즈 구매 등
          다양한 혜택을 누릴 수 있습니다. 가입 시 클라우드 등급으로 시작하며, 멜론 연동을 통해
          더 높은 등급을 받을 수 있습니다.
        </p>
      </div>

      {/* Tier comparison table */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold">티어별 혜택 비교</h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold">티어</th>
                <th className="text-left px-4 py-3 font-semibold">예매</th>
                <th className="text-left px-4 py-3 font-semibold">오픈 시점</th>
                <th className="text-left px-4 py-3 font-semibold">예매 수수료</th>
                <th className="text-left px-4 py-3 font-semibold">양도 수수료</th>
                <th className="text-center px-4 py-3 font-semibold">VQA 면제</th>
              </tr>
            </thead>
            <tbody>
              {tierBenefits.map((row, idx) => (
                <tr
                  key={row.tier}
                  className={cn(idx > 0 && 'border-t border-border')}
                >
                  <td className="px-4 py-3">
                    <TierBadge tier={row.tier} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.booking}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.openTiming}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.fee}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.transferFee}</td>
                  <td className="px-4 py-3 text-center">
                    {row.vqa ? (
                      <X size={14} className="mx-auto text-muted-foreground/50" />
                    ) : (
                      <Check size={14} className="mx-auto text-green-600" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          * VQA 면제: 라이트닝, 썬더 등급은 본인인증 절차(VQA)가 면제됩니다
        </p>
      </div>

      {/* Price + CTA */}
      <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">멤버십 가격</p>
            <p className="text-2xl font-bold mt-0.5">30,000원<span className="text-sm font-normal text-muted-foreground">/년</span></p>
          </div>
          <Button size="lg" className="gap-2" onClick={onSubscribe}>
            <Crown size={16} />
            가입하기
          </Button>
        </div>
      </div>
    </div>
  )
}
