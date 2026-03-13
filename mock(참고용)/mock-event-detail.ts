import type { BookingStatus, EventDate, Section } from '@/types'
import type { EventCategory } from './mock-events-page'
import { mockEvent, sectionsByDate, getSectionsForDate } from './mock-events'
import { allEventsData } from './mock-events-page'

// --- Types ---

export interface EventDetailOrganizer {
  host: string
  manager: string
  contact: string
  email: string
}

export interface EventDetailSeller {
  name: string
  bizNumber: string
  ceo: string
  address: string
}

export interface CancellationRule {
  period: string
  fee: string
}

export interface EventDetail {
  id: string
  artistId: string
  artistName: string
  title: string
  subtitle: string
  venue: string
  venueAddress: string
  dates: EventDate[]
  poster: string
  status: BookingStatus
  category: EventCategory
  tags: string[]

  // 공연정보
  runtime: string
  ageRating: string
  notices: string[]
  membershipPreSaleNotice: string[]
  identityVerification: string[]
  castInfo: string
  performanceDescription: string

  // 판매정보
  organizer: EventDetailOrganizer
  sections: Section[]
  bookingFee: string
  shippingFee: string
  validityPeriod: string
  cancellationPolicy: CancellationRule[]
  ticketDelivery: string[]
  mobileTicketInfo: string[]
  precautions: string[]
  sellerInfo: EventDetailSeller
  escrowInfo: string
}

// --- G-Dragon Event Detail (full data) ---

const gdragonDetail: EventDetail = {
  id: 'evt-gdragon-2026',
  artistId: 'gdragon',
  artistName: 'G-Dragon',
  title: 'G-Dragon 2026 MAMA DOME TOUR',
  subtitle: 'FAM+ILY : FAMILY : FAM I LOVE YOU',
  venue: 'KSPO DOME (올림픽체조경기장)',
  venueAddress: '서울특별시 송파구 올림픽로 424 올림픽공원 내',
  dates: mockEvent.dates,
  poster: mockEvent.poster,
  status: 'open',
  category: 'concert',
  tags: ['단독판매', 'URR 선예매'],

  // 공연정보
  runtime: '약 120분',
  ageRating: '전체관람가',
  notices: [
    'NOL 티켓 멤버십 사전 인증 및 예매 마감 : 2026.05.28 (수) 16:59 (KST)',
    '일반 예매 오픈으로 인해, 멤버십 사전 인증 및 예매는 2026년 5월 28일 (수) 오후 4시 59분에 마감되며 상품 판매가 일시 중지됩니다. 휠체어석 전화 예매도 동일한 시간에 마감 및 일시 중지되니, 자세한 일정은 하기 오픈 안내문 참고 부탁드립니다.',
    '멤버십 예매를 희망하시는 분들은 반드시 해당 마감일 전까지 멤버십 사전 인증 및 예매를 완료해 주시기 바랍니다.',
  ],
  membershipPreSaleNotice: [
    '일반 예매 오픈 : 2026.05.28 (수) 19:00 (KST) ~',
    '휠체어석 전화 예매 오픈 : 2026.05.29 (목) 09:00 (KST) ~',
    '매수 제한 : 회차별 1인 1매 (멤버십 예매 매수 포함)',
    '이번 일반 예매는 멤버십 예매에 참여하지 못한 팬 여러분을 위해 추가로 마련된 예매로, 멤버십 예매 종료 후 잔여 좌석에 한해 한정적으로 진행됩니다.',
    '일반 예매 또한 회차별 1인 1매로 진행되며, 멤버십 예매를 이미 완료하신 경우 동일 회차에 대한 일반 예매는 불가합니다.',
    '본 공연은 예매 대기 서비스와 동일 좌석 재예매 서비스 이용이 제한됩니다.',
  ],
  identityVerification: [
    '본 공연은 모바일 티켓으로 운영됩니다. (모바일 티켓 이용 방법)',
    '본 공연은 부정 거래 및 부정 양도를 방지하기 위해 현장에서 예매자 본인 확인을 진행합니다. 본인 확인 후 입장 팔찌를 수령하실 수 있습니다.',
    '예매자의 모바일 티켓 QR코드와 예매 내역, 본인 유효 신분증을 반드시 지참하시고 본인 인증 부스를 방문하여 입장 팔찌를 수령해 주시기 바랍니다.',
    '모바일 티켓과 유효 신분증은 캡처 및 사본 사용이 불가합니다.',
    '예매자 본인이 직접 본인 인증 부스에 방문해야 입장 팔찌 수령이 가능합니다.',
    '본 공연은 대리 수령이 불가합니다. 반드시 본인 명의로 된 아이디로 예매 부탁드립니다.',
    '공연장 입장 시, 모바일 티켓과 입장 팔찌 모두 확인 예정으로, 예매자 본인 외 타인에게 양도를 엄격히 금지합니다.',
  ],
  castInfo: 'G-Dragon (권지용)',
  performanceDescription:
    '2026 G-DRAGON FAM MEETING\nFAM+ILY : FAMILY : FAM I LOVE YOU\n\nG-Dragon이 팬들과 함께하는 특별한 팬미팅으로, KSPO DOME에서 3일간 진행됩니다. 최신 앨범 수록곡 무대와 팬과의 소통 코너, 미공개 비하인드 영상 상영 등 다채로운 프로그램이 준비되어 있습니다.',

  // 판매정보
  organizer: {
    host: '주식회사 갤럭시코퍼레이션',
    manager: 'ER콘텐츠미디어그룹',
    contact: '1544-1555',
    email: 'gd.fam.meetup@gmail.com',
  },
  sections: sectionsByDate['date-0601'] ?? getSectionsForDate('date-0601'),
  bookingFee: '장당 2,000원',
  shippingFee: '현장수령 무료 (배송불가)',
  validityPeriod: '2026.06.01~2026.06.03 예매한 공연 날짜, 회차에 한해 이용 가능',
  cancellationPolicy: [
    { period: '예매 후 7일 이내', fee: '없음' },
    { period: '예매 후 8일~관람일 10일전까지', fee: '장당 4,000원 (티켓금액의 10% 한도)' },
    { period: '관람일 9일전~7일전까지', fee: '티켓금액의 10%' },
    { period: '관람일 6일전~3일전까지', fee: '티켓금액의 20%' },
    { period: '관람일 2일전~1일전까지', fee: '티켓금액의 30%' },
  ],
  ticketDelivery: [
    '본 공연은 모바일 티켓으로 운영됩니다.',
    '결제 완료(입금 완료) 후, 예매내역에서 확인할 수 있습니다.',
    '모바일 티켓으로 예매 시, 지류티켓으로 변경할 수 없습니다.',
    '스포츠 시즌권, URR 외 예매처 구매, 비회원으로 받은 모바일티켓은 \'비회원 모바일티켓 조회\' 메뉴에서 확인할 수 있습니다.',
    '안드로이드 버전 7.0이상, iOS 버전 14.0 이상만 이용 가능합니다.',
    '공연장에서 본인 확인이 어려울 수 있으니, 본인 확인이 가능한 신분증(여권, 주민등록증)을 지참해 주시기 바랍니다.',
  ],
  mobileTicketInfo: [
    '모바일티켓은 모바일 디바이스에서만 이용 가능합니다.',
    '결제 완료(입금 완료) 후, 예매내역에서 확인할 수 있습니다.',
    '모바일티켓으로 예매 시, 지류티켓으로 변경할 수 없습니다.',
    '안드로이드 버전 7.0이상, iOS 버전 14.0 이상만 이용 가능합니다.',
    '공연장에서 본인 확인이 어려울 수 있으니, 본인 확인이 가능한 신분증(여권, 주민등록증)을 지참해 주시기 바랍니다.',
    '모바일티켓 관련 자세한 내용은 모바일티켓 FAQ를 확인해주세요.',
  ],
  precautions: [
    '다른 이용자의 원활한 예매 및 취소에 지장을 초래할 정도로 반복적인 행위를 지속하는 경우 회원의 서비스 이용을 제한할 수 있습니다.',
    '일부 상품의 판매 오픈 시 원활한 서비스 제공을 위하여 URR 포인트, 문화예매권 등의 특정 결제수단 이용이 제한될 수 있습니다.',
    '많은 고객이 이용할 수 있도록 결제 가능 시간을 약 7분으로 제한합니다. 결제 가능 시간 동안만 선택한 좌석을 선점한 것으로, 제한 시간 내에 결제를 마치지 못하면 선택 좌석에 대한 예매가 종료됩니다.',
    '결제 가능 시간은 고객의 편의를 위해 노출되는 것으로, 사용 환경 등에 따라 실제 시간과 오차가 발생할 수 있으며, 천재지변이나 과도한 트래픽 등 예기치 못한 상황에 의하여 일시적으로 오류가 발생할 수 있습니다.',
    '예매 후 7일까지 취소 시에는 취소수수료가 없습니다.',
    '취소 시 예매수수료는 예매 당일 밤 12시 이전까지는 환불되며, 그 이후 기간에는 환불되지 않습니다.',
    '웹 취소가능시간 이후에는 취소가 불가합니다.',
  ],
  sellerInfo: {
    name: '주식회사 이알콘텐츠미디어그룹',
    bizNumber: '838-88-00965',
    ceo: '이홍석',
    address: '서울특별시 서초구 사평대로 98(반포동) 4층, ER콘텐츠미디어그룹',
  },
  escrowInfo:
    'URR 안전결제시스템 (Escrow System) 안내\nURR의 모든 상품은 판매자 및 결제 수단의 구분 없이 회원님들의 구매안전을 위해 안전결제시스템을 도입하여 서비스하고 있습니다.',
}

// --- Detail data map ---

const eventDetailMap: Record<string, EventDetail> = {
  'evt-gdragon-2026': gdragonDetail,
}

// --- Fallback generator for events without explicit detail ---

function createFallbackDetail(eventId: string): EventDetail | undefined {
  const listItem = allEventsData.find((e) => e.id === eventId)
  if (!listItem) return undefined

  // Parse dateRange "2026.04.04 - 2026.04.05" into EventDate[]
  const dateParts = listItem.dateRange.split(' - ')
  const dates: EventDate[] = dateParts.map((d, i) => ({
    id: `date-${eventId}-${i}`,
    date: d.replace(/\./g, '-') + 'T18:00:00+09:00',
    bookingWindows: [
      { tier: 'lightning' as const, opensAt: '2026-02-20T12:00:00+09:00', fee: 0 },
      { tier: 'thunder' as const, opensAt: '2026-02-20T13:00:00+09:00', fee: 3000 },
      { tier: 'cloud' as const, opensAt: '2026-02-22T12:00:00+09:00', fee: 5000 },
      { tier: 'mist' as const, opensAt: '2026-02-22T13:00:00+09:00', fee: 8000 },
    ],
    totalSeats: 15000,
    remainingSeats: 8500 + Math.floor(Math.random() * 3000),
  }))

  const defaultSections: Section[] = [
    { id: 'sec-vip', name: 'VIP', price: 165000, totalSeats: 2000, remainingSeats: 800 },
    { id: 'sec-r', name: 'R석', price: 143000, totalSeats: 3500, remainingSeats: 1500 },
    { id: 'sec-s', name: 'S석', price: 121000, totalSeats: 4500, remainingSeats: 2300 },
    { id: 'sec-a', name: 'A석', price: 99000, totalSeats: 3000, remainingSeats: 1100 },
  ]

  return {
    id: listItem.id,
    artistId: listItem.artistId,
    artistName: listItem.artistName,
    title: listItem.title,
    subtitle: `2026 ${listItem.artistName} CONCERT`,
    venue: listItem.venue,
    venueAddress: '서울특별시 송파구 올림픽로 424',
    dates,
    poster: listItem.poster,
    status: listItem.status,
    category: listItem.category,
    tags: listItem.tags ?? [],
    runtime: '약 120분',
    ageRating: '전체관람가',
    notices: [
      '멤버십 사전 인증 및 예매 마감일을 반드시 확인해 주시기 바랍니다.',
      '일반 예매는 멤버십 예매 종료 후 잔여 좌석에 한해 한정적으로 진행됩니다.',
      '본 공연은 예매 대기 서비스와 동일 좌석 재예매 서비스 이용이 제한됩니다.',
    ],
    membershipPreSaleNotice: [
      '매수 제한 : 회차별 1인 1매 (멤버십 예매 매수 포함)',
      '멤버십 예매를 이미 완료하신 경우 동일 회차에 대한 일반 예매는 불가합니다.',
    ],
    identityVerification: [
      '본 공연은 모바일 티켓으로 운영됩니다.',
      '본인 확인 후 입장 팔찌를 수령하실 수 있습니다.',
      '예매자 본인 외 타인에게 양도를 엄격히 금지합니다.',
    ],
    castInfo: listItem.artistName,
    performanceDescription: `${listItem.artistName}의 ${listItem.title}이 ${listItem.venue}에서 진행됩니다.`,
    organizer: {
      host: '주식회사 갤럭시코퍼레이션',
      manager: 'ER콘텐츠미디어그룹',
      contact: '1544-1555',
      email: 'contact@urr-ticketing.com',
    },
    sections: defaultSections,
    bookingFee: '장당 2,000원',
    shippingFee: '현장수령 무료 (배송불가)',
    validityPeriod: `${listItem.dateRange} 예매한 공연 날짜, 회차에 한해 이용 가능`,
    cancellationPolicy: [
      { period: '예매 후 7일 이내', fee: '없음' },
      { period: '예매 후 8일~관람일 10일전까지', fee: '장당 4,000원 (티켓금액의 10% 한도)' },
      { period: '관람일 9일전~7일전까지', fee: '티켓금액의 10%' },
      { period: '관람일 6일전~3일전까지', fee: '티켓금액의 20%' },
      { period: '관람일 2일전~1일전까지', fee: '티켓금액의 30%' },
    ],
    ticketDelivery: [
      '본 공연은 모바일 티켓으로 운영됩니다.',
      '결제 완료 후, 예매내역에서 확인할 수 있습니다.',
      '모바일 티켓으로 예매 시, 지류티켓으로 변경할 수 없습니다.',
    ],
    mobileTicketInfo: [
      '모바일티켓은 모바일 디바이스에서만 이용 가능합니다.',
      '안드로이드 버전 7.0이상, iOS 버전 14.0 이상만 이용 가능합니다.',
    ],
    precautions: [
      '반복적인 예매 및 취소 행위 시 서비스 이용이 제한될 수 있습니다.',
      '결제 가능 시간은 약 7분으로 제한됩니다.',
      '예매 후 7일까지 취소 시에는 취소수수료가 없습니다.',
    ],
    sellerInfo: {
      name: '주식회사 이알콘텐츠미디어그룹',
      bizNumber: '838-88-00965',
      ceo: '이홍석',
      address: '서울특별시 서초구 사평대로 98(반포동) 4층',
    },
    escrowInfo:
      'URR 안전결제시스템 (Escrow System) 안내\nURR의 모든 상품은 안전결제시스템을 도입하여 서비스하고 있습니다.',
  }
}

// --- Lookup ---

export function getEventDetailById(id: string): EventDetail | undefined {
  return eventDetailMap[id] ?? createFallbackDetail(id)
}
