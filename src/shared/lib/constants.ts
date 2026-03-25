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
  // Individual zones
  VIP1: '#6171D2', VIP2: '#6171D2', VIP3: '#6171D2',
  S1: '#FF8C8B', S2: '#FF8C8B', S3: '#FF8C8B', S4: '#FF8C8B',
  S5: '#FF8C8B', S6: '#FF8C8B', S7: '#FF8C8B', S8: '#FF8C8B',
  R1: '#7754C7', R2: '#7754C7', R3: '#7754C7', R4: '#7754C7',
  R5: '#7754C7', R6: '#7754C7', R7: '#7754C7',
  A1:  '#8A9348', A2:  '#8A9348', A3:  '#8A9348', A4:  '#8A9348',
  A5:  '#8A9348', A6:  '#8A9348', A7:  '#8A9348', A8:  '#8A9348',
  A9:  '#8A9348', A10: '#8A9348', A11: '#8A9348', A12: '#8A9348',
  A13: '#8A9348', A14: '#8A9348', A15: '#8A9348', A16: '#8A9348',
  A17: '#8A9348', A18: '#8A9348', A19: '#8A9348', A20: '#8A9348',
}
