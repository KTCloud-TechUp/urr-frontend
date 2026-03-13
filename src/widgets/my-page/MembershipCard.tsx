'use client'

import { useState } from 'react'
import { Check, ChevronDown, Loader2, Music, Pencil, RefreshCw, XCircle } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { TierBadge } from '@/entities/user'
import { getArtistGradient } from '@/shared/lib/mocks/home'
import { cn } from '@/shared/lib/utils'
import type { Membership, TierLevel } from '@/shared/types'
import { TIER_LABELS } from '@/shared/types'

const NEXT_TIER: Record<TierLevel, TierLevel | null> = {
  mist: 'cloud',
  cloud: 'thunder',
  thunder: 'lightning',
  lightning: null,
}

const TIER_COLORS: Record<TierLevel, string> = {
  mist: 'var(--tier-mist)',
  cloud: 'var(--tier-cloud)',
  thunder: 'var(--tier-thunder)',
  lightning: 'var(--tier-lightning)',
}

interface MembershipCardProps {
  membership: Membership
  isExpanded: boolean
  onToggle: () => void
  isMelonLinked: boolean
  isMelonLinking: boolean
  onMelonLink: () => void
  onCancel?: () => void
  isCancelling?: boolean
  onNicknameChange?: (membershipId: string, nickname: string) => void
}

export function MembershipCard({
  membership,
  isExpanded,
  onToggle,
  isMelonLinked,
  isMelonLinking,
  onMelonLink,
  onCancel,
  isCancelling,
  onNicknameChange,
}: MembershipCardProps) {
  const [isEditingNickname, setIsEditingNickname] = useState(false)
  const [nicknameInput, setNicknameInput] = useState(membership.nickname)

  const expiryDate = new Date(membership.expiresAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const gradient = getArtistGradient(membership.artistId)

  const nextTier = NEXT_TIER[membership.tier]
  const progress = membership.tierProgress
  const progressPercent = progress
    ? Math.min(100, Math.round((progress.current / progress.required) * 100))
    : 0

  const handleNicknameSave = () => {
    const trimmed = nicknameInput.trim()
    if (trimmed && trimmed !== membership.nickname) {
      onNicknameChange?.(membership.id, trimmed)
    }
    setIsEditingNickname(false)
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Main row */}
      <div className="flex items-center gap-4 p-4">
        {/* Artist gradient avatar */}
        <div
          className="size-12 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-bold"
          style={{ background: gradient }}
        >
          {membership.artistName.charAt(0)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold truncate">{membership.artistName}</span>
            <TierBadge tier={membership.tier} size="sm" />
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span
              className={cn(
                'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                membership.isActive
                  ? 'bg-green-50 text-green-600'
                  : 'bg-red-50 text-red-600',
              )}
            >
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  membership.isActive ? 'bg-green-500' : 'bg-red-500',
                )}
              />
              {membership.isActive ? '활성' : '만료'}
            </span>
            <span>{membership.isActive ? '갱신일' : '만료일'}: {expiryDate}</span>
          </div>
        </div>

        {/* Manage button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="shrink-0 gap-1"
        >
          관리
          <ChevronDown
            size={14}
            className={cn('transition-transform duration-200', isExpanded && 'rotate-180')}
          />
        </Button>
      </div>

      {/* Expanded management section */}
      {isExpanded && (
        <div className="border-t border-border bg-muted/30 px-5 py-5 space-y-6">
          {/* Nickname */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">활동 닉네임</label>
            {isEditingNickname ? (
              <div className="flex items-center gap-2">
                <Input
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNicknameSave()}
                  className="h-8 text-sm w-[160px]"
                  maxLength={12}
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={handleNicknameSave}
                >
                  <Check size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground"
                  onClick={() => {
                    setNicknameInput(membership.nickname)
                    setIsEditingNickname(false)
                  }}
                >
                  <XCircle size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{membership.nickname}</span>
                <button
                  onClick={() => setIsEditingNickname(true)}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <Pencil size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Tier progress */}
          {progress && (
            <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">등급 진행</label>
            <div className="flex items-center gap-3 max-w-[320px]">
              <span className="text-xs tabular-nums font-medium shrink-0">{progressPercent}%</span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: TIER_COLORS[membership.tier],
                  }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground shrink-0">
                {nextTier ? TIER_LABELS[nextTier] : '최고 등급'}
              </span>
            </div>
            </div>
          )}

          {/* Tier verification status */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">등급 인증</label>
            <p className="text-sm font-medium">{TIER_LABELS[membership.tier]} 등급 인증 완료</p>
          </div>

          {/* Actions */}
          <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">멤버십 관리</label>
          <div className="flex items-center gap-2">
            {/* Melon linking */}
            {isMelonLinked ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                <Music size={14} />
                멜론 연동 완료 ✓
              </span>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={onMelonLink}
                disabled={isMelonLinking}
                className="gap-1.5"
              >
                {isMelonLinking ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    연동 중...
                  </>
                ) : (
                  <>
                    <Music size={14} />
                    멜론 연동
                  </>
                )}
              </Button>
            )}

            {/* Renewal button (expired only) */}
            {!membership.isActive && (
              <Button variant="outline" size="sm" className="gap-1.5">
                <RefreshCw size={14} />
                갱신
              </Button>
            )}

            {/* Cancel button (active only) */}
            {membership.isActive && onCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                disabled={isCancelling}
                className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                {isCancelling ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    해지 중...
                  </>
                ) : (
                  <>
                    <XCircle size={14} />
                    해지
                  </>
                )}
              </Button>
            )}
          </div>
          </div>
        </div>
      )}
    </div>
  )
}
