-- URR 이벤트 서비스 시드 데이터
-- 기준: src/shared/lib/mocks/ 데이터
-- 환경: MySQL, Hibernate 생성 테이블 전제
-- 실행 순서: artists → venue_templates → membership_policies → events → shows → show_section_policies → artist_follows → artist_memberships

CREATE DATABASE IF NOT EXISTS urr_event;
USE urr_event;

-- ============================================================
-- 1. artists
-- ============================================================

INSERT INTO artists
  (id, name, profile_image_url, description, bio, banner_image_url, category, created_at, updated_at)
VALUES
  (1,  'G-Dragon',   '/artists/1/profile.png',  NULL, 'BIGBANG 리더이자 솔로 아티스트. K-POP의 아이콘.',                           '/artists/1/banner.png',   'SOLO',      NOW(), NOW()),
  (2,  'BTS',        '/artists/2/profile.png',  NULL, '글로벌 K-POP 보이그룹. 전 세계를 사로잡은 음악과 메시지.',                   '/artists/2/banner.png',   'BOYGROUP',  NOW(), NOW()),
  (3,  'aespa',      '/artists/3/profile.png',  NULL, 'SM Entertainment 4인조 걸그룹. 메타버스 세계관의 선두주자.',                 '/artists/3/banner.png',   'GIRLGROUP', NOW(), NOW()),
  (4,  'IVE',        '/artists/4/profile.png',  NULL, 'Starship Entertainment 6인조 걸그룹. "나"를 당당하게 표현하는 음악.',        '/artists/4/banner.jpeg',  'GIRLGROUP', NOW(), NOW()),
  (5,  'BLACKPINK',  '/artists/5/profile.png',  NULL, 'YG Entertainment 글로벌 걸그룹. 음악, 패션, 퍼포먼스의 완성형.',            '/artists/5/banner.png',   'GIRLGROUP', NOW(), NOW()),
  (6,  'Stray Kids', '/artists/6/profile.png',  NULL, 'JYP Entertainment 8인조 보이그룹. 자체 프로듀싱의 대명사.',                '/artists/6/banner.png',   'BOYGROUP',  NOW(), NOW()),
  (7,  'SEVENTEEN',  '/artists/7/profile.png',  NULL, 'PLEDIS Entertainment 13인조 보이그룹. 자체 안무, 자작곡의 아이콘.',         '/artists/7/banner.jpg',   'BOYGROUP',  NOW(), NOW()),
  (8,  'NewJeans',   '/artists/8/profile.png',  NULL, 'ADOR 5인조 걸그룹. 새로운 시대의 K-POP 트렌드세터.',                       '/artists/8/banner.jpeg',  'GIRLGROUP', NOW(), NOW()),
  (9,  '(G)I-DLE',  '/artists/9/profile.png',  NULL, 'CUBE Entertainment 5인조 걸그룹. 전원 자작곡 걸그룹의 선두주자.',           '/artists/9/banner.jpeg',  'GIRLGROUP', NOW(), NOW()),
  (10, 'TXT',        '/artists/10/profile.png', NULL, 'BIGHIT MUSIC 5인조 보이그룹. 독보적 세계관과 음악 실험.',                   '/artists/10/banner.jpeg', 'BOYGROUP',  NOW(), NOW()),
  (11, 'DAY6',       '/artists/11/profile.png', NULL, 'JYP Entertainment 밴드. 직접 작곡하는 셀프 프로듀싱 밴드.',                '/artists/11/banner.png',  'BAND',      NOW(), NOW()),
  (12, 'TWS',        '/artists/12/profile.png', NULL, 'Starship Entertainment 7인조 보이그룹. 진정성 있는 감성으로 주목받는 신인.','/artists/12/banner.jpg',  'BOYGROUP',  NOW(), NOW()),
  (13, '악동뮤지션', '/artists/13/profile.png', NULL, 'YG Entertainment 남매 듀오. 자작곡으로 감성을 전하는 인디-팝 아이콘.',      '/artists/13/banner.png',  'COEDGROUP', NOW(), NOW()),
  (14, '권정렬',     '/artists/14/profile.jpg', NULL, '10CM의 보컬리스트. 감성 팝으로 많은 사람의 마음을 울리는 싱어송라이터.',    '/artists/14/banner.jpeg', 'SOLO',      NOW(), NOW()),
  (15, 'RIIZE',      '/artists/15/profile.png', NULL, 'SM Entertainment 7인조 보이그룹. 데뷔와 동시에 음원차트 올킬.',             '/artists/15/banner.jpeg', 'BOYGROUP',  NOW(), NOW()),
  (16, 'IU',         '/artists/16/profile.jpg', NULL, '카카오엔터테인먼트 솔로 아티스트. 발라드부터 팝까지, 대한민국 대표 국민 가수.','/artists/16/banner.jpeg','SOLO',     NOW(), NOW()),
  (17, 'NMIXX',      '/artists/17/profile.png', NULL, 'JYP Entertainment 6인조 걸그룹. 믹스팝 장르를 개척하는 차세대 걸그룹.',     '/artists/17/banner.png',  'GIRLGROUP', NOW(), NOW()),
  (18, '최예나',     '/artists/18/profile.jpg', NULL, '아이즈원 출신. 특유의 에너지와 독보적인 퍼포먼스로 팬들의 마음을 사로잡는 K-POP 아이콘.','/artists/18/banner.jpg','SOLO',NOW(), NOW());

-- ============================================================
-- 2. venue_templates
-- ============================================================

INSERT INTO venue_templates
  (id, name, seatmap_json, base_capacity, active, created_at, updated_at)
VALUES
  (1, 'KSPO DOME (올림픽 체조 경기장)',
   '{"sections":[{"code":"VIP","name":"VIP 구역"},{"code":"R","name":"R석"},{"code":"S","name":"S석"},{"code":"A","name":"A석"}]}',
   15000, TRUE, NOW(), NOW()),
  (2, '잠실종합운동장 주경기장',
   '{"sections":[{"code":"VIP","name":"VIP 구역"},{"code":"R","name":"R석"},{"code":"S","name":"S석"},{"code":"A","name":"A석"}]}',
   70000, TRUE, NOW(), NOW()),
  (3, '고척스카이돔',
   '{"sections":[{"code":"VIP","name":"VIP 구역"},{"code":"R","name":"R석"},{"code":"S","name":"S석"},{"code":"A","name":"A석"}]}',
   17000, TRUE, NOW(), NOW()),
  (4, '인천 아시아드 주경기장',
   '{"sections":[{"code":"VIP","name":"VIP 구역"},{"code":"R","name":"R석"},{"code":"S","name":"S석"},{"code":"A","name":"A석"}]}',
   20000, TRUE, NOW(), NOW()),
  (5, '올림픽공원 올림픽홀',
   '{"sections":[{"code":"VIP","name":"VIP 구역"},{"code":"R","name":"R석"},{"code":"S","name":"S석"}]}',
   7000, TRUE, NOW(), NOW()),
  (6, '광주 김대중컨벤션센터 A-C홀',
   '{"sections":[{"code":"R","name":"R석"},{"code":"S","name":"S석"},{"code":"A","name":"A석"}]}',
   3000, TRUE, NOW(), NOW()),
  (7, 'Long Beach Convention Center',
   '{"sections":[{"code":"VIP","name":"VIP 구역"},{"code":"R","name":"R석"},{"code":"S","name":"S석"}]}',
   10000, TRUE, NOW(), NOW());

-- ============================================================
-- 3. membership_policies
-- LIGHTNING: offset=0분, 수수료 1,000원
-- THUNDER:   offset=60분, 수수료 2,000원
-- CLOUD:     offset=1440분, 수수료 3,000원
-- MIST:      offset=2880분, 수수료 4,000원
-- ============================================================

INSERT INTO membership_policies
  (artist_id, tier, presale_offset_minutes, booking_fee_won, created_at, updated_at)
VALUES
  (1,'LIGHTNING',0,1000,NOW(),NOW()),(1,'THUNDER',60,2000,NOW(),NOW()),(1,'CLOUD',1440,3000,NOW(),NOW()),(1,'MIST',2880,4000,NOW(),NOW()),
  (2,'LIGHTNING',0,1000,NOW(),NOW()),(2,'THUNDER',60,2000,NOW(),NOW()),(2,'CLOUD',1440,3000,NOW(),NOW()),(2,'MIST',2880,4000,NOW(),NOW()),
  (3,'LIGHTNING',0,1000,NOW(),NOW()),(3,'THUNDER',60,2000,NOW(),NOW()),(3,'CLOUD',1440,3000,NOW(),NOW()),(3,'MIST',2880,4000,NOW(),NOW()),
  (4,'LIGHTNING',0,1000,NOW(),NOW()),(4,'THUNDER',60,2000,NOW(),NOW()),(4,'CLOUD',1440,3000,NOW(),NOW()),(4,'MIST',2880,4000,NOW(),NOW()),
  (5,'LIGHTNING',0,1000,NOW(),NOW()),(5,'THUNDER',60,2000,NOW(),NOW()),(5,'CLOUD',1440,3000,NOW(),NOW()),(5,'MIST',2880,4000,NOW(),NOW()),
  (6,'LIGHTNING',0,1000,NOW(),NOW()),(6,'THUNDER',60,2000,NOW(),NOW()),(6,'CLOUD',1440,3000,NOW(),NOW()),(6,'MIST',2880,4000,NOW(),NOW()),
  (7,'LIGHTNING',0,1000,NOW(),NOW()),(7,'THUNDER',60,2000,NOW(),NOW()),(7,'CLOUD',1440,3000,NOW(),NOW()),(7,'MIST',2880,4000,NOW(),NOW()),
  (8,'LIGHTNING',0,1000,NOW(),NOW()),(8,'THUNDER',60,2000,NOW(),NOW()),(8,'CLOUD',1440,3000,NOW(),NOW()),(8,'MIST',2880,4000,NOW(),NOW()),
  (9,'LIGHTNING',0,1000,NOW(),NOW()),(9,'THUNDER',60,2000,NOW(),NOW()),(9,'CLOUD',1440,3000,NOW(),NOW()),(9,'MIST',2880,4000,NOW(),NOW()),
  (10,'LIGHTNING',0,1000,NOW(),NOW()),(10,'THUNDER',60,2000,NOW(),NOW()),(10,'CLOUD',1440,3000,NOW(),NOW()),(10,'MIST',2880,4000,NOW(),NOW()),
  (11,'LIGHTNING',0,1000,NOW(),NOW()),(11,'THUNDER',60,2000,NOW(),NOW()),(11,'CLOUD',1440,3000,NOW(),NOW()),(11,'MIST',2880,4000,NOW(),NOW()),
  (12,'LIGHTNING',0,1000,NOW(),NOW()),(12,'THUNDER',60,2000,NOW(),NOW()),(12,'CLOUD',1440,3000,NOW(),NOW()),(12,'MIST',2880,4000,NOW(),NOW()),
  (13,'LIGHTNING',0,1000,NOW(),NOW()),(13,'THUNDER',60,2000,NOW(),NOW()),(13,'CLOUD',1440,3000,NOW(),NOW()),(13,'MIST',2880,4000,NOW(),NOW()),
  (14,'LIGHTNING',0,1000,NOW(),NOW()),(14,'THUNDER',60,2000,NOW(),NOW()),(14,'CLOUD',1440,3000,NOW(),NOW()),(14,'MIST',2880,4000,NOW(),NOW()),
  (15,'LIGHTNING',0,1000,NOW(),NOW()),(15,'THUNDER',60,2000,NOW(),NOW()),(15,'CLOUD',1440,3000,NOW(),NOW()),(15,'MIST',2880,4000,NOW(),NOW()),
  (16,'LIGHTNING',0,1000,NOW(),NOW()),(16,'THUNDER',60,2000,NOW(),NOW()),(16,'CLOUD',1440,3000,NOW(),NOW()),(16,'MIST',2880,4000,NOW(),NOW()),
  (17,'LIGHTNING',0,1000,NOW(),NOW()),(17,'THUNDER',60,2000,NOW(),NOW()),(17,'CLOUD',1440,3000,NOW(),NOW()),(17,'MIST',2880,4000,NOW(),NOW()),
  (18,'LIGHTNING',0,1000,NOW(),NOW()),(18,'THUNDER',60,2000,NOW(),NOW()),(18,'CLOUD',1440,3000,NOW(),NOW()),(18,'MIST',2880,4000,NOW(),NOW());

-- ============================================================
-- 4. events
-- venue_template_id: 1=KSPO DOME, 2=잠실주경기장, 3=고척스카이돔
--                    4=인천아시아드, 5=올림픽홀, 6=광주김대중, 7=Long Beach
-- ============================================================

INSERT INTO events
  (id, artist_id, venue_template_id, title, description,
   open_date, end_date, active, poster_image_url, category,
   tags_json, runtime, age_rating, venue_address, subtitle,
   notices_json, identity_verification_json, cast_info,
   cancellation_policy_json, ticket_delivery_json, sections_json, organizer_json,
   created_at, updated_at)
VALUES
  -- 1. G-Dragon (artist_id=1, KSPO DOME)
  (1, 1, 1,
   'G-Dragon 2026 MAMA DOME TOUR', 'BIGBANG 리더 G-Dragon의 2026 돔 투어. 3회차 공연.',
   '2026-06-01', '2026-06-03', TRUE,
   '/artists/1/events/upcoming_gdragon-2026-mama.png', 'CONCERT', '["HOT"]',
   '150분', '만 7세 이상', '서울특별시 송파구 올림픽로 424 올림픽공원 내',
   'FAM+ILY : FAMILY : FAM I LOVE YOU',
   '["본 공연은 우천 시에도 진행됩니다.","공연 시작 후 30분 이후에는 입장이 제한될 수 있습니다."]',
   '["실명 인증 필수","1인 최대 4매"]',
   'G-Dragon',
   '[{"period":"관람일 기준 7일 전","fee":"없음"},{"period":"관람일 기준 3~6일 전","fee":"10%"},{"period":"관람일 기준 1~2일 전","fee":"20%"},{"period":"관람 당일","fee":"취소 불가"}]',
   '["모바일 티켓","현장 수령 불가"]',
   '[{"code":"VIP","name":"VIP 구역","price":165000},{"code":"R","name":"R석","price":143000},{"code":"S","name":"S석","price":121000},{"code":"A","name":"A석","price":99000}]',
   '{"host":"YG Entertainment","manager":"URR 티켓팅","contact":"1588-0000","email":"support@urr.kr"}',
   NOW(), NOW()),

  -- 2. BTS YET TO COME (artist_id=2, 잠실주경기장)
  (2, 2, 2,
   'BTS YET TO COME ENCORE IN SEOUL', 'BTS 서울 앙코르 공연. 3일간 진행.',
   '2026-08-01', '2026-08-03', TRUE,
   '/artists/2/events/event_bts-yet-to-come-in-cinema.png', 'CONCERT', '[]',
   '180분', '만 7세 이상', '서울특별시 송파구 올림픽로 25 잠실종합운동장',
   NULL,
   '["우천 시에도 공연 진행","드론·카메라 반입 금지"]',
   '["실명 인증 필수","1인 최대 4매"]',
   'BTS',
   '[{"period":"관람일 기준 7일 전","fee":"없음"},{"period":"관람일 기준 1~6일 전","fee":"10%"},{"period":"관람 당일","fee":"취소 불가"}]',
   '["모바일 티켓"]',
   '[{"code":"VIP","name":"VIP 구역","price":165000},{"code":"R","name":"R석","price":143000},{"code":"S","name":"S석","price":121000},{"code":"A","name":"A석","price":99000}]',
   '{"host":"BIGHIT MUSIC","manager":"URR 티켓팅","contact":"1588-0000","email":"support@urr.kr"}',
   NOW(), NOW()),

  -- 3. BTS ARIRANG (artist_id=2, 잠실주경기장)
  (3, 2, 2,
   'BTS WORLD TOUR ARIRANG IN GOYANG', 'BTS 월드 투어 고양 공연.',
   '2026-04-09', '2026-04-12', TRUE,
   '/artists/2/events/event_bts-world-tour-arirang.png', 'CONCERT', '[]',
   '180분', '만 7세 이상', '경기도 고양시 일산서구 킨텍스로 217-60',
   NULL,
   '["우천 시에도 공연 진행"]',
   '["실명 인증 필수","1인 최대 4매"]',
   'BTS',
   '[{"period":"관람일 기준 7일 전","fee":"없음"},{"period":"관람 당일","fee":"취소 불가"}]',
   '["모바일 티켓"]',
   '[{"code":"VIP","name":"VIP 구역","price":165000},{"code":"R","name":"R석","price":143000},{"code":"S","name":"S석","price":121000},{"code":"A","name":"A석","price":99000}]',
   '{"host":"BIGHIT MUSIC","manager":"URR 티켓팅","contact":"1588-0000","email":"support@urr.kr"}',
   NOW(), NOW()),

  -- 4. aespa (artist_id=3, KSPO DOME)
  (4, 3, 1,
   'aespa LIVE SYNK : PARALLEL', 'aespa 단독 콘서트.',
   '2026-09-20', '2026-09-21', TRUE,
   '/artists/3/events/event_aespa-live-synk-parallel2.jpg', 'CONCERT', '["HOT"]',
   '150분', '만 7세 이상', '서울특별시 송파구 올림픽로 424 올림픽공원 내',
   NULL,
   '["공연 시작 후 30분 이후 입장 제한"]',
   '["실명 인증 필수","1인 최대 4매"]',
   'aespa',
   '[{"period":"관람일 기준 7일 전","fee":"없음"},{"period":"관람 당일","fee":"취소 불가"}]',
   '["모바일 티켓"]',
   '[{"code":"VIP","name":"VIP 구역","price":154000},{"code":"R","name":"R석","price":132000},{"code":"S","name":"S석","price":110000},{"code":"A","name":"A석","price":88000}]',
   '{"host":"SM Entertainment","manager":"URR 티켓팅","contact":"1588-0000","email":"support@urr.kr"}',
   NOW(), NOW()),

  -- 5. IVE SHOW WHAT I AM (artist_id=4, KSPO DOME)
  (5, 4, 1,
   'IVE WORLD TOUR SHOW WHAT I AM', 'IVE 월드 투어 서울 공연.',
   '2026-06-20', '2026-06-22', TRUE,
   '/artists/4/events/event_ive-show-what-i-am.png', 'CONCERT', '[]',
   '150분', '만 7세 이상', '서울특별시 송파구 올림픽로 424 올림픽공원 내',
   NULL,
   '["공연 시작 후 입장 제한 있음"]',
   '["실명 인증 필수","1인 최대 4매"]',
   'IVE',
   '[{"period":"관람일 기준 7일 전","fee":"없음"},{"period":"관람 당일","fee":"취소 불가"}]',
   '["모바일 티켓"]',
   '[{"code":"VIP","name":"VIP 구역","price":154000},{"code":"R","name":"R석","price":132000},{"code":"S","name":"S석","price":110000},{"code":"A","name":"A석","price":88000}]',
   '{"host":"Starship Entertainment","manager":"URR 티켓팅","contact":"1588-0000","email":"support@urr.kr"}',
   NOW(), NOW()),

  -- 6. IVE 1ST WORLD TOUR (artist_id=4, KSPO DOME)
  (6, 4, 1,
   'IVE THE 1ST WORLD TOUR', 'IVE 첫 번째 월드 투어.',
   '2026-04-12', '2026-04-13', TRUE,
   '/artists/4/events/presale_ive-1st-world-tour.png', 'CONCERT', '["PRE_SALE"]',
   '150분', '만 7세 이상', '서울특별시 송파구 올림픽로 424 올림픽공원 내',
   NULL,
   '["선예매 단독 판매"]',
   '["실명 인증 필수","1인 최대 4매"]',
   'IVE',
   '[{"period":"관람일 기준 7일 전","fee":"없음"},{"period":"관람 당일","fee":"취소 불가"}]',
   '["모바일 티켓"]',
   '[{"code":"VIP","name":"VIP 구역","price":154000},{"code":"R","name":"R석","price":132000},{"code":"S","name":"S석","price":110000},{"code":"A","name":"A석","price":88000}]',
   '{"host":"Starship Entertainment","manager":"URR 티켓팅","contact":"1588-0000","email":"support@urr.kr"}',
   NOW(), NOW()),

  -- 7. BLACKPINK (artist_id=5, 고척스카이돔)
  (7, 5, 3,
   'BLACKPINK BORN PINK WORLD TOUR FINALE', 'BLACKPINK 월드 투어 서울 피날레.',
   '2026-07-15', '2026-07-16', TRUE,
   '/artists/5/events/event_blackpink-born-pink.png', 'CONCERT', '[]',
   '150분', '만 7세 이상', '서울특별시 구로구 경인로 430 고척스카이돔',
   NULL,
   '["실내 공연장 규정 준수"]',
   '["실명 인증 필수","1인 최대 4매"]',
   'BLACKPINK',
   '[{"period":"관람일 기준 7일 전","fee":"없음"},{"period":"관람 당일","fee":"취소 불가"}]',
   '["모바일 티켓"]',
   '[{"code":"VIP","name":"VIP 구역","price":165000},{"code":"R","name":"R석","price":143000},{"code":"S","name":"S석","price":121000},{"code":"A","name":"A석","price":99000}]',
   '{"host":"YG Entertainment","manager":"URR 티켓팅","contact":"1588-0000","email":"support@urr.kr"}',
   NOW(), NOW()),

  -- 8. Stray Kids DOMINANCE (artist_id=6, 고척스카이돔)
  (8, 6, 3,
   'Stray Kids DOMINANCE WORLD TOUR', 'Stray Kids 월드 투어 서울 공연.',
   '2026-07-05', '2026-07-06', TRUE,
   '/artists/6/events/presale_straykids-dominance.png', 'CONCERT', '["HOT"]',
   '150분', '만 7세 이상', '서울특별시 구로구 경인로 430 고척스카이돔',
   NULL,
   '["실내 공연장 규정 준수"]',
   '["실명 인증 필수","1인 최대 4매"]',
   'Stray Kids',
   '[{"period":"관람일 기준 7일 전","fee":"없음"},{"period":"관람 당일","fee":"취소 불가"}]',
   '["모바일 티켓"]',
   '[{"code":"VIP","name":"VIP 구역","price":154000},{"code":"R","name":"R석","price":132000},{"code":"S","name":"S석","price":110000},{"code":"A","name":"A석","price":88000}]',
   '{"host":"JYP Entertainment","manager":"URR 티켓팅","contact":"1588-0000","email":"support@urr.kr"}',
   NOW(), NOW()),

  -- 9. Stray Kids 6TH FANMEETING (artist_id=6, 올림픽홀)
  (9, 6, 5,
   'Stray Kids 6TH FANMEETING ''STAY in Our Little House''', 'Stray Kids 6주년 팬미팅.',
   '2026-05-01', '2026-05-02', TRUE,
   '/artists/6/events/event_stray-kids-6th-fanmeeting.gif', 'FANMEETING', '[]',
   '120분', '전체 관람가', '서울특별시 송파구 올림픽로 424 올림픽공원 올림픽홀',
   NULL,
   '["팬미팅 특성상 취소·환불 불가"]',
   '["실명 인증 필수","1인 최대 2매"]',
   'Stray Kids',
   '[{"period":"관람일 기준 7일 전","fee":"없음"},{"period":"관람 당일","fee":"취소 불가"}]',
   '["모바일 티켓"]',
   '[{"code":"VIP","name":"VIP 구역","price":110000},{"code":"R","name":"R석","price":99000},{"code":"S","name":"S석","price":88000}]',
   '{"host":"JYP Entertainment","manager":"URR 티켓팅","contact":"1588-0000","email":"support@urr.kr"}',
   NOW(), NOW()),

  -- 10. SEVENTEEN BE THE SUN (artist_id=7, 인천아시아드)
  (10, 7, 4,
   'SEVENTEEN WORLD TOUR BE THE SUN', 'SEVENTEEN 월드 투어 서울 공연.',
   '2026-04-04', '2026-04-05', TRUE,
   '/artists/7/events/event_seventeen-be-the-sun.png', 'CONCERT', '["PRE_SALE"]',
   '180분', '만 7세 이상', '인천광역시 미추홀구 매소홀로 618 인천아시아드주경기장',
   NULL,
   '["우천 시 공연 진행","드론·카메라 반입 금지"]',
   '["실명 인증 필수","1인 최대 4매"]',
   'SEVENTEEN',
   '[{"period":"관람일 기준 7일 전","fee":"없음"},{"period":"관람 당일","fee":"취소 불가"}]',
   '["모바일 티켓"]',
   '[{"code":"VIP","name":"VIP 구역","price":165000},{"code":"R","name":"R석","price":143000},{"code":"S","name":"S석","price":121000},{"code":"A","name":"A석","price":99000}]',
   '{"host":"PLEDIS Entertainment","manager":"URR 티켓팅","contact":"1588-0000","email":"support@urr.kr"}',
   NOW(), NOW()),

  -- 11. SEVENTEEN FOLLOW AGAIN (artist_id=7, 인천아시아드)
  (11, 7, 4,
   'SEVENTEEN FOLLOW AGAIN TOUR', 'SEVENTEEN 팔로우 어게인 투어.',
   '2026-05-25', '2026-05-27', TRUE,
   '/artists/7/events/presale_seventeen-follow-again-tour.png', 'CONCERT', '[]',
   '180분', '만 7세 이상', '인천광역시 미추홀구 매소홀로 618 인천아시아드주경기장',
   NULL,
   '["우천 시 공연 진행"]',
   '["실명 인증 필수","1인 최대 4매"]',
   'SEVENTEEN',
   '[{"period":"관람일 기준 7일 전","fee":"없음"},{"period":"관람 당일","fee":"취소 불가"}]',
   '["모바일 티켓"]',
   '[{"code":"VIP","name":"VIP 구역","price":165000},{"code":"R","name":"R석","price":143000},{"code":"S","name":"S석","price":121000},{"code":"A","name":"A석","price":99000}]',
   '{"host":"PLEDIS Entertainment","manager":"URR 티켓팅","contact":"1588-0000","email":"support@urr.kr"}',
   NOW(), NOW()),

  -- 12. NewJeans COMPLEXCON (artist_id=8, Long Beach)
  (12, 8, 7,
   'NewJeans × COMPLEXCON', 'NewJeans와 COMPLEXCON의 콜라보 페스티벌.',
   '2026-05-10', '2026-05-11', TRUE,
   '/artists/8/events/event_newjeans-complexcon.png', 'FESTIVAL', '[]',
   '360분', '전체 관람가', '300 E Ocean Blvd, Long Beach, CA 90802',
   NULL,
   '["해외 공연, 환불 정책 별도 적용"]',
   '["실명 인증 필수"]',
   'NewJeans',
   '[{"period":"관람일 기준 7일 전","fee":"없음"},{"period":"관람 당일","fee":"취소 불가"}]',
   '["모바일 티켓"]',
   '[{"code":"VIP","name":"VIP 구역","price":220000},{"code":"R","name":"R석","price":165000},{"code":"S","name":"S석","price":132000}]',
   '{"host":"ADOR","manager":"URR 티켓팅","contact":"1588-0000","email":"support@urr.kr"}',
   NOW(), NOW()),

  -- 13. NewJeans FAN MEETING (artist_id=8, 올림픽홀)
  (13, 8, 5,
   'NewJeans Fan Meeting ''Bunnies Camp''', 'NewJeans 팬미팅 버니즈 캠프.',
   '2026-03-15', '2026-03-16', TRUE,
   '/artists/8/events/presale_newjeans-fan-meeting.png', 'FANMEETING', '["HOT"]',
   '120분', '전체 관람가', '서울특별시 송파구 올림픽로 424 올림픽공원 올림픽홀',
   NULL,
   '["팬미팅 특성상 취소·환불 불가"]',
   '["실명 인증 필수","1인 최대 2매"]',
   'NewJeans',
   '[{"period":"관람일 기준 7일 전","fee":"없음"},{"period":"관람 당일","fee":"취소 불가"}]',
   '["모바일 티켓"]',
   '[{"code":"VIP","name":"VIP 구역","price":110000},{"code":"R","name":"R석","price":99000},{"code":"S","name":"S석","price":88000}]',
   '{"host":"ADOR","manager":"URR 티켓팅","contact":"1588-0000","email":"support@urr.kr"}',
   NOW(), NOW()),

  -- 14. (G)I-DLE (artist_id=9, KSPO DOME)
  (14, 9, 1,
   '(G)I-DLE WORLD TOUR ''iDOL''', '(G)I-DLE 월드 투어 서울 공연.',
   '2026-04-20', '2026-04-21', TRUE,
   '/artists/9/events/presale_gi-dle-world-tour.png', 'CONCERT', '["HOT"]',
   '150분', '만 7세 이상', '서울특별시 송파구 올림픽로 424 올림픽공원 내',
   NULL,
   '["공연 시작 후 30분 이후 입장 제한"]',
   '["실명 인증 필수","1인 최대 4매"]',
   '(G)I-DLE',
   '[{"period":"관람일 기준 7일 전","fee":"없음"},{"period":"관람 당일","fee":"취소 불가"}]',
   '["모바일 티켓"]',
   '[{"code":"VIP","name":"VIP 구역","price":154000},{"code":"R","name":"R석","price":132000},{"code":"S","name":"S석","price":110000},{"code":"A","name":"A석","price":88000}]',
   '{"host":"CUBE Entertainment","manager":"URR 티켓팅","contact":"1588-0000","email":"support@urr.kr"}',
   NOW(), NOW()),

  -- 15. TXT (artist_id=10, KSPO DOME)
  (15, 10, 1,
   'TXT WORLD TOUR ACT : PROMISE', 'TXT 월드 투어 서울 공연.',
   '2026-06-10', '2026-06-12', TRUE,
   '/artists/10/events/presale_txt-world-tour.png', 'CONCERT', '["HOT","PRE_SALE"]',
   '150분', '만 7세 이상', '서울특별시 송파구 올림픽로 424 올림픽공원 내',
   NULL,
   '["단독 판매 공연"]',
   '["실명 인증 필수","1인 최대 4매"]',
   'TXT',
   '[{"period":"관람일 기준 7일 전","fee":"없음"},{"period":"관람 당일","fee":"취소 불가"}]',
   '["모바일 티켓"]',
   '[{"code":"VIP","name":"VIP 구역","price":154000},{"code":"R","name":"R석","price":132000},{"code":"S","name":"S석","price":110000},{"code":"A","name":"A석","price":88000}]',
   '{"host":"BIGHIT MUSIC","manager":"URR 티켓팅","contact":"1588-0000","email":"support@urr.kr"}',
   NOW(), NOW()),

  -- 16. DAY6 (artist_id=11, 광주 김대중컨벤션센터)
  (16, 11, 6,
   'DAY6 10th Anniversary Tour', 'DAY6 데뷔 10주년 기념 투어.',
   '2026-03-14', '2026-03-15', TRUE,
   '/artists/11/events/event_day6-10th-anniversary-tour.png', 'CONCERT', '[]',
   '150분', '만 7세 이상', '광주광역시 서구 남부순환로 2번길 7 김대중컨벤션센터',
   NULL,
   '["공연 중 영상 촬영 금지"]',
   '["실명 인증 필수","1인 최대 4매"]',
   'DAY6',
   '[{"period":"관람일 기준 7일 전","fee":"없음"},{"period":"관람 당일","fee":"취소 불가"}]',
   '["모바일 티켓"]',
   '[{"code":"R","name":"R석","price":99000},{"code":"S","name":"S석","price":88000},{"code":"A","name":"A석","price":77000}]',
   '{"host":"JYP Entertainment","manager":"URR 티켓팅","contact":"1588-0000","email":"support@urr.kr"}',
   NOW(), NOW());

-- ============================================================
-- 5. shows
-- show_id 1~3   → event_id=1  G-Dragon (3회차)
-- show_id 4~6   → event_id=2  BTS YET TO COME (3회차)
-- show_id 7~10  → event_id=3  BTS ARIRANG (4회차)
-- show_id 11~12 → event_id=4  aespa (2회차)
-- show_id 13~15 → event_id=5  IVE SHOW WHAT I AM (3회차)
-- show_id 16~17 → event_id=6  IVE 1ST WORLD TOUR (2회차)
-- show_id 18~19 → event_id=7  BLACKPINK (2회차)
-- show_id 20~21 → event_id=8  Stray Kids DOMINANCE (2회차)
-- show_id 22~23 → event_id=9  Stray Kids FANMEETING (2회차)
-- show_id 24~25 → event_id=10 SEVENTEEN BE THE SUN (2회차)
-- show_id 26~28 → event_id=11 SEVENTEEN FOLLOW AGAIN (3회차)
-- show_id 29~30 → event_id=12 NewJeans COMPLEXCON (2회차)
-- show_id 31~32 → event_id=13 NewJeans FAN MEETING (2회차)
-- show_id 33~34 → event_id=14 (G)I-DLE (2회차)
-- show_id 35~37 → event_id=15 TXT (3회차)
-- show_id 38~39 → event_id=16 DAY6 (2회차)
-- ============================================================

INSERT INTO shows
  (id, event_id, session_no, start_at, end_at, capacity, active,
   sale_open_at, sale_close_at, status, seatmap_json, seatmap_version,
   created_at, updated_at)
VALUES
  (1,  1, 1, '2026-06-01 18:00:00', '2026-06-01 20:30:00', 15000, TRUE, '2026-02-20 12:00:00', '2026-06-01 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (2,  1, 2, '2026-06-02 18:00:00', '2026-06-02 20:30:00', 15000, TRUE, '2026-02-20 12:00:00', '2026-06-02 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (3,  1, 3, '2026-06-03 17:00:00', '2026-06-03 19:30:00', 15000, TRUE, '2026-02-20 12:00:00', '2026-06-03 16:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (4,  2, 1, '2026-08-01 19:00:00', '2026-08-01 22:00:00', 55000, TRUE, '2026-04-01 12:00:00', '2026-08-01 18:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (5,  2, 2, '2026-08-02 19:00:00', '2026-08-02 22:00:00', 55000, TRUE, '2026-04-01 12:00:00', '2026-08-02 18:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (6,  2, 3, '2026-08-03 19:00:00', '2026-08-03 22:00:00', 55000, TRUE, '2026-04-01 12:00:00', '2026-08-03 18:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (7,  3, 1, '2026-04-09 19:00:00', '2026-04-09 22:00:00', 55000, TRUE, '2026-02-01 12:00:00', '2026-04-09 18:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (8,  3, 2, '2026-04-10 19:00:00', '2026-04-10 22:00:00', 55000, TRUE, '2026-02-01 12:00:00', '2026-04-10 18:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (9,  3, 3, '2026-04-11 19:00:00', '2026-04-11 22:00:00', 55000, TRUE, '2026-02-01 12:00:00', '2026-04-11 18:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (10, 3, 4, '2026-04-12 19:00:00', '2026-04-12 22:00:00', 55000, TRUE, '2026-02-01 12:00:00', '2026-04-12 18:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (11, 4, 1, '2026-09-20 18:00:00', '2026-09-20 20:30:00', 15000, TRUE, '2026-05-01 12:00:00', '2026-09-20 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (12, 4, 2, '2026-09-21 18:00:00', '2026-09-21 20:30:00', 15000, TRUE, '2026-05-01 12:00:00', '2026-09-21 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (13, 5, 1, '2026-06-20 18:00:00', '2026-06-20 20:30:00', 15000, TRUE, '2026-03-15 12:00:00', '2026-06-20 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (14, 5, 2, '2026-06-21 18:00:00', '2026-06-21 20:30:00', 15000, TRUE, '2026-03-15 12:00:00', '2026-06-21 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (15, 5, 3, '2026-06-22 18:00:00', '2026-06-22 20:30:00', 15000, TRUE, '2026-03-15 12:00:00', '2026-06-22 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (16, 6, 1, '2026-04-12 18:00:00', '2026-04-12 20:30:00', 15000, TRUE, '2026-03-03 20:00:00', '2026-04-12 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (17, 6, 2, '2026-04-13 18:00:00', '2026-04-13 20:30:00', 15000, TRUE, '2026-03-03 20:00:00', '2026-04-13 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (18, 7, 1, '2026-07-15 18:30:00', '2026-07-15 21:00:00', 17000, TRUE, '2026-04-01 12:00:00', '2026-07-15 17:30:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (19, 7, 2, '2026-07-16 18:30:00', '2026-07-16 21:00:00', 17000, TRUE, '2026-04-01 12:00:00', '2026-07-16 17:30:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (20, 8, 1, '2026-07-05 18:00:00', '2026-07-05 20:30:00', 17000, TRUE, '2026-03-11 20:00:00', '2026-07-05 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (21, 8, 2, '2026-07-06 18:00:00', '2026-07-06 20:30:00', 17000, TRUE, '2026-03-11 20:00:00', '2026-07-06 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (22, 9, 1, '2026-05-01 18:00:00', '2026-05-01 20:00:00', 7000,  TRUE, '2026-03-01 12:00:00', '2026-05-01 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (23, 9, 2, '2026-05-02 18:00:00', '2026-05-02 20:00:00', 7000,  TRUE, '2026-03-01 12:00:00', '2026-05-02 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (24, 10, 1, '2026-04-04 18:00:00', '2026-04-04 21:00:00', 20000, TRUE, '2026-02-20 17:00:00', '2026-04-04 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (25, 10, 2, '2026-04-05 18:00:00', '2026-04-05 21:00:00', 20000, TRUE, '2026-02-20 17:00:00', '2026-04-05 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (26, 11, 1, '2026-05-25 18:00:00', '2026-05-25 21:00:00', 20000, TRUE, '2026-03-06 17:00:00', '2026-05-25 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (27, 11, 2, '2026-05-26 18:00:00', '2026-05-26 21:00:00', 20000, TRUE, '2026-03-06 17:00:00', '2026-05-26 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (28, 11, 3, '2026-05-27 18:00:00', '2026-05-27 21:00:00', 20000, TRUE, '2026-03-06 17:00:00', '2026-05-27 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (29, 12, 1, '2026-05-10 10:00:00', '2026-05-10 22:00:00', 10000, TRUE, '2026-03-09 14:00:00', '2026-05-10 09:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (30, 12, 2, '2026-05-11 10:00:00', '2026-05-11 22:00:00', 10000, TRUE, '2026-03-09 14:00:00', '2026-05-11 09:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (31, 13, 1, '2026-03-15 18:00:00', '2026-03-15 20:00:00', 7000,  TRUE, '2026-03-09 14:00:00', '2026-03-15 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (32, 13, 2, '2026-03-16 18:00:00', '2026-03-16 20:00:00', 7000,  TRUE, '2026-03-09 14:00:00', '2026-03-16 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (33, 14, 1, '2026-04-20 18:00:00', '2026-04-20 20:30:00', 15000, TRUE, '2026-03-06 14:00:00', '2026-04-20 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (34, 14, 2, '2026-04-21 18:00:00', '2026-04-21 20:30:00', 15000, TRUE, '2026-03-06 14:00:00', '2026-04-21 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (35, 15, 1, '2026-06-10 18:00:00', '2026-06-10 20:30:00', 15000, TRUE, '2026-04-01 20:00:00', '2026-06-10 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (36, 15, 2, '2026-06-11 18:00:00', '2026-06-11 20:30:00', 15000, TRUE, '2026-04-01 20:00:00', '2026-06-11 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (37, 15, 3, '2026-06-12 18:00:00', '2026-06-12 20:30:00', 15000, TRUE, '2026-04-01 20:00:00', '2026-06-12 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (38, 16, 1, '2026-03-14 18:00:00', '2026-03-14 20:30:00', 3000,  TRUE, '2026-02-01 12:00:00', '2026-03-14 17:00:00', 'OPEN', NULL, 1, NOW(), NOW()),
  (39, 16, 2, '2026-03-15 18:00:00', '2026-03-15 20:30:00', 3000,  TRUE, '2026-02-01 12:00:00', '2026-03-15 17:00:00', 'OPEN', NULL, 1, NOW(), NOW());

-- ============================================================
-- 6. show_section_policies
-- ============================================================

INSERT INTO show_section_policies
  (show_id, code, name, price, color, display_order, active, created_at, updated_at)
VALUES
  -- show 1~3: G-Dragon
  (1,'VIP','VIP 구역',165000,'#FFD700',1,TRUE,NOW(),NOW()),(1,'R','R석',143000,'#FF5E32',2,TRUE,NOW(),NOW()),(1,'S','S석',121000,'#1F2792',3,TRUE,NOW(),NOW()),(1,'A','A석',99000,'#22C55E',4,TRUE,NOW(),NOW()),
  (2,'VIP','VIP 구역',165000,'#FFD700',1,TRUE,NOW(),NOW()),(2,'R','R석',143000,'#FF5E32',2,TRUE,NOW(),NOW()),(2,'S','S석',121000,'#1F2792',3,TRUE,NOW(),NOW()),(2,'A','A석',99000,'#22C55E',4,TRUE,NOW(),NOW()),
  (3,'VIP','VIP 구역',165000,'#FFD700',1,TRUE,NOW(),NOW()),(3,'R','R석',143000,'#FF5E32',2,TRUE,NOW(),NOW()),(3,'S','S석',121000,'#1F2792',3,TRUE,NOW(),NOW()),(3,'A','A석',99000,'#22C55E',4,TRUE,NOW(),NOW()),
  -- show 4~6: BTS YET TO COME
  (4,'VIP','VIP 구역',165000,'#FFD700',1,TRUE,NOW(),NOW()),(4,'R','R석',143000,'#FF5E32',2,TRUE,NOW(),NOW()),(4,'S','S석',121000,'#1F2792',3,TRUE,NOW(),NOW()),(4,'A','A석',99000,'#22C55E',4,TRUE,NOW(),NOW()),
  (5,'VIP','VIP 구역',165000,'#FFD700',1,TRUE,NOW(),NOW()),(5,'R','R석',143000,'#FF5E32',2,TRUE,NOW(),NOW()),(5,'S','S석',121000,'#1F2792',3,TRUE,NOW(),NOW()),(5,'A','A석',99000,'#22C55E',4,TRUE,NOW(),NOW()),
  (6,'VIP','VIP 구역',165000,'#FFD700',1,TRUE,NOW(),NOW()),(6,'R','R석',143000,'#FF5E32',2,TRUE,NOW(),NOW()),(6,'S','S석',121000,'#1F2792',3,TRUE,NOW(),NOW()),(6,'A','A석',99000,'#22C55E',4,TRUE,NOW(),NOW()),
  -- show 7~10: BTS ARIRANG
  (7,'VIP','VIP 구역',165000,'#FFD700',1,TRUE,NOW(),NOW()),(7,'R','R석',143000,'#FF5E32',2,TRUE,NOW(),NOW()),(7,'S','S석',121000,'#1F2792',3,TRUE,NOW(),NOW()),(7,'A','A석',99000,'#22C55E',4,TRUE,NOW(),NOW()),
  (8,'VIP','VIP 구역',165000,'#FFD700',1,TRUE,NOW(),NOW()),(8,'R','R석',143000,'#FF5E32',2,TRUE,NOW(),NOW()),(8,'S','S석',121000,'#1F2792',3,TRUE,NOW(),NOW()),(8,'A','A석',99000,'#22C55E',4,TRUE,NOW(),NOW()),
  (9,'VIP','VIP 구역',165000,'#FFD700',1,TRUE,NOW(),NOW()),(9,'R','R석',143000,'#FF5E32',2,TRUE,NOW(),NOW()),(9,'S','S석',121000,'#1F2792',3,TRUE,NOW(),NOW()),(9,'A','A석',99000,'#22C55E',4,TRUE,NOW(),NOW()),
  (10,'VIP','VIP 구역',165000,'#FFD700',1,TRUE,NOW(),NOW()),(10,'R','R석',143000,'#FF5E32',2,TRUE,NOW(),NOW()),(10,'S','S석',121000,'#1F2792',3,TRUE,NOW(),NOW()),(10,'A','A석',99000,'#22C55E',4,TRUE,NOW(),NOW()),
  -- show 11~12: aespa
  (11,'VIP','VIP 구역',154000,'#FFD700',1,TRUE,NOW(),NOW()),(11,'R','R석',132000,'#FF5E32',2,TRUE,NOW(),NOW()),(11,'S','S석',110000,'#1F2792',3,TRUE,NOW(),NOW()),(11,'A','A석',88000,'#22C55E',4,TRUE,NOW(),NOW()),
  (12,'VIP','VIP 구역',154000,'#FFD700',1,TRUE,NOW(),NOW()),(12,'R','R석',132000,'#FF5E32',2,TRUE,NOW(),NOW()),(12,'S','S석',110000,'#1F2792',3,TRUE,NOW(),NOW()),(12,'A','A석',88000,'#22C55E',4,TRUE,NOW(),NOW()),
  -- show 13~15: IVE SHOW WHAT I AM
  (13,'VIP','VIP 구역',154000,'#FFD700',1,TRUE,NOW(),NOW()),(13,'R','R석',132000,'#FF5E32',2,TRUE,NOW(),NOW()),(13,'S','S석',110000,'#1F2792',3,TRUE,NOW(),NOW()),(13,'A','A석',88000,'#22C55E',4,TRUE,NOW(),NOW()),
  (14,'VIP','VIP 구역',154000,'#FFD700',1,TRUE,NOW(),NOW()),(14,'R','R석',132000,'#FF5E32',2,TRUE,NOW(),NOW()),(14,'S','S석',110000,'#1F2792',3,TRUE,NOW(),NOW()),(14,'A','A석',88000,'#22C55E',4,TRUE,NOW(),NOW()),
  (15,'VIP','VIP 구역',154000,'#FFD700',1,TRUE,NOW(),NOW()),(15,'R','R석',132000,'#FF5E32',2,TRUE,NOW(),NOW()),(15,'S','S석',110000,'#1F2792',3,TRUE,NOW(),NOW()),(15,'A','A석',88000,'#22C55E',4,TRUE,NOW(),NOW()),
  -- show 16~17: IVE 1ST WORLD TOUR
  (16,'VIP','VIP 구역',154000,'#FFD700',1,TRUE,NOW(),NOW()),(16,'R','R석',132000,'#FF5E32',2,TRUE,NOW(),NOW()),(16,'S','S석',110000,'#1F2792',3,TRUE,NOW(),NOW()),(16,'A','A석',88000,'#22C55E',4,TRUE,NOW(),NOW()),
  (17,'VIP','VIP 구역',154000,'#FFD700',1,TRUE,NOW(),NOW()),(17,'R','R석',132000,'#FF5E32',2,TRUE,NOW(),NOW()),(17,'S','S석',110000,'#1F2792',3,TRUE,NOW(),NOW()),(17,'A','A석',88000,'#22C55E',4,TRUE,NOW(),NOW()),
  -- show 18~19: BLACKPINK
  (18,'VIP','VIP 구역',165000,'#FFD700',1,TRUE,NOW(),NOW()),(18,'R','R석',143000,'#FF5E32',2,TRUE,NOW(),NOW()),(18,'S','S석',121000,'#1F2792',3,TRUE,NOW(),NOW()),(18,'A','A석',99000,'#22C55E',4,TRUE,NOW(),NOW()),
  (19,'VIP','VIP 구역',165000,'#FFD700',1,TRUE,NOW(),NOW()),(19,'R','R석',143000,'#FF5E32',2,TRUE,NOW(),NOW()),(19,'S','S석',121000,'#1F2792',3,TRUE,NOW(),NOW()),(19,'A','A석',99000,'#22C55E',4,TRUE,NOW(),NOW()),
  -- show 20~21: Stray Kids DOMINANCE
  (20,'VIP','VIP 구역',154000,'#FFD700',1,TRUE,NOW(),NOW()),(20,'R','R석',132000,'#FF5E32',2,TRUE,NOW(),NOW()),(20,'S','S석',110000,'#1F2792',3,TRUE,NOW(),NOW()),(20,'A','A석',88000,'#22C55E',4,TRUE,NOW(),NOW()),
  (21,'VIP','VIP 구역',154000,'#FFD700',1,TRUE,NOW(),NOW()),(21,'R','R석',132000,'#FF5E32',2,TRUE,NOW(),NOW()),(21,'S','S석',110000,'#1F2792',3,TRUE,NOW(),NOW()),(21,'A','A석',88000,'#22C55E',4,TRUE,NOW(),NOW()),
  -- show 22~23: Stray Kids FANMEETING (VIP/R/S 3등급)
  (22,'VIP','VIP 구역',110000,'#FFD700',1,TRUE,NOW(),NOW()),(22,'R','R석',99000,'#FF5E32',2,TRUE,NOW(),NOW()),(22,'S','S석',88000,'#1F2792',3,TRUE,NOW(),NOW()),
  (23,'VIP','VIP 구역',110000,'#FFD700',1,TRUE,NOW(),NOW()),(23,'R','R석',99000,'#FF5E32',2,TRUE,NOW(),NOW()),(23,'S','S석',88000,'#1F2792',3,TRUE,NOW(),NOW()),
  -- show 24~25: SEVENTEEN BE THE SUN
  (24,'VIP','VIP 구역',165000,'#FFD700',1,TRUE,NOW(),NOW()),(24,'R','R석',143000,'#FF5E32',2,TRUE,NOW(),NOW()),(24,'S','S석',121000,'#1F2792',3,TRUE,NOW(),NOW()),(24,'A','A석',99000,'#22C55E',4,TRUE,NOW(),NOW()),
  (25,'VIP','VIP 구역',165000,'#FFD700',1,TRUE,NOW(),NOW()),(25,'R','R석',143000,'#FF5E32',2,TRUE,NOW(),NOW()),(25,'S','S석',121000,'#1F2792',3,TRUE,NOW(),NOW()),(25,'A','A석',99000,'#22C55E',4,TRUE,NOW(),NOW()),
  -- show 26~28: SEVENTEEN FOLLOW AGAIN
  (26,'VIP','VIP 구역',165000,'#FFD700',1,TRUE,NOW(),NOW()),(26,'R','R석',143000,'#FF5E32',2,TRUE,NOW(),NOW()),(26,'S','S석',121000,'#1F2792',3,TRUE,NOW(),NOW()),(26,'A','A석',99000,'#22C55E',4,TRUE,NOW(),NOW()),
  (27,'VIP','VIP 구역',165000,'#FFD700',1,TRUE,NOW(),NOW()),(27,'R','R석',143000,'#FF5E32',2,TRUE,NOW(),NOW()),(27,'S','S석',121000,'#1F2792',3,TRUE,NOW(),NOW()),(27,'A','A석',99000,'#22C55E',4,TRUE,NOW(),NOW()),
  (28,'VIP','VIP 구역',165000,'#FFD700',1,TRUE,NOW(),NOW()),(28,'R','R석',143000,'#FF5E32',2,TRUE,NOW(),NOW()),(28,'S','S석',121000,'#1F2792',3,TRUE,NOW(),NOW()),(28,'A','A석',99000,'#22C55E',4,TRUE,NOW(),NOW()),
  -- show 29~30: NewJeans COMPLEXCON (VIP/R/S 3등급)
  (29,'VIP','VIP 구역',220000,'#FFD700',1,TRUE,NOW(),NOW()),(29,'R','R석',165000,'#FF5E32',2,TRUE,NOW(),NOW()),(29,'S','S석',132000,'#1F2792',3,TRUE,NOW(),NOW()),
  (30,'VIP','VIP 구역',220000,'#FFD700',1,TRUE,NOW(),NOW()),(30,'R','R석',165000,'#FF5E32',2,TRUE,NOW(),NOW()),(30,'S','S석',132000,'#1F2792',3,TRUE,NOW(),NOW()),
  -- show 31~32: NewJeans FAN MEETING (VIP/R/S 3등급)
  (31,'VIP','VIP 구역',110000,'#FFD700',1,TRUE,NOW(),NOW()),(31,'R','R석',99000,'#FF5E32',2,TRUE,NOW(),NOW()),(31,'S','S석',88000,'#1F2792',3,TRUE,NOW(),NOW()),
  (32,'VIP','VIP 구역',110000,'#FFD700',1,TRUE,NOW(),NOW()),(32,'R','R석',99000,'#FF5E32',2,TRUE,NOW(),NOW()),(32,'S','S석',88000,'#1F2792',3,TRUE,NOW(),NOW()),
  -- show 33~34: (G)I-DLE
  (33,'VIP','VIP 구역',154000,'#FFD700',1,TRUE,NOW(),NOW()),(33,'R','R석',132000,'#FF5E32',2,TRUE,NOW(),NOW()),(33,'S','S석',110000,'#1F2792',3,TRUE,NOW(),NOW()),(33,'A','A석',88000,'#22C55E',4,TRUE,NOW(),NOW()),
  (34,'VIP','VIP 구역',154000,'#FFD700',1,TRUE,NOW(),NOW()),(34,'R','R석',132000,'#FF5E32',2,TRUE,NOW(),NOW()),(34,'S','S석',110000,'#1F2792',3,TRUE,NOW(),NOW()),(34,'A','A석',88000,'#22C55E',4,TRUE,NOW(),NOW()),
  -- show 35~37: TXT
  (35,'VIP','VIP 구역',154000,'#FFD700',1,TRUE,NOW(),NOW()),(35,'R','R석',132000,'#FF5E32',2,TRUE,NOW(),NOW()),(35,'S','S석',110000,'#1F2792',3,TRUE,NOW(),NOW()),(35,'A','A석',88000,'#22C55E',4,TRUE,NOW(),NOW()),
  (36,'VIP','VIP 구역',154000,'#FFD700',1,TRUE,NOW(),NOW()),(36,'R','R석',132000,'#FF5E32',2,TRUE,NOW(),NOW()),(36,'S','S석',110000,'#1F2792',3,TRUE,NOW(),NOW()),(36,'A','A석',88000,'#22C55E',4,TRUE,NOW(),NOW()),
  (37,'VIP','VIP 구역',154000,'#FFD700',1,TRUE,NOW(),NOW()),(37,'R','R석',132000,'#FF5E32',2,TRUE,NOW(),NOW()),(37,'S','S석',110000,'#1F2792',3,TRUE,NOW(),NOW()),(37,'A','A석',88000,'#22C55E',4,TRUE,NOW(),NOW()),
  -- show 38~39: DAY6 (R/S/A 3등급)
  (38,'R','R석',99000,'#FF5E32',1,TRUE,NOW(),NOW()),(38,'S','S석',88000,'#1F2792',2,TRUE,NOW(),NOW()),(38,'A','A석',77000,'#22C55E',3,TRUE,NOW(),NOW()),
  (39,'R','R석',99000,'#FF5E32',1,TRUE,NOW(),NOW()),(39,'S','S석',88000,'#1F2792',2,TRUE,NOW(),NOW()),(39,'A','A석',77000,'#22C55E',3,TRUE,NOW(),NOW());

-- ============================================================
-- 7. artist_follows
-- mockUser (user_id=1): G-Dragon, BTS, aespa, IVE 팔로우
-- ============================================================

INSERT INTO artist_follows
  (artist_id, user_id, created_at, updated_at)
VALUES
  (1, 1, NOW(), NOW()),
  (2, 1, NOW(), NOW()),
  (3, 1, NOW(), NOW()),
  (4, 1, NOW(), NOW());

-- ============================================================
-- 8. artist_memberships
-- mockUser (user_id=1) 멤버십 4건
-- ============================================================

INSERT INTO artist_memberships
  (artist_id, user_id, nickname, tier, status, order_id, payment_id,
   pending_expires_at, start_date, end_date)
VALUES
  (1, 1, '지디사랑해', 'LIGHTNING', 'ACTIVE',
   'ORD-GD-2025-0001', 'PAY-GD-2025-0001',
   '2025-01-15 00:10:00', '2025-01-15', '2026-12-31'),
  (2, 1, '보라해아미', 'THUNDER', 'EXPIRED',
   'ORD-BTS-2025-0042', 'PAY-BTS-2025-0042',
   '2025-03-20 00:10:00', '2025-03-20', '2026-06-30'),
  (3, 1, '마이윈터', 'CLOUD', 'ACTIVE',
   'ORD-AE-2025-0128', 'PAY-AE-2025-0128',
   '2025-06-01 00:10:00', '2025-06-01', '2026-09-15'),
  (4, 1, '아이브최고', 'MIST', 'EXPIRED',
   'ORD-IVE-2025-0085', 'PAY-IVE-2025-0085',
   '2025-08-10 00:10:00', '2025-08-10', '2026-08-10');
