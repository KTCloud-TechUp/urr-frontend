'use client'


import { useSearchParams, useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs'
import { MyPageHeader } from './MyPageHeader'
import { MembershipTab } from './MembershipTab'
import { TicketWalletTab } from './TicketWalletTab'
import { TransferHistoryTab } from './TransferHistoryTab'
import { SettingsTab } from './SettingsTab'
import { MyPageSkeleton } from './MyPageSkeleton'
import { mockUser } from '@/shared/lib/mocks/user'
import { getMyTickets, getMyTransferRecords } from '@/shared/lib/mocks/my-page'
import { useCurrentUser } from '@/features/auth/model/useCurrentUser'
import { useMemberships, useUpdateNickname, useCancelMembership } from '@/features/membership'
import type { User } from '@/shared/types'

const tickets = getMyTickets()
const transferRecords = getMyTransferRecords()

export function MyPageWidget() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') ?? 'membership'

  const { data: meData, isLoading: isUserLoading } = useCurrentUser()
  const { data: memberships = [], isLoading: isMembershipsLoading } = useMemberships()
  const updateNickname = useUpdateNickname()
  const cancelMembership = useCancelMembership()

  const displayUser: User = {
    ...mockUser,
    name: meData?.nickname ?? mockUser.name,
    email: meData?.email ?? mockUser.email,
    memberships,
  }

  if (isUserLoading || isMembershipsLoading) return <MyPageSkeleton />

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
          <TicketWalletTab tickets={tickets} user={displayUser} />
        </TabsContent>

        <TabsContent value="transfers" className="pt-6">
          <TransferHistoryTab records={transferRecords} />
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
