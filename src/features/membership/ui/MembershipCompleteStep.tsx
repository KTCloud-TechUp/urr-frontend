'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { PartyPopper } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { TierBadge } from '@/entities/user'
import type { Artist, TierLevel } from '@/shared/types'

interface MembershipCompleteStepProps {
  artist: Artist
  nickname: string
  tier: TierLevel
}

export function MembershipCompleteStep({ artist, nickname, tier }: MembershipCompleteStepProps) {
  const router = useRouter()

  const membershipNumber = useMemo(() => {
    const prefix = artist.id.toUpperCase().slice(0, 3)
    const year = new Date().getFullYear()
    const hash = artist.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    const suffix = String(hash % 10000).padStart(4, '0')
    return `${prefix}-${year}-${suffix}`
  }, [artist])

  const expiryDate = useMemo(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() + 1)
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
  }, [])

  return (
    <div className="flex flex-col items-center text-center py-8 space-y-8">
      {/* Celebration */}
      <div className="space-y-4">
        <div className="size-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <PartyPopper size={28} className="text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">멤버십 가입 완료!</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {artist.name} 멤버십에 성공적으로 가입되었습니다
          </p>
        </div>
      </div>

      {/* Membership card */}
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={artist.avatar} alt={artist.name} />
            <AvatarFallback className="text-sm font-bold bg-muted">
              {artist.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-semibold">{artist.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <TierBadge tier={tier} size="sm" />
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-3 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">닉네임</span>
            <span className="font-medium">{nickname}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">멤버십 번호</span>
            <span className="font-medium">{membershipNumber}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">만료일</span>
            <span className="font-medium">{expiryDate}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => router.push(`/artists/${artist.id}`)}>
          아티스트 페이지로 이동
        </Button>
        <Button variant="ghost" onClick={() => router.push('/')}>
          홈으로
        </Button>
      </div>
    </div>
  )
}
