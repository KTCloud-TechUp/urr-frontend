'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  ArtistSelectStep,
  MembershipIntroStep,
  MembershipPaymentStep,
  MembershipProfileStep,
  MembershipCompleteStep,
} from '@/features/membership'
import { mockUser } from '@/shared/lib/mocks/user'
import { mockArtists } from '@/shared/lib/mocks/artists'
import type { Artist, TierLevel } from '@/shared/types'

type Step = 'select' | 'intro' | 'payment' | 'profile' | 'complete'

export function MembershipWidget() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState<Step>('select')
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [profileData, setProfileData] = useState<{ nickname: string; tier: TierLevel } | null>(null)

  // If artistId is provided via query param, skip to intro step
  useEffect(() => {
    const artistId = searchParams.get('artistId')
    if (artistId) {
      const artist = mockArtists.find((a) => a.id === artistId)
      if (artist) {
        const t = setTimeout(() => {
          setSelectedArtist(artist)
          setStep('intro')
        }, 0)
        return () => clearTimeout(t)
      }
    }
  }, [searchParams])

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist)
    setStep('intro')
  }

  const handleBack = () => {
    if (step === 'intro') {
      setStep('select')
      setSelectedArtist(null)
    } else if (step === 'payment') {
      setStep('intro')
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {step === 'select' && (
        <ArtistSelectStep
          artists={mockArtists}
          memberships={mockUser.memberships}
          onSelect={handleSelectArtist}
        />
      )}

      {step === 'intro' && selectedArtist && (
        <MembershipIntroStep
          artist={selectedArtist}
          onBack={handleBack}
          onSubscribe={() => setStep('payment')}
        />
      )}

      {step === 'payment' && selectedArtist && (
        <MembershipPaymentStep
          artist={selectedArtist}
          onBack={handleBack}
          onComplete={() => setStep('profile')}
        />
      )}

      {step === 'profile' && selectedArtist && (
        <MembershipProfileStep
          artist={selectedArtist}
          onComplete={(data) => {
            setProfileData({ nickname: data.nickname, tier: data.tier })
            setStep('complete')
          }}
        />
      )}

      {step === 'complete' && selectedArtist && (
        <MembershipCompleteStep
          artist={selectedArtist}
          nickname={profileData?.nickname ?? ''}
          tier={profileData?.tier ?? 'cloud'}
        />
      )}
    </div>
  )
}
