'use client'

import { useState, useEffect } from 'react'
import { Music, Loader2, CheckCircle2, CircleCheck, CircleAlert } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { TierBadge } from '@/entities/user'
import type { Artist, TierLevel } from '@/shared/types'

type MelonState = 'idle' | 'linking' | 'done'
type NicknameStatus = 'idle' | 'checking' | 'available' | 'duplicate' | 'error'

interface MembershipProfileStepProps {
  artist: Artist
  onComplete: (data: { nickname: string; tier: TierLevel; melonLinked: boolean }) => void
}

// Mock taken nicknames for duplicate check
const TAKEN_NICKNAMES = ['지디사랑해', '보라해아미', '마이윈터', '아이브최고', '방탄소년']

function validateNickname(value: string): string | null {
  if (!value) return null
  if (value.length < 2) return '2자 이상 입력해주세요'
  if (value.length > 12) return '12자 이하로 입력해주세요'
  if (/\s/.test(value)) return '공백은 사용할 수 없습니다'
  if (!/^[가-힣a-zA-Z0-9]+$/.test(value)) return '특수문자는 사용할 수 없습니다'
  return null
}

// Mock streaming analysis result
const MOCK_MELON_RESULT = {
  totalStreams: 1247,
  artistRatio: 34.2,
  fanScore: 72,
  tier: 'thunder' as TierLevel,
}

export function MembershipProfileStep({ artist, onComplete }: MembershipProfileStepProps) {
  const [nickname, setNickname] = useState('')
  const [nicknameTouched, setNicknameTouched] = useState(false)
  const [nicknameStatus, setNicknameStatus] = useState<NicknameStatus>('idle')

  const [melonId, setMelonId] = useState('')
  const [melonState, setMelonState] = useState<MelonState>('idle')

  const nicknameError = validateNickname(nickname)
  const showNicknameError = nicknameError && nicknameTouched
  const isNicknameValid = nickname.length >= 2 && !nicknameError && nicknameStatus === 'available'

  // Debounced duplicate check
  useEffect(() => {
    if (!nickname || nickname.length < 2 || validateNickname(nickname)) {
      queueMicrotask(() => setNicknameStatus('idle'))
      return
    }
    queueMicrotask(() => setNicknameStatus('checking'))
    const timer = setTimeout(() => {
      const isDuplicate = TAKEN_NICKNAMES.some((n) => n === nickname)
      setNicknameStatus(isDuplicate ? 'duplicate' : 'available')
    }, 500)
    return () => clearTimeout(timer)
  }, [nickname])

  const resultTier: TierLevel = melonState === 'done' ? MOCK_MELON_RESULT.tier : 'cloud'

  const handleMelonLink = () => {
    if (!melonId.trim()) return
    setMelonState('linking')
    setTimeout(() => {
      setMelonState('done')
    }, 1500)
  }

  const handleSubmit = () => {
    if (!isNicknameValid) return
    onComplete({
      nickname,
      tier: resultTier,
      melonLinked: melonState === 'done',
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">프로필 설정</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {artist.name} 멤버십 활동에 사용될 정보를 입력해주세요
        </p>
      </div>

      {/* Nickname */}
      <div className="space-y-2">
        <label className="text-sm font-medium block">
          닉네임 <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onBlur={() => setNicknameTouched(true)}
            placeholder="다른 팬들에게 보여질 닉네임을 입력해주세요"
            maxLength={12}
            className={
              showNicknameError || nicknameStatus === 'duplicate'
                ? 'border-destructive focus-visible:ring-destructive/30 pr-9'
                : nicknameStatus === 'available' || nicknameStatus === 'checking'
                  ? 'pr-9'
                  : ''
            }
          />
          {nicknameStatus === 'checking' && (
            <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
          {nicknameStatus === 'available' && (
            <CircleCheck size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
          )}
          {nicknameStatus === 'duplicate' && (
            <CircleAlert size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive" />
          )}
        </div>
        {showNicknameError ? (
          <p className="text-xs text-destructive">{nicknameError}</p>
        ) : nicknameStatus === 'duplicate' ? (
          <p className="text-xs text-destructive">이미 사용 중인 닉네임입니다</p>
        ) : nicknameStatus === 'available' ? (
          <p className="text-xs text-green-600">사용 가능한 닉네임입니다</p>
        ) : nicknameStatus === 'checking' ? (
          <p className="text-xs text-muted-foreground">중복 확인 중...</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            한글, 영문, 숫자를 조합하여 2~12자로 입력해주세요
          </p>
        )}
      </div>

      {/* Melon Integration */}
      <div className="space-y-4">
        <label className="text-sm font-medium block">멜론 연동</label>

        <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4">
          {melonState === 'idle' && (
            <>
              <p className="text-xs text-muted-foreground leading-relaxed">
                멜론 스트리밍 데이터를 연동하면 청취량에 따라 더 높은 등급을 받을 수 있습니다.
                연동하지 않으면 클라우드 등급으로 시작합니다.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium mb-1 block text-muted-foreground">멜론 ID</label>
                  <div className="flex gap-2">
                    <Input
                      value={melonId}
                      onChange={(e) => setMelonId(e.target.value)}
                      placeholder="멜론 아이디 입력"
                      className="flex-1"
                    />
                    <Button
                      onClick={handleMelonLink}
                      disabled={!melonId.trim()}
                      className="shrink-0 gap-1.5 h-9"
                    >
                      <Music size={14} />
                      연동하기
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {melonState === 'linking' && (
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader2 size={24} className="animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">멜론 스트리밍 데이터 분석 중...</p>
            </div>
          )}

          {melonState === 'done' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 size={18} />
                <p className="text-sm font-semibold">연동 완료!</p>
              </div>

              <div className="rounded-lg bg-background border border-border p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-3">스트리밍 분석 결과</p>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">총 스트리밍</span>
                  <span className="font-medium">{MOCK_MELON_RESULT.totalStreams.toLocaleString()}회</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">아티스트 청취 비율</span>
                  <span className="font-medium">{MOCK_MELON_RESULT.artistRatio}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">팬 점수</span>
                  <span className="font-medium">{MOCK_MELON_RESULT.fanScore} / 100</span>
                </div>
                <div className="border-t border-border pt-2 mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">부여 등급</span>
                  <div className="flex items-center gap-1.5">
                    <TierBadge tier="cloud" size="sm" />
                    <span className="text-xs text-muted-foreground">→</span>
                    <TierBadge tier={MOCK_MELON_RESULT.tier} size="sm" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current tier summary */}
      <div className="rounded-lg bg-muted/30 border border-border px-4 py-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">멤버십 등급</span>
        <TierBadge tier={resultTier} size="sm" />
      </div>

      {/* Submit */}
      <Button
        size="lg"
        className="w-full"
        disabled={!isNicknameValid}
        onClick={handleSubmit}
      >
        가입 완료하기
      </Button>
    </div>
  )
}
