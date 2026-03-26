import type { Artist } from '@/types'
import avatarGDragon from '@/assets/profile_gdragon_artist-home.png'
import avatarBTS from '@/assets/artist_bts.png'
import avatarAespa from '@/assets/artist_aespa.png'
import avatarIVE from '@/assets/artist_ive.png'
import avatarBlackpink from '@/assets/artist_blackpink.png'
import bannerGDragon from '@/assets/hero_g-dragon.png'
import bannerBTS from '@/assets/hero-banner.png'
import bannerAespa from '@/assets/hero_aespa.png'
import bannerBlackpink from '@/assets/hero_blackpink.png'
import bannerIVE from '@/assets/event_ive-show-what-i-am.png'

export const mockArtists: Artist[] = [
  {
    id: 'gdragon',
    name: 'G-Dragon',
    avatar: avatarGDragon,
    banner: bannerGDragon,
    bio: 'BIGBANG 리더이자 솔로 아티스트. K-POP의 아이콘.',
    followerCount: 2450000,
    category: 'solo',
  },
  {
    id: 'bts',
    name: 'BTS',
    avatar: avatarBTS,
    banner: bannerBTS,
    bio: '글로벌 K-POP 보이그룹. 전 세계를 사로잡은 음악과 메시지.',
    followerCount: 8900000,
    category: 'boygroup',
  },
  {
    id: 'aespa',
    name: 'aespa',
    avatar: avatarAespa,
    banner: bannerAespa,
    bio: 'SM Entertainment 4인조 걸그룹. 메타버스 세계관의 선두주자.',
    followerCount: 3200000,
    category: 'girlgroup',
  },
  {
    id: 'ive',
    name: 'IVE',
    avatar: avatarIVE,
    banner: bannerIVE,
    bio: 'Starship Entertainment 6인조 걸그룹. "나"를 당당하게 표현하는 음악.',
    followerCount: 2100000,
    category: 'girlgroup',
  },
  {
    id: 'blackpink',
    name: 'BLACKPINK',
    avatar: avatarBlackpink,
    banner: bannerBlackpink,
    bio: 'YG Entertainment 글로벌 걸그룹. 음악, 패션, 퍼포먼스의 완성형.',
    followerCount: 7500000,
    category: 'girlgroup',
  },
]

export function getArtistById(id: string): Artist | undefined {
  return mockArtists.find(a => a.id === id)
}
