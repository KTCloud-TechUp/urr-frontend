'use client'

import { useState } from 'react'
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
import type { User } from '@/shared/types'

const tickets = getMyTickets()
const transferRecords = getMyTransferRecords()

export function MyPageWidget() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') ?? 'membership'

  const { data: meData, isLoading } = useCurrentUser()

  const [user, setUser] = useState<User>(() => ({ ...mockUser }))

  const mergedUser: User = {
    ...user,
    name: meData?.nickname ?? user.name,
    email: meData?.email ?? user.email,
  }

  if (isLoading) return <MyPageSkeleton />

  const handleTabChange = (tab: string) => {
    router.push(`/my-page?tab=${tab}`, { scroll: false })
  }

  const handleUpdateUser = (updates: Partial<Pick<User, 'name' | 'email'>>) => {
    setUser((prev) => ({ ...prev, ...updates }))
  }

  const handleCancelMembership = (membershipId: string) => {
    setUser((prev) => ({
      ...prev,
      memberships: prev.memberships.map((m) =>
        m.id === membershipId ? { ...m, isActive: false } : m
      ),
    }))
  }

  const handleNicknameChange = (membershipId: string, nickname: string) => {
    setUser((prev) => ({
      ...prev,
      memberships: prev.memberships.map((m) =>
        m.id === membershipId ? { ...m, nickname } : m
      ),
    }))
  }

  return (
    <div>
      <MyPageHeader user={mergedUser} />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList variant="line" className="w-full justify-start mt-8 border-b border-border">
          <TabsTrigger value="membership" className="flex-none">멤버십</TabsTrigger>
          <TabsTrigger value="wallet" className="flex-none">티켓 월렛</TabsTrigger>
          <TabsTrigger value="transfers" className="flex-none">양도 내역</TabsTrigger>
          <TabsTrigger value="settings" className="flex-none">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="membership" className="pt-6">
          <MembershipTab
            memberships={mergedUser.memberships}
            onCancelMembership={handleCancelMembership}
            onNicknameChange={handleNicknameChange}
          />
        </TabsContent>

        <TabsContent value="wallet" className="pt-6">
          <TicketWalletTab tickets={tickets} user={mergedUser} />
        </TabsContent>

        <TabsContent value="transfers" className="pt-6">
          <TransferHistoryTab records={transferRecords} />
        </TabsContent>

        <TabsContent value="settings" className="pt-6">
          <SettingsTab user={mergedUser} onUpdateUser={handleUpdateUser} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
