'use client'

import { useEffect, useState } from 'react'
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
  const [tossConfig, setTossConfig] = useState<TossConfig | undefined>(undefined)
  const { data: currentUser } = useCurrentUser()

  useEffect(() => {
    if (!currentUser?.userId) return
    subscribeMembership(artist.id, currentUser.userId)
      .then((res) => {
        setTossConfig({
          orderId: res.orderId,
          orderName: `${artist.name} 멤버십 (1년)`,
          successUrl: `${window.location.origin}/membership`,
          failUrl: `${window.location.origin}/membership?paymentFail=1`,
          storageKey: 'urr:toss:membership',
          storageData: { orderId: res.orderId, paymentId: res.paymentId },
        })
      })
      .catch(() => {
        // subscribe 실패 시 tossConfig=undefined 유지 → 결제 버튼 비활성화
      })
  }, [artist.id, artist.name, currentUser?.userId])

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
      tossConfig={tossConfig}
    />
  )
}
