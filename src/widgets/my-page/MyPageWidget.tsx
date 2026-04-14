'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs'
import { MyPageHeader } from './MyPageHeader'
import { MembershipTab } from './MembershipTab'
import { TicketWalletTab } from './TicketWalletTab'
import { TransferHistoryTab } from './TransferHistoryTab'
import { SettingsTab } from './SettingsTab'
import { MyPageSkeleton } from './MyPageSkeleton'
import { mockUser } from '@/shared/lib/mocks/user'
import { useCurrentUser } from '@/features/auth/model/useCurrentUser'
import { useMemberships, useUpdateNickname, useCancelMembership } from '@/features/membership'
import { getMySales, getMyPurchases } from '@/features/transfer'
import { useMyReservations } from '@/features/reservation'
import type { User, TierLevel } from '@/shared/types'

const TIER_RANK: Record<TierLevel, number> = {
  LIGHTNING: 4,
  THUNDER: 3,
  CLOUD: 2,
  MIST: 1,
}

function deriveTopTier(memberships: User['memberships']): TierLevel {
  const active = memberships.filter((m) => m.isActive)
  if (active.length === 0) return 'MIST'
  return active.reduce((best, m) =>
    TIER_RANK[m.tier] > TIER_RANK[best] ? m.tier : best,
    'MIST' as TierLevel,
  )
}

export function MyPageWidget() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') ?? 'membership'

  const { data: meData, isLoading: isUserLoading } = useCurrentUser()
  const { data: memberships = [], isLoading: isMembershipsLoading } = useMemberships()
  const { tickets, isLoading: isTicketsLoading } = useMyReservations(meData?.userId)
  const updateNickname = useUpdateNickname()
  const cancelMembership = useCancelMembership()

  const { data: salesRecords = [] } = useQuery({
    queryKey: ['my-transfer-sales', meData?.userId],
    queryFn: () => getMySales(meData?.userId),
    enabled: !!meData,
  })

  const { data: purchaseRecords = [] } = useQuery({
    queryKey: ['my-transfer-purchases', meData?.userId],
    queryFn: () => getMyPurchases(meData?.userId),
    enabled: !!meData,
  })

  const transferRecords = [...salesRecords, ...purchaseRecords]

  const displayUser: User = {
    ...mockUser,
    name: meData?.nickname ?? mockUser.name,
    email: meData?.email ?? mockUser.email,
    memberships,
    tier: deriveTopTier(memberships),
  }

  if (isUserLoading || isMembershipsLoading || isTicketsLoading) return <MyPageSkeleton />

  const handleTabChange = (tab: string) => {
    router.push(`/my-page?tab=${tab}`, { scroll: false })
  }

  const handleUpdateUser = (updates: Partial<Pick<User, 'name' | 'email'>>) => {
    // TODO: PATCH /api/v1/user
    void updates
  }

  const handleCancelMembership = (membershipId: string) => {
    const membership = memberships.find((m) => m.id === membershipId)
    if (!membership?.orderId) return
    cancelMembership.mutate(membership.orderId)
  }

  const handleNicknameChange = (membershipId: string, nickname: string) => {
    if (!meData) return
    updateNickname.mutate({ membershipId, userId: meData.userId, nickname })
  }

  return (
    <div>
      <MyPageHeader user={displayUser} />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList variant="line" className="w-full justify-start mt-8 border-b border-border">
          <TabsTrigger value="membership" className="flex-none">멤버십</TabsTrigger>
          <TabsTrigger value="wallet" className="flex-none">티켓 월렛</TabsTrigger>
          <TabsTrigger value="transfers" className="flex-none">양도 내역</TabsTrigger>
          <TabsTrigger value="settings" className="flex-none">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="membership" className="pt-6">
          <MembershipTab
            memberships={memberships}
            onCancelMembership={handleCancelMembership}
            onNicknameChange={handleNicknameChange}
          />
        </TabsContent>

        <TabsContent value="wallet" className="pt-6">
          <TicketWalletTab tickets={tickets} user={displayUser} userId={meData?.userId} />
        </TabsContent>

        <TabsContent value="transfers" className="pt-6">
          <TransferHistoryTab records={transferRecords} userId={meData?.userId} />
        </TabsContent>

        <TabsContent value="settings" className="pt-6">
          <SettingsTab
            user={displayUser}
            onUpdateUser={handleUpdateUser}
            initialConsents={meData ? {
              marketingConsent: meData.marketingConsent,
              pushConsent: meData.pushConsent,
              smsConsent: meData.smsConsent,
            } : undefined}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
