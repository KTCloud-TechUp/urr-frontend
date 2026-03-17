'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { EmptyState } from '@/shared/ui/EmptyState'
import { MembershipCard } from './MembershipCard'
import { MembershipCancelDialog } from './MembershipCancelDialog'
import type { Membership } from '@/shared/types'

interface MembershipTabProps {
  memberships: Membership[]
  onCancelMembership: (membershipId: string) => void
  onNicknameChange?: (membershipId: string, nickname: string) => void
}

export function MembershipTab({ memberships, onCancelMembership, onNicknameChange }: MembershipTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [melonLinkedMap, setMelonLinkedMap] = useState<Record<string, boolean>>({})
  const [linkingId, setLinkingId] = useState<string | null>(null)

  // Cancel flow state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const handleMelonLink = (membershipId: string) => {
    setLinkingId(membershipId)
    setTimeout(() => {
      setMelonLinkedMap((prev) => ({ ...prev, [membershipId]: true }))
      setLinkingId(null)
    }, 1000)
  }

  const handleCancelRequest = (membershipId: string) => {
    setCancelTargetId(membershipId)
    setCancelDialogOpen(true)
  }

  const handleCancelConfirm = (_: string) => {
    if (!cancelTargetId) return
    setIsCancelling(true)
    setTimeout(() => {
      onCancelMembership(cancelTargetId)
      setIsCancelling(false)
      setCancelDialogOpen(false)
      setCancelTargetId(null)
    }, 1000)
  }

  const cancelTarget = memberships.find((m) => m.id === cancelTargetId)

  if (memberships.length === 0) {
    return (
      <EmptyState
        icon={Users}
        iconContainer
        title="가입한 멤버십이 없습니다."
        description="아티스트 페이지에서 멤버십에 가입하세요!"
        action={<Button asChild><Link href="/artists">아티스트 찾기</Link></Button>}
      />
    )
  }

  return (
    <>
      <div className="space-y-3">
        {memberships.map((m) => (
          <MembershipCard
            key={m.id}
            membership={m}
            isExpanded={expandedId === m.id}
            onToggle={() => handleToggle(m.id)}
            isMelonLinked={melonLinkedMap[m.id] ?? false}
            isMelonLinking={linkingId === m.id}
            onMelonLink={() => handleMelonLink(m.id)}
            onCancel={() => handleCancelRequest(m.id)}
            isCancelling={isCancelling && cancelTargetId === m.id}
            onNicknameChange={onNicknameChange}
          />
        ))}
      </div>

      <MembershipCancelDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        artistName={cancelTarget?.artistName ?? ''}
        onConfirm={handleCancelConfirm}
        isProcessing={isCancelling}
      />
    </>
  )
}
