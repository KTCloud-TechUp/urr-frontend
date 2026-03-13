'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar'
import { TierBadge } from '@/entities/user'
import type { User } from '@/shared/types'

interface MyPageHeaderProps {
  user: User
}

export function MyPageHeader({ user }: MyPageHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-16">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="text-lg font-semibold bg-muted">
          {user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <TierBadge tier={user.tier} size="default" />
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
      </div>
    </div>
  )
}
