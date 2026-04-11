'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import {
  ArtistSelectStep,
  MembershipIntroStep,
  MembershipPaymentStep,
  MembershipProfileStep,
  MembershipCompleteStep,
  useMemberships,
} from '@/features/membership'
import { useArtists } from '@/features/artist'
import { confirmPayment } from '@/features/payment/api/confirmPayment'
import { getMemberships } from '@/features/membership/api/getMemberships'
import { useCurrentUser, AUTH_ME_QUERY_KEY } from '@/features/auth/model/useCurrentUser'
import type { Artist, TierLevel } from '@/shared/types'

type Step = 'select' | 'intro' | 'payment' | 'profile' | 'complete'

export function MembershipWidget() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState<Step>('select')
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [membershipId, setMembershipId] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<{ nickname: string; tier: TierLevel } | null>(null)
  const { data: memberships = [] } = useMemberships()
  const { data: artists = [] } = useArtists()
  const { data: currentUser } = useCurrentUser()
  const queryClient = useQueryClient()
  const callbackHandled = useRef(false)

  // Toss 결제 성공 콜백: /membership?paymentKey=...&orderId=...&amount=... 감지
  useEffect(() => {
    if (callbackHandled.current) return
    if (typeof window === 'undefined') return
    if (!currentUser?.userId) return

    const params = new URLSearchParams(window.location.search)
    const paymentKey = params.get('paymentKey')
    const orderId = params.get('orderId')
    const amount = params.get('amount')
    const paymentFail = params.get('paymentFail')

    if (paymentFail) {
      window.history.replaceState({}, '', window.location.pathname)
      sessionStorage.removeItem('urr:toss:membership')
      return
    }

    if (!paymentKey || !orderId || !amount) return

    const raw = sessionStorage.getItem('urr:toss:membership')
    if (!raw) return

    // artists 데이터가 아직 로드되지 않았으면 대기
    if (artists.length === 0) return

    callbackHandled.current = true
    sessionStorage.removeItem('urr:toss:membership')
    window.history.replaceState({}, '', window.location.pathname)

    const { artistId } = JSON.parse(raw) as { orderId: string; paymentId: string; artistId: string }

    // 리다이렉트 후 state가 초기화되므로 artistId로 selectedArtist 복원
    const artist = artists.find((a) => a.id === artistId)
    if (artist) queueMicrotask(() => setSelectedArtist(artist))

    confirmPayment({ paymentKey, orderId, amount: Number(amount), userId: currentUser.userId })
      .then(() => getMemberships(currentUser.userId))
      .then((fresh) => {
        const found = fresh.find((m) => m.artistId === artistId)
        if (found) setMembershipId(found.id)
        queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY })
        setStep('profile')
      })
      .catch(() => {
        // 실패 시 payment 단계로 복귀
        setStep('payment')
      })
  }, [currentUser?.userId, artists])

  // reset=1 파라미터가 있으면 select 단계로 초기화 (사이드바에서 재진입 시)
  useEffect(() => {
    if (!searchParams.get('reset')) return
    queueMicrotask(() => {
      setStep('select')
      setSelectedArtist(null)
      window.history.replaceState({}, '', '/membership')
    })
  }, [searchParams])

  // If artistId is provided via query param, skip to intro step
  useEffect(() => {
    const artistId = searchParams.get('artistId')
    if (artistId) {
      const artist = artists.find((a) => a.id === artistId)
      if (artist) {
        const t = setTimeout(() => {
          setSelectedArtist(artist)
          setStep('intro')
        }, 0)
        return () => clearTimeout(t)
      }
    }
  }, [searchParams, artists])

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
          artists={artists}
          memberships={memberships}
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
          membershipId={membershipId}
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
          tier={profileData?.tier ?? 'CLOUD'}
        />
      )}
    </div>
  )
}
