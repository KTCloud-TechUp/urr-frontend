'use client'

import { Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { cn } from '@/shared/lib/utils'
import { formatCompactNumber } from '@/shared/lib/format'
import type { Artist, Membership } from '@/shared/types'

interface ArtistSelectStepProps {
  artists: Artist[]
  memberships: Membership[]
  onSelect: (artist: Artist) => void
}

export function ArtistSelectStep({ artists, memberships, onSelect }: ArtistSelectStepProps) {
  const activeMembershipArtistIds = memberships
    .filter((m) => m.isActive)
    .map((m) => m.artistId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">멤버십 가입</h1>
        <p className="text-sm text-muted-foreground mt-1">
          멤버십에 가입할 아티스트를 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {artists.map((artist) => {
          const isJoined = activeMembershipArtistIds.includes(artist.id)

          return (
            <button
              key={artist.id}
              onClick={() => !isJoined && onSelect(artist)}
              disabled={isJoined}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl border text-left transition-all',
                isJoined
                  ? 'border-border bg-muted/30 opacity-60 cursor-not-allowed'
                  : 'border-border bg-card hover:border-primary/30 hover:shadow-sm cursor-pointer',
              )}
            >
              <Avatar className="size-12 shrink-0">
                <AvatarImage src={artist.avatar} alt={artist.name} />
                <AvatarFallback className="text-sm font-bold bg-muted">
                  {artist.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold truncate">{artist.name}</span>
                  {isJoined && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium shrink-0">
                      가입됨
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <Users size={12} />
                  팔로워 {formatCompactNumber(artist.followerCount)}명
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {artists.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center">
          <p className="text-sm text-muted-foreground">등록된 아티스트가 없습니다</p>
        </div>
      )}
    </div>
  )
}
