import profileGDragon from '@/assets/profile_gdragon_artist-home.png'
import profileBTS from '@/assets/artist_bts.png'
import profileAespa from '@/assets/profile_aespa.png'
import profileIVE from '@/assets/profile_ive.png'
import profileBP from '@/assets/profile_blackpink.png'
import sotong1_1 from '@/assets/community_gd_1_1.png'
import sotong1_2 from '@/assets/community_gd_1_2.png'
import sotong1_3 from '@/assets/community_gd_1_3.png'
import sotong2_1 from '@/assets/community_gd_2_1.png'
import sotong2_2 from '@/assets/community_gd_2_2.png'
import sotong2_3 from '@/assets/community_gd_2_3.png'
import sotong3_1 from '@/assets/community_gd_3_1.png'
import sotong3_2 from '@/assets/community_gd_3_2.png'
import sotong3_3 from '@/assets/community_gd_3_3.png'
import aespaSotong1_1 from '@/assets/community_aespa_1_1.png'
import aespaSotong1_2 from '@/assets/community_aespa_1_2.png'
import aespaSotong2_1 from '@/assets/community_aespa_2_1.png'
import aespaSotong3_1 from '@/assets/community_aespa_3_1.png'
import aespaSotong3_2 from '@/assets/community_aespa_3_2.png'
import aespaSotong3_3 from '@/assets/community_aespa_3_3.png'
import type { CommunityPost } from '@/types'

const artistCommunityMap: Record<string, CommunityPost[]> = {
  gdragon: [
    {
      id: 'cp-gd-01',
      artistId: 'gdragon',
      authorName: 'G-Dragon 공식',
      authorAvatar: profileGDragon,
      isOfficial: true,

      content: '2026 MAMA DOME TOUR 서울 공연이 6월 1일, 2일 양일간 KSPO DOME에서 진행됩니다. 많은 관심과 사랑 부탁드립니다. 예매 관련 자세한 사항은 공연 탭에서 확인해 주세요.',
      images: [],
      likeCount: 12400,
      commentCount: 3200,
      createdAt: '2026-02-25T14:00:00+09:00',
    },
    {
      id: 'cp-gd-02',
      artistId: 'gdragon',
      authorName: 'G-Dragon',
      authorAvatar: profileGDragon,
      isOfficial: true,

      content: '연습실에서 보내는 하루. 새 앨범 작업도 순조롭게 진행 중입니다. 조금만 더 기다려 주세요 🎵',
      images: [sotong1_1, sotong1_2, sotong1_3],
      likeCount: 8900,
      commentCount: 1540,
      createdAt: '2026-02-28T20:30:00+09:00',
    },
    {
      id: 'cp-gd-03',
      artistId: 'gdragon',
      authorName: 'G-Dragon',
      authorAvatar: profileGDragon,
      isOfficial: true,

      content: '오늘 하루도 고생 많았어요. VIP 여러분 항상 감사합니다 💛',
      images: [],
      likeCount: 6200,
      commentCount: 980,
      createdAt: '2026-03-01T23:15:00+09:00',
    },
    {
      id: 'cp-gd-04',
      artistId: 'gdragon',
      authorName: 'G-Dragon 공식',
      authorAvatar: profileGDragon,
      isOfficial: true,

      content: 'DETOX WORLD TOUR 티저 영상이 공개되었습니다! 고척스카이돔에서 만나요. 티저 보셨나요?',
      images: [sotong2_1, sotong2_2, sotong2_3],
      likeCount: 15600,
      commentCount: 4100,
      createdAt: '2026-02-20T12:00:00+09:00',
    },
    {
      id: 'cp-gd-05',
      artistId: 'gdragon',
      authorName: 'G-Dragon',
      authorAvatar: profileGDragon,
      isOfficial: true,

      content: '작업실에서 새벽까지... 새 음악이 곧 나옵니다. 기대해 주세요.',
      images: [sotong3_1, sotong3_2, sotong3_3],
      likeCount: 4300,
      commentCount: 720,
      createdAt: '2026-02-15T03:20:00+09:00',
    },
  ],
  bts: [
    {
      id: 'cp-bts-01',
      artistId: 'bts',
      authorName: 'BTS 공식',
      authorAvatar: profileBTS,
      isOfficial: true,

      content: 'YET TO COME ENCORE IN SEOUL 공연이 8월 1일, 2일 잠실종합운동장에서 개최됩니다! ARMY 여러분의 많은 성원 부탁드립니다. 예매 일정은 공연 탭에서 확인해 주세요.',
      images: [],
      likeCount: 34200,
      commentCount: 8900,
      createdAt: '2026-02-20T10:00:00+09:00',
    },
    {
      id: 'cp-bts-02',
      artistId: 'bts',
      authorName: 'RM',
      authorAvatar: profileBTS,
      isOfficial: true,

      content: '요즘 읽고 있는 책이 있는데, 다 읽으면 ARMY들한테 추천해 드릴게요. 날씨가 많이 추워졌는데 모두 따뜻하게 지내세요.',
      images: [],
      likeCount: 18500,
      commentCount: 5200,
      createdAt: '2026-02-27T21:00:00+09:00',
    },
    {
      id: 'cp-bts-03',
      artistId: 'bts',
      authorName: 'V',
      authorAvatar: profileBTS,
      isOfficial: true,

      content: '오늘 멤버들이랑 같이 밥 먹었어요 🍕 오랜만에 다 같이 모여서 너무 좋았습니다!',
      images: [],
      likeCount: 22100,
      commentCount: 6300,
      createdAt: '2026-03-02T19:45:00+09:00',
    },
    {
      id: 'cp-bts-04',
      artistId: 'bts',
      authorName: 'BTS 공식',
      authorAvatar: profileBTS,
      isOfficial: true,

      content: '2026 FAN MEETING: MAGIC SHOP 사전 등록이 곧 시작됩니다. ARMY들의 많은 참여 부탁드립니다!',
      images: [],
      likeCount: 28700,
      commentCount: 7100,
      createdAt: '2026-02-18T14:30:00+09:00',
    },
  ],
  aespa: [
    {
      id: 'cp-ae-01',
      artistId: 'aespa',
      authorName: 'aespa 공식',
      authorAvatar: profileAespa,
      isOfficial: true,

      content: 'LIVE SYNK : PARALLEL 콘서트가 9월 20일 KSPO DOME에서 개최됩니다! MY들 기대 많이 해주세요. 예매 정보는 공연 탭에서 확인하세요.',
      images: [],
      likeCount: 9800,
      commentCount: 2400,
      createdAt: '2026-02-22T11:00:00+09:00',
    },
    {
      id: 'cp-ae-02',
      artistId: 'aespa',
      authorName: 'KARINA',
      authorAvatar: profileAespa,
      isOfficial: true,

      content: '오늘 촬영 끝! MY들 오늘 하루 어땠어요? 저는 새로운 도전을 해봤는데 결과물이 기대됩니다 ✨',
      images: [aespaSotong1_1, aespaSotong1_2],
      likeCount: 7600,
      commentCount: 1800,
      createdAt: '2026-03-01T18:20:00+09:00',
    },
    {
      id: 'cp-ae-03',
      artistId: 'aespa',
      authorName: 'WINTER',
      authorAvatar: profileAespa,
      isOfficial: true,

      content: '연습 끝나고 아이스크림 먹는 중 🍦 MY들도 맛있는 거 많이 드세요!',
      images: [aespaSotong2_1],
      likeCount: 6100,
      commentCount: 1200,
      createdAt: '2026-02-26T22:10:00+09:00',
    },
    {
      id: 'cp-ae-04',
      artistId: 'aespa',
      authorName: 'aespa 공식',
      authorAvatar: profileAespa,
      isOfficial: true,

      content: 'WORLD TOUR: MYWORLD 일정이 공개되었습니다. 서울을 시작으로 전 세계 MY들을 만나러 갑니다!',
      images: [aespaSotong3_1, aespaSotong3_2, aespaSotong3_3],
      likeCount: 11200,
      commentCount: 3500,
      createdAt: '2026-02-14T10:00:00+09:00',
    },
  ],
  ive: [
    {
      id: 'cp-ive-01',
      artistId: 'ive',
      authorName: 'IVE 공식',
      authorAvatar: profileIVE,
      isOfficial: true,

      content: 'THE 1ST WORLD TOUR: SHOW WHAT I HAVE 서울 공연이 7월 12일 KSPO DOME에서 개최됩니다! DIVE 여러분의 많은 사랑 부탁드립니다.',
      images: [],
      likeCount: 8200,
      commentCount: 2100,
      createdAt: '2026-02-24T09:00:00+09:00',
    },
    {
      id: 'cp-ive-02',
      artistId: 'ive',
      authorName: '안유진',
      authorAvatar: profileIVE,
      isOfficial: true,

      content: '오늘 팬미팅 리허설했어요! DIVE들 만날 생각에 벌써부터 설레요 💕 조금만 기다려 주세요~',
      images: [],
      likeCount: 5400,
      commentCount: 1300,
      createdAt: '2026-02-28T16:40:00+09:00',
    },
    {
      id: 'cp-ive-03',
      artistId: 'ive',
      authorName: '장원영',
      authorAvatar: profileIVE,
      isOfficial: true,

      content: '오늘 날씨 너무 좋아서 멤버들이랑 산책했어요 🌸 DIVE들도 좋은 하루 보내세요!',
      images: [],
      likeCount: 6800,
      commentCount: 1600,
      createdAt: '2026-03-02T14:00:00+09:00',
    },
    {
      id: 'cp-ive-04',
      artistId: 'ive',
      authorName: 'IVE 공식',
      authorAvatar: profileIVE,
      isOfficial: true,

      content: '2nd FAN MEETING: I HAEVE 예매가 시작되었습니다! 잠실실내체육관에서 DIVE들을 기다리고 있을게요.',
      images: [],
      likeCount: 7500,
      commentCount: 1900,
      createdAt: '2026-02-16T12:00:00+09:00',
    },
  ],
  blackpink: [
    {
      id: 'cp-bp-01',
      artistId: 'blackpink',
      authorName: 'BLACKPINK 공식',
      authorAvatar: profileBP,
      isOfficial: true,

      content: 'BORN PINK WORLD TOUR FINALE이 7월 15일, 16일 고척스카이돔에서 개최됩니다! BLINK 여러분과 함께하는 특별한 피날레가 될 거예요.',
      images: [],
      likeCount: 28900,
      commentCount: 7200,
      createdAt: '2026-02-23T10:00:00+09:00',
    },
    {
      id: 'cp-bp-02',
      artistId: 'blackpink',
      authorName: 'JENNIE',
      authorAvatar: profileBP,
      isOfficial: true,

      content: '요즘 새 프로젝트 준비 중이에요! 조금만 기다려 주세요 BLINK 💖 곧 좋은 소식 들려드릴게요.',
      images: [],
      likeCount: 19400,
      commentCount: 4800,
      createdAt: '2026-03-01T20:00:00+09:00',
    },
    {
      id: 'cp-bp-03',
      artistId: 'blackpink',
      authorName: 'ROSÉ',
      authorAvatar: profileBP,
      isOfficial: true,

      content: '오늘 스튜디오에서 녹음했어요 🎤 새 음악 작업이 정말 즐거워요. BLINK들이 좋아할 거예요!',
      images: [],
      likeCount: 16200,
      commentCount: 3900,
      createdAt: '2026-02-27T23:30:00+09:00',
    },
    {
      id: 'cp-bp-04',
      artistId: 'blackpink',
      authorName: 'LISA',
      authorAvatar: profileBP,
      isOfficial: true,

      content: '연습 끝! 투어 준비가 착착 진행되고 있어요. BLINK들 만나는 날이 얼마 안 남았네요 😍',
      images: [],
      likeCount: 21300,
      commentCount: 5600,
      createdAt: '2026-02-19T15:00:00+09:00',
    },
    {
      id: 'cp-bp-05',
      artistId: 'blackpink',
      authorName: 'BLACKPINK 공식',
      authorAvatar: profileBP,
      isOfficial: true,

      content: 'IN YOUR AREA 2026 일정이 곧 공개됩니다. BLINK 여러분의 많은 기대 부탁드립니다!',
      images: [],
      likeCount: 14700,
      commentCount: 3400,
      createdAt: '2026-02-12T11:00:00+09:00',
    },
  ],
}

export function getCommunityPostsByArtistId(artistId: string): CommunityPost[] {
  return artistCommunityMap[artistId] ?? []
}
