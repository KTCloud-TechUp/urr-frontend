const krFormatter = new Intl.NumberFormat('ko-KR')

export function formatPrice(amount: number): string {
  return `${krFormatter.format(amount)}원`
}

/* ------------------------------------------------------------------ */
/*  Date formatting                                                    */
/* ------------------------------------------------------------------ */

/** "2026년 6월 1일 (일)" — year + month + day + weekday */
export function formatDateFull(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

/** "6월 1일 (일)" — month + day + weekday */
export function formatDateShort(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

/** "2026년 6월 1일" — year + month + day (no weekday) */
export function formatDateCompact(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** "2026년 6월 1일 14:30" — year + month + day + time */
export function formatDateWithTime(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** "2026.06.01 (일) 18:00" — dot-separated with weekday and time */
export function formatDateDot(isoDate: string): string {
  const d = new Date(isoDate)
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const w = weekdays[d.getDay()]
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}.${m}.${day} (${w}) ${h}:${min}`
}

/* ------------------------------------------------------------------ */
/*  Number formatting                                                  */
/* ------------------------------------------------------------------ */

/** 1234 → "1,234" / 12400 → "1.2만" / 1500000 → "150만" */
export function formatCompactNumber(n: number): string {
  if (n >= 10_000) {
    const man = n / 10_000
    return man % 1 === 0 ? `${man.toFixed(0)}만` : `${+man.toFixed(1)}만`
  }
  if (n >= 1_000) return `${+(n / 1_000).toFixed(1)}K`
  return n.toLocaleString('ko-KR')
}

/** 30000 → "30,000" */
export function formatNumberWithComma(n: number): string {
  return n.toLocaleString('ko-KR')
}

/* ------------------------------------------------------------------ */
/*  Phone formatting                                                   */
/* ------------------------------------------------------------------ */

/** "01012345678" → "010-1234-5678" */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`
}

/** "방금 전" / "3분 전" / "2시간 전" / "3일 전" */
export function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return '방금 전'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}일 전`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}주 전`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}달 전`
  return `${Math.floor(months / 12)}년 전`
}

export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function parseSeatDisplay(seatId: string, sectionName: string): string {
  const parts = seatId.split('-')
  const row = parts[parts.length - 2]
  const number = parts[parts.length - 1]
  return `${sectionName} ${row}열 ${number}번`
}

export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}
