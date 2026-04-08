'use client'

import { useCallback } from 'react'
import { PaymentDialog } from '@/shared/ui/PaymentDialog'
import { subscribeMembership } from '@/features/membership/api/subscribeMembership'
import { useCurrentUser } from '@/features/auth/model/useCurrentUser'
import type { TossConfig } from '@/shared/ui/PaymentDialog'
import type { Artist } from '@/shared/types'

const MEMBERSHIP_FEE = 30000

interface MembershipPaymentStepProps {
  artist: Artist
  onBack: () => void
  onComplete: () => void
}

export function MembershipPaymentStep({ artist, onBack, onComplete }: MembershipPaymentStepProps) {
  const { data: currentUser } = useCurrentUser()

  const getTossConfig = useCallback(async (): Promise<TossConfig> => {
    if (!currentUser?.userId) throw new Error('로그인이 필요합니다.')
    const res = await subscribeMembership(artist.id, currentUser.userId)
    return {
      orderId: res.orderId,
      orderName: `${artist.name} 멤버십 (1년)`,
      successUrl: `${window.location.origin}/membership`,
      failUrl: `${window.location.origin}/membership?paymentFail=1`,
      storageKey: 'urr:toss:membership',
      storageData: { orderId: res.orderId, paymentId: res.paymentId, artistId: artist.id },
    }
  }, [artist.id, artist.name, currentUser])

  return (
    <PaymentDialog
      open
      title={`${artist.name} 멤버십 결제`}
      orderDescription={`${artist.name} 멤버십 (1년)`}
      orderItems={[
        { label: '멤버십 연회비', amount: MEMBERSHIP_FEE },
      ]}
      totalAmount={MEMBERSHIP_FEE}
      onComplete={onComplete}
      onCancel={onBack}
      getTossConfig={getTossConfig}
    />
  )
}
