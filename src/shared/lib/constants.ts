/* ------------------------------------------------------------------ */
/*  Payment                                                            */
/* ------------------------------------------------------------------ */

export type PaymentMethod = 'card' | 'toss' | 'kakao' | 'naver' | 'phone'

export const PAYMENT_METHODS: { id: PaymentMethod; label: string; color?: string }[] = [
  { id: 'card', label: '신용/체크카드' },
  { id: 'toss', label: 'toss pay', color: '#0064FF' },
  { id: 'kakao', label: '카카오pay', color: '#FEE500' },
  { id: 'naver', label: 'N pay', color: '#03C75A' },
  { id: 'phone', label: '휴대폰' },
]

/* ------------------------------------------------------------------ */
/*  Timing                                                             */
/* ------------------------------------------------------------------ */

export const SKELETON_LOAD_DELAY = 1200

/* ------------------------------------------------------------------ */
/*  Venue section colors                                               */
/* ------------------------------------------------------------------ */

export const SECTION_COLORS: Record<string, string> = {
  'sec-vip': '#6171D2',
  'sec-floor-r': '#7754C7',
  'sec-r': '#7754C7',
  'sec-s': '#FF8C8B',
  'sec-a': '#8A9348',
  'sec-b': '#EF4444',
  'sec-c': '#EF4444',
}
