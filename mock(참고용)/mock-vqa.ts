import type { VQAQuestion } from '@/types'

export const gdragonQuestions: VQAQuestion[] = [
  {
    id: 'vqa-001',
    question: 'G-Dragon의 본명은 무엇인가요?',
    options: ['권지용', '동영배', '최승현', '강대성'],
    correctIndex: 0,
  },
  {
    id: 'vqa-002',
    question: 'G-Dragon이 소속된 그룹은?',
    options: ['EXO', 'WINNER', 'BIGBANG', 'iKON'],
    correctIndex: 2,
  },
  {
    id: 'vqa-003',
    question: 'G-Dragon의 첫 솔로 앨범 타이틀곡은?',
    options: ['Crooked', 'Heartbreaker', 'Who You?', 'That XX'],
    correctIndex: 1,
  },
  {
    id: 'vqa-004',
    question: 'BIGBANG의 공식 팬덤 이름은?',
    options: ['BLINK', 'VIP', 'ARMY', 'INNER CIRCLE'],
    correctIndex: 1,
  },
  {
    id: 'vqa-005',
    question: 'G-Dragon이 YG 연습생으로 들어간 나이는?',
    options: ['10세', '8세', '13세', '15세'],
    correctIndex: 1,
  },
  {
    id: 'vqa-006',
    question: '다음 중 G-Dragon의 솔로 앨범이 아닌 것은?',
    options: ['Heartbreaker', 'One of a Kind', 'Kwon Ji Yong', 'MADE'],
    correctIndex: 3,
  },
  {
    id: 'vqa-007',
    question: "다음 가사의 빈칸을 채우세요: '눈, 코, 입 — 널 ____던 나의'",
    options: ['사랑하던', '바라보던', '만지던', '그리워하던'],
    correctIndex: 2,
  },
  {
    id: 'vqa-008',
    question: 'BIGBANG의 데뷔 연도는?',
    options: ['2005년', '2006년', '2007년', '2008년'],
    correctIndex: 1,
  },
  {
    id: 'vqa-009',
    question: 'G-Dragon이 작사·작곡에 참여한 BIGBANG 대표곡은?',
    options: ['거짓말', 'FANTASTIC BABY', 'Haru Haru', '위 모두'],
    correctIndex: 3,
  },
  {
    id: 'vqa-010',
    question: "G-Dragon의 '무제(無題)' 뮤직비디오에서 배경이 되는 계절은?",
    options: ['봄', '여름', '가을', '겨울'],
    correctIndex: 3,
  },
  {
    id: 'vqa-011',
    question: 'G-Dragon의 생년월일은?',
    options: ['1988년 8월 18일', '1987년 5월 4일', '1989년 12월 12일', '1990년 1월 1일'],
    correctIndex: 0,
  },
  {
    id: 'vqa-012',
    question: "다음 중 G-Dragon과 태양의 유닛 이름은?",
    options: ['GD&TOP', 'GDYB', 'GD X TAEYANG', 'SOLAR DRAGON'],
    correctIndex: 2,
  },
  {
    id: 'vqa-013',
    question: 'G-Dragon의 개인 패션 브랜드 이름은?',
    options: ['AMBUSH', 'PEACEMINUSONE', 'OFF-WHITE', 'WE11DONE'],
    correctIndex: 1,
  },
  {
    id: 'vqa-014',
    question: "BIGBANG의 '뱅뱅뱅(BANG BANG BANG)' 발매 연도는?",
    options: ['2013년', '2014년', '2015년', '2016년'],
    correctIndex: 2,
  },
  {
    id: 'vqa-015',
    question: "G-Dragon의 솔로곡 'Crooked'의 한국어 제목은?",
    options: ['삐딱하게', '미치GO', '니가 뭔데', '결국'],
    correctIndex: 0,
  },
  {
    id: 'vqa-016',
    question: 'G-Dragon이 T.O.P과 함께 발표한 유닛 앨범 수록곡은?',
    options: ['HIGH HIGH', 'LOVE SONG', 'BLUE', 'SOBER'],
    correctIndex: 0,
  },
]

/**
 * Returns `count` random questions from the pool, shuffled.
 * Ensures no duplicates within a single selection.
 */
export function pickRandomQuestions(count: number = 3): VQAQuestion[] {
  const shuffled = [...gdragonQuestions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
