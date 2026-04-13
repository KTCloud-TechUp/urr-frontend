-- ==============================================================
-- URR Event Service — Seed Data
-- Generated: 2026-04-07
-- DB: MySQL (InnoDB / utf8mb4)
-- 전제: 테이블은 Hibernate DDL로 이미 생성된 상태
-- ==============================================================

CREATE DATABASE IF NOT EXISTS urr_event CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE urr_event;
-- ──────────────────────────────────────────────────────────────
-- 1. artists
-- ──────────────────────────────────────────────────────────────
INSERT INTO artists
  (id, name, profile_image_url, description, bio, banner_image_url, category, created_at, updated_at)
VALUES
  (1,  'G-Dragon',   '/artists/1/profile.png',  'BIGBANG 리더이자 솔로 아티스트. K-POP의 아이콘.',                              'BIGBANG 리더이자 솔로 아티스트. K-POP의 아이콘.',                              '/artists/1/banner.png',   'SOLO',      '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  (2,  'BTS',        '/artists/2/profile.png',  '글로벌 K-POP 보이그룹. 전 세계를 사로잡은 음악과 메시지.',                     '글로벌 K-POP 보이그룹. 전 세계를 사로잡은 음악과 메시지.',                     '/artists/2/banner.png',   'BOYGROUP',  '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  (3,  'aespa',      '/artists/3/profile.png',  'SM Entertainment 4인조 걸그룹. 메타버스 세계관의 선두주자.',                   'SM Entertainment 4인조 걸그룹. 메타버스 세계관의 선두주자.',                   '/artists/3/banner.png',   'GIRLGROUP', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  (4,  'IVE',        '/artists/4/profile.png',  'Starship Entertainment 6인조 걸그룹. "나"를 당당하게 표현하는 음악.',          'Starship Entertainment 6인조 걸그룹. "나"를 당당하게 표현하는 음악.',          '/artists/4/banner.jpeg',  'GIRLGROUP', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  (5,  'BLACKPINK',  '/artists/5/profile.png',  'YG Entertainment 글로벌 걸그룹. 음악, 패션, 퍼포먼스의 완성형.',              'YG Entertainment 글로벌 걸그룹. 음악, 패션, 퍼포먼스의 완성형.',              '/artists/5/banner.png',   'GIRLGROUP', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  (6,  'Stray Kids', '/artists/6/profile.png',  'JYP Entertainment 8인조 보이그룹. 자체 프로듀싱의 대명사.',                   'JYP Entertainment 8인조 보이그룹. 자체 프로듀싱의 대명사.',                   '/artists/6/banner.png',   'BOYGROUP',  '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  (7,  'SEVENTEEN',  '/artists/7/profile.png',  'PLEDIS Entertainment 13인조 보이그룹. 자체 안무, 자작곡의 아이콘.',            'PLEDIS Entertainment 13인조 보이그룹. 자체 안무, 자작곡의 아이콘.',            '/artists/7/banner.jpg',   'BOYGROUP',  '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  (8,  'NewJeans',   '/artists/8/profile.png',  'ADOR 5인조 걸그룹. 새로운 시대의 K-POP 트렌드세터.',                         'ADOR 5인조 걸그룹. 새로운 시대의 K-POP 트렌드세터.',                         '/artists/8/banner.jpeg',  'GIRLGROUP', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  (9,  '(G)I-DLE',   '/artists/9/profile.png',  'CUBE Entertainment 5인조 걸그룹. 전원 자작곡 걸그룹의 선두주자.',             'CUBE Entertainment 5인조 걸그룹. 전원 자작곡 걸그룹의 선두주자.',             '/artists/9/banner.jpeg',  'GIRLGROUP', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  (10, 'TXT',        '/artists/10/profile.png', 'BIGHIT MUSIC 5인조 보이그룹. 독보적 세계관과 음악 실험.',                    'BIGHIT MUSIC 5인조 보이그룹. 독보적 세계관과 음악 실험.',                    '/artists/10/banner.jpeg', 'BOYGROUP',  '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  (11, 'DAY6',       '/artists/11/profile.png', 'JYP Entertainment 밴드. 직접 작곡하는 셀프 프로듀싱 밴드.',                  'JYP Entertainment 밴드. 직접 작곡하는 셀프 프로듀싱 밴드.',                  '/artists/11/banner.png',  'BAND',      '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  (12, 'TWS',        '/artists/12/profile.png', 'Starship Entertainment 7인조 보이그룹. 진정성 있는 감성으로 주목받는 신인.',  'Starship Entertainment 7인조 보이그룹. 진정성 있는 감성으로 주목받는 신인.',  '/artists/12/banner.jpg',  'BOYGROUP',  '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  (13, '악동뮤지션', '/artists/13/profile.png', 'YG Entertainment 남매 듀오. 자작곡으로 감성을 전하는 인디-팝 아이콘.',        'YG Entertainment 남매 듀오. 자작곡으로 감성을 전하는 인디-팝 아이콘.',        '/artists/13/banner.png',  'COEDGROUP', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  (14, '권정렬',     '/artists/14/profile.jpg', '10CM의 보컬리스트. 감성 팝으로 많은 사람의 마음을 울리는 싱어송라이터.',       '10CM의 보컬리스트. 감성 팝으로 많은 사람의 마음을 울리는 싱어송라이터.',       '/artists/14/banner.jpeg', 'SOLO',      '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  (15, 'RIIZE',      '/artists/15/profile.png', 'SM Entertainment 7인조 보이그룹. 데뷔와 동시에 음원차트 올킬.',              'SM Entertainment 7인조 보이그룹. 데뷔와 동시에 음원차트 올킬.',              '/artists/15/banner.jpeg', 'BOYGROUP',  '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  (16, 'IU',         '/artists/16/profile.jpg', '카카오엔터테인먼트 솔로 아티스트. 발라드부터 팝까지, 대한민국 대표 국민 가수.', '카카오엔터테인먼트 솔로 아티스트. 발라드부터 팝까지, 대한민국 대표 국민 가수.', '/artists/16/banner.jpeg', 'SOLO',      '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  (17, 'NMIXX',      '/artists/17/profile.png', 'JYP Entertainment 6인조 걸그룹. 믹스팝 장르를 개척하는 차세대 걸그룹.',       'JYP Entertainment 6인조 걸그룹. 믹스팝 장르를 개척하는 차세대 걸그룹.',       '/artists/17/banner.png',  'GIRLGROUP', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  (18, '최예나',     '/artists/18/profile.jpg', '아이즈원 출신. 특유의 에너지와 독보적인 퍼포먼스로 팬들의 마음을 사로잡는 K-POP 아이콘.', '아이즈원 출신. 특유의 에너지와 독보적인 퍼포먼스로 팬들의 마음을 사로잡는 K-POP 아이콘.', '/artists/18/banner.jpg',  'SOLO',      '2025-01-01 00:00:00', '2025-01-01 00:00:00');


-- ──────────────────────────────────────────────────────────────
-- 2. venue_templates
-- seatmap_json: 구역별 구성 메타 (좌석 배치 기준)
-- ──────────────────────────────────────────────────────────────
INSERT INTO venue_templates
  (id, name, seatmap_json, base_capacity, active, created_at, updated_at)
VALUES
  (1, 'URR KSPO DOME STYLE V2', '{"venueTemplateName":"URR KSPO DOME STYLE V2","version":1,"tiers":[{"tierCode":"VIP","zones":[{"zoneNo":1,"rowStart":"1","rowEnd":"23","colStart":1,"colEnd":29},{"zoneNo":2,"rowStart":"1","rowEnd":"23","colStart":1,"colEnd":29},{"zoneNo":3,"rowStart":"1","rowEnd":"23","colStart":1,"colEnd":29}]},{"tierCode":"S","zones":[{"zoneNo":1,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"zoneNo":2,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"zoneNo":3,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"zoneNo":4,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"zoneNo":5,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"zoneNo":6,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"zoneNo":7,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"zoneNo":8,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22}]},{"tierCode":"R","zones":[{"zoneNo":1,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"zoneNo":2,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"zoneNo":3,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"zoneNo":4,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"zoneNo":5,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"zoneNo":6,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"zoneNo":7,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28}]},{"tierCode":"A","zones":[{"zoneNo":1,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":2,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":3,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":4,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":5,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":6,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":7,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":8,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":9,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":10,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":11,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":12,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":13,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":14,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":15,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":16,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":17,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":18,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":19,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":20,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15}]}],"sections":[{"name":"VIP1","tier":"VIP","zoneNo":1,"rowStart":"1","rowEnd":"23","colStart":1,"colEnd":29},{"name":"VIP2","tier":"VIP","zoneNo":2,"rowStart":"1","rowEnd":"23","colStart":1,"colEnd":29},{"name":"VIP3","tier":"VIP","zoneNo":3,"rowStart":"1","rowEnd":"23","colStart":1,"colEnd":29},{"name":"S1","tier":"S","zoneNo":1,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"name":"S2","tier":"S","zoneNo":2,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"name":"S3","tier":"S","zoneNo":3,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"name":"S4","tier":"S","zoneNo":4,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"name":"S5","tier":"S","zoneNo":5,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"name":"S6","tier":"S","zoneNo":6,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"name":"S7","tier":"S","zoneNo":7,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"name":"S8","tier":"S","zoneNo":8,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"name":"R1","tier":"R","zoneNo":1,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"name":"R2","tier":"R","zoneNo":2,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"name":"R3","tier":"R","zoneNo":3,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"name":"R4","tier":"R","zoneNo":4,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"name":"R5","tier":"R","zoneNo":5,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"name":"R6","tier":"R","zoneNo":6,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"name":"R7","tier":"R","zoneNo":7,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"name":"A1","tier":"A","zoneNo":1,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A2","tier":"A","zoneNo":2,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A3","tier":"A","zoneNo":3,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A4","tier":"A","zoneNo":4,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A5","tier":"A","zoneNo":5,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A6","tier":"A","zoneNo":6,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A7","tier":"A","zoneNo":7,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A8","tier":"A","zoneNo":8,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A9","tier":"A","zoneNo":9,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A10","tier":"A","zoneNo":10,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A11","tier":"A","zoneNo":11,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A12","tier":"A","zoneNo":12,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A13","tier":"A","zoneNo":13,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A14","tier":"A","zoneNo":14,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A15","tier":"A","zoneNo":15,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A16","tier":"A","zoneNo":16,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A17","tier":"A","zoneNo":17,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A18","tier":"A","zoneNo":18,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A19","tier":"A","zoneNo":19,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A20","tier":"A","zoneNo":20,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15}]}', 14693, 1, '2026-04-09 00:00:00', '2026-04-09 00:00:00');


-- ──────────────────────────────────────────────────────────────
-- 3. membership_policies
-- presale_offset_minutes: MIST 일반 오픈 대비 앞당기는 분 수
-- booking_fee_won: 해당 티어 유저가 실제 부담하는 예매 수수료
-- 기준 (mock event-detail.ts): LIGHTNING=0, THUNDER=3000, CLOUD=5000, MIST=8000
-- 선예매 오프셋 (G-Dragon 기준): LIGHTNING=2940분, THUNDER=2880분, CLOUD=60분, MIST=0분
-- ──────────────────────────────────────────────────────────────
INSERT INTO membership_policies
  (id, artist_id, tier, presale_offset_minutes, booking_fee_won, created_at, updated_at)
VALUES
  -- G-Dragon (artist_id=1)
  (1,  1, 'LIGHTNING', 2940, 0,    '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (2,  1, 'THUNDER',   2880, 3000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (3,  1, 'CLOUD',       60, 5000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (4,  1, 'MIST',         0, 8000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  -- BTS (artist_id=2)
  (5,  2, 'LIGHTNING', 2940, 0,    '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (6,  2, 'THUNDER',   2880, 3000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (7,  2, 'CLOUD',       60, 5000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (8,  2, 'MIST',         0, 8000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  -- aespa (artist_id=3)
  (9,  3, 'LIGHTNING', 2940, 0,    '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (10, 3, 'THUNDER',   2880, 3000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (11, 3, 'CLOUD',       60, 5000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (12, 3, 'MIST',         0, 8000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  -- IVE (artist_id=4)
  (13, 4, 'LIGHTNING', 2940, 0,    '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (14, 4, 'THUNDER',   2880, 3000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (15, 4, 'CLOUD',       60, 5000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (16, 4, 'MIST',         0, 8000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  -- BLACKPINK (artist_id=5)
  (17, 5, 'LIGHTNING', 2940, 0,    '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (18, 5, 'THUNDER',   2880, 3000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (19, 5, 'CLOUD',       60, 5000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (20, 5, 'MIST',         0, 8000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  -- Stray Kids (artist_id=6)
  (21, 6, 'LIGHTNING', 2940, 0,    '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (22, 6, 'THUNDER',   2880, 3000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (23, 6, 'CLOUD',       60, 5000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (24, 6, 'MIST',         0, 8000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  -- SEVENTEEN (artist_id=7)
  (25, 7, 'LIGHTNING', 2940, 0,    '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (26, 7, 'THUNDER',   2880, 3000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (27, 7, 'CLOUD',       60, 5000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (28, 7, 'MIST',         0, 8000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  -- NewJeans (artist_id=8)
  (29, 8, 'LIGHTNING', 2940, 0,    '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (30, 8, 'THUNDER',   2880, 3000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (31, 8, 'CLOUD',       60, 5000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (32, 8, 'MIST',         0, 8000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  -- (G)I-DLE (artist_id=9)
  (33, 9, 'LIGHTNING', 2940, 0,    '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (34, 9, 'THUNDER',   2880, 3000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (35, 9, 'CLOUD',       60, 5000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (36, 9, 'MIST',         0, 8000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  -- TXT (artist_id=10)
  (37, 10, 'LIGHTNING', 2940, 0,    '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (38, 10, 'THUNDER',   2880, 3000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (39, 10, 'CLOUD',       60, 5000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (40, 10, 'MIST',         0, 8000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  -- DAY6 (artist_id=11)
  (41, 11, 'LIGHTNING', 2940, 0,    '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (42, 11, 'THUNDER',   2880, 3000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (43, 11, 'CLOUD',       60, 5000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
  (44, 11, 'MIST',         0, 8000, '2025-01-15 00:00:00', '2025-01-15 00:00:00');


-- ──────────────────────────────────────────────────────────────
-- 4. events
-- open_date: MIST 기준 일반 예매 오픈일
-- venue_template_id → venue_templates.id
-- event id=4 는 mock 데이터에 없으므로 생략 (AUTO_INCREMENT gap 허용)
-- ──────────────────────────────────────────────────────────────
INSERT INTO events
  (id, artist_id, title, description, venue_template_id, open_date, end_date, active,
   poster_image_url, category, tags_json, runtime, age_rating, venue_address, subtitle,
   notices_json, identity_verification_json, cast_info, cancellation_policy_json,
   ticket_delivery_json, sections_json, organizer_json, created_at, updated_at)
VALUES
  -- event 1: G-Dragon WORLD TOUR POWER (KSPO DOME)
  (1, 1,
   'G-Dragon WORLD TOUR ''POWER''',
   '2026년 G-Dragon 첫 단독 월드투어. 퍼포먼스와 예술의 경계를 허무는 무대.',
   1, '2026-04-09', '2026-06-03', 1,
   '/artists/1/events/upcoming_gdragon-2026-mama.png',
   'CONCERT',
   '["HOT","PRE_SALE"]',
   '2시간 30분', '만 7세 이상 관람가',
   '서울특별시 송파구 올림픽로 424 KSPO DOME',
   'POWER WORLD TOUR 2026 IN SEOUL',
   '["공연 당일 티켓 수령 후 재입장 불가","공연장 내 음식물 반입 금지","사진 및 동영상 촬영 금지","공연 중 휴대전화 사용 제한"]',
   '["본인 명의 신분증 지참 필수","예매자 본인만 입장 가능","미성년자는 법정대리인 동의서 지참"]',
   'G-Dragon',
   '[{"period":"관람일 7일 전까지","fee":"취소 수수료 없음"},{"period":"관람일 6~3일 전","fee":"티켓 금액의 10%"},{"period":"관람일 2~1일 전","fee":"티켓 금액의 20%"},{"period":"관람 당일","fee":"환불 불가"}]',
   '["모바일 티켓 (QR 코드)","공연 당일 입장 시 QR 스캔 후 입장","분실 시 재발급 불가"]',
   '[{"code":"VIP","name":"VIP석","price":165000},{"code":"R","name":"R석","price":143000},{"code":"S","name":"S석","price":121000},{"code":"A","name":"A석","price":99000}]',
   '{"host":"YG Entertainment","manager":"YG Entertainment 공연사업부","contact":"02-2218-4600","email":"concert@yg-ent.com"}',
   '2026-01-10 00:00:00', '2026-01-10 00:00:00'),

  -- event 2: BTS YET TO COME IN CINEMAS (잠실종합운동장)
  (2, 2,
   'BTS YET TO COME IN CINEMAS',
   '전 세계 아미를 위한 BTS 2026 서울 앙코르 콘서트. 잠실 주경기장에서 만나는 역대급 무대.',
   2, '2026-05-24', '2026-08-03', 1,
   '/artists/2/events/event_bts-yet-to-come-in-cinema.png',
   'CONCERT',
   '["HOT"]',
   '3시간', '전체 관람가',
   '서울특별시 송파구 올림픽로 25 잠실종합운동장 주경기장',
   '2026 BTS CONCERT IN SEOUL',
   '["공연 당일 우천 시 우비 착용 권장","외부 음식물 반입 금지","대형 응원 도구 반입 금지 (공식 응원봉 허용)","공연장 주변 교통 혼잡 예상 — 대중교통 이용 권장"]',
   '["본인 명의 신분증 지참 필수","예매자 본인만 입장 가능"]',
   'BTS (RM, Jin, SUGA, j-hope, Jimin, V, Jung Kook)',
   '[{"period":"관람일 7일 전까지","fee":"취소 수수료 없음"},{"period":"관람일 6~3일 전","fee":"티켓 금액의 10%"},{"period":"관람일 2~1일 전","fee":"티켓 금액의 20%"},{"period":"관람 당일","fee":"환불 불가"}]',
   '["모바일 티켓 (QR 코드)"]',
   '[{"code":"VIP","name":"VIP석","price":165000},{"code":"R","name":"R석","price":143000},{"code":"S","name":"S석","price":121000},{"code":"A","name":"A석","price":99000}]',
   '{"host":"BIGHIT MUSIC","manager":"BIGHIT MUSIC 공연팀","contact":"02-6008-7000","email":"concert@bighitmusic.com"}',
   '2026-04-01 00:00:00', '2026-04-01 00:00:00'),

  -- event 3: BTS WORLD TOUR ARIRANG IN GOYANG (고양종합운동장)
  (3, 2,
   'BTS WORLD TOUR ARIRANG IN GOYANG',
   'BTS와 함께하는 아리랑 공연. 고양종합운동장에서 펼쳐지는 K-POP과 한국 전통의 만남.',
   5, '2026-02-14', '2026-04-12', 1,
   '/artists/2/events/event_bts-world-tour-arirang.png',
   'CONCERT',
   '["HOT","PRE_SALE"]',
   '2시간 50분', '전체 관람가',
   '경기도 고양시 일산서구 중앙로 1601 고양종합운동장 주경기장',
   'ARIRANG WORLD TOUR 2026',
   '["우천 시 공연 진행 (우비 지참 권장)","외부 음식물 반입 금지"]',
   '["본인 명의 신분증 지참 필수"]',
   'BTS (RM, Jin, SUGA, j-hope, Jimin, V, Jung Kook)',
   '[{"period":"관람일 7일 전까지","fee":"취소 수수료 없음"},{"period":"관람일 6~3일 전","fee":"티켓 금액의 10%"},{"period":"관람일 2~1일 전","fee":"티켓 금액의 20%"},{"period":"관람 당일","fee":"환불 불가"}]',
   '["모바일 티켓 (QR 코드)"]',
   '[{"code":"VIP","name":"VIP석","price":165000},{"code":"R","name":"R석","price":143000},{"code":"S","name":"S석","price":121000},{"code":"A","name":"A석","price":99000}]',
   '{"host":"BIGHIT MUSIC","manager":"BIGHIT MUSIC 공연팀","contact":"02-6008-7000","email":"concert@bighitmusic.com"}',
   '2025-12-01 00:00:00', '2025-12-01 00:00:00'),

  -- event 5: IVE WORLD TOUR SHOW WHAT I AM (KSPO DOME)
  (5, 4,
   'IVE WORLD TOUR SHOW WHAT I AM',
   'IVE의 첫 번째 월드투어. "SHOW WHAT I HAVE" 이후 더욱 성장한 IVE의 퍼포먼스.',
   1, '2026-04-22', '2026-06-22', 1,
   '/artists/4/events/event_ive-show-what-i-am.png',
   'CONCERT',
   '["HOT"]',
   '2시간 20분', '만 7세 이상 관람가',
   '서울특별시 송파구 올림픽로 424 KSPO DOME',
   'SHOW WHAT I AM WORLD TOUR 2026 IN SEOUL',
   '["공연 당일 입장 시 공식 응원봉만 허용","외부 음식물 반입 금지"]',
   '["본인 명의 신분증 지참 필수","예매자 본인만 입장 가능"]',
   'IVE (안유진, 가을, 레이, 리즈, 이서, 원영)',
   '[{"period":"관람일 7일 전까지","fee":"취소 수수료 없음"},{"period":"관람일 6~3일 전","fee":"티켓 금액의 10%"},{"period":"관람일 2~1일 전","fee":"티켓 금액의 20%"},{"period":"관람 당일","fee":"환불 불가"}]',
   '["모바일 티켓 (QR 코드)"]',
   '[{"code":"VIP","name":"VIP석","price":154000},{"code":"R","name":"R석","price":132000},{"code":"S","name":"S석","price":110000},{"code":"A","name":"A석","price":88000}]',
   '{"host":"Starship Entertainment","manager":"Starship Entertainment 공연팀","contact":"02-2275-5000","email":"concert@starship.co.kr"}',
   '2026-03-01 00:00:00', '2026-03-01 00:00:00'),

  -- event 6: IVE THE 1ST WORLD TOUR (KSPO DOME)
  (6, 4,
   'IVE THE 1ST WORLD TOUR',
   'IVE 첫 번째 단독 투어의 서울 공연. 화려한 무대 연출과 히트곡 메들리.',
   1, '2026-02-14', '2026-04-13', 1,
   '/artists/4/events/presale_ive-1st-world-tour.png',
   'CONCERT',
   '["PRE_SALE"]',
   '2시간 10분', '만 7세 이상 관람가',
   '서울특별시 송파구 올림픽로 424 KSPO DOME',
   'THE 1ST WORLD TOUR 2026',
   '["공연 당일 입장 시 공식 응원봉만 허용","외부 음식물 반입 금지"]',
   '["본인 명의 신분증 지참 필수"]',
   'IVE (안유진, 가을, 레이, 리즈, 이서, 원영)',
   '[{"period":"관람일 7일 전까지","fee":"취소 수수료 없음"},{"period":"관람일 6~3일 전","fee":"티켓 금액의 10%"},{"period":"관람일 2~1일 전","fee":"티켓 금액의 20%"},{"period":"관람 당일","fee":"환불 불가"}]',
   '["모바일 티켓 (QR 코드)"]',
   '[{"code":"VIP","name":"VIP석","price":154000},{"code":"R","name":"R석","price":132000},{"code":"S","name":"S석","price":110000},{"code":"A","name":"A석","price":88000}]',
   '{"host":"Starship Entertainment","manager":"Starship Entertainment 공연팀","contact":"02-2275-5000","email":"concert@starship.co.kr"}',
   '2025-12-01 00:00:00', '2025-12-01 00:00:00'),

  -- event 7: BLACKPINK BORN PINK WORLD TOUR (고척스카이돔)
  (7, 5,
   'BLACKPINK BORN PINK WORLD TOUR',
   'BLACKPINK의 BORN PINK 월드투어 서울 추가 공연. 고척스카이돔을 물들이는 핑크빛 무대.',
   4, '2026-05-17', '2026-07-16', 1,
   '/artists/5/events/event_blackpink-born-pink.png',
   'CONCERT',
   '["HOT"]',
   '2시간 40분', '만 7세 이상 관람가',
   '서울특별시 구로구 경인로 430 고척스카이돔',
   'BORN PINK WORLD TOUR 2026 IN SEOUL',
   '["우천 시 실내 공연으로 일정대로 진행","외부 음식물 반입 금지","공식 응원봉 외 대형 조명 도구 반입 금지"]',
   '["본인 명의 신분증 지참 필수","예매자 본인만 입장 가능"]',
   'BLACKPINK (지수, 제니, 로제, 리사)',
   '[{"period":"관람일 7일 전까지","fee":"취소 수수료 없음"},{"period":"관람일 6~3일 전","fee":"티켓 금액의 10%"},{"period":"관람일 2~1일 전","fee":"티켓 금액의 20%"},{"period":"관람 당일","fee":"환불 불가"}]',
   '["모바일 티켓 (QR 코드)"]',
   '[{"code":"VIP","name":"VIP석","price":165000},{"code":"R","name":"R석","price":143000},{"code":"S","name":"S석","price":121000},{"code":"A","name":"A석","price":99000}]',
   '{"host":"YG Entertainment","manager":"YG Entertainment 공연사업부","contact":"02-2218-4600","email":"concert@yg-ent.com"}',
   '2026-04-01 00:00:00', '2026-04-01 00:00:00'),

  -- event 8: Stray Kids DOMINANCE WORLD TOUR (고척스카이돔)
  (8, 6,
   'Stray Kids DOMINANCE WORLD TOUR',
   'Stray Kids DOMINANCE 월드투어 서울 공연. STAY를 위한 압도적인 퍼포먼스.',
   4, '2026-05-07', '2026-07-06', 1,
   '/artists/6/events/presale_straykids-dominance.png',
   'CONCERT',
   '["HOT","PRE_SALE"]',
   '2시간 30분', '만 7세 이상 관람가',
   '서울특별시 구로구 경인로 430 고척스카이돔',
   'DOMINANCE WORLD TOUR 2026 IN SEOUL',
   '["외부 음식물 반입 금지","공식 응원봉 허용 (배터리 포함 최대 2개)"]',
   '["본인 명의 신분증 지참 필수"]',
   'Stray Kids (방찬, 리노, 창빈, 현진, 한, 필릭스, 승민, 아이엔)',
   '[{"period":"관람일 7일 전까지","fee":"취소 수수료 없음"},{"period":"관람일 6~3일 전","fee":"티켓 금액의 10%"},{"period":"관람일 2~1일 전","fee":"티켓 금액의 20%"},{"period":"관람 당일","fee":"환불 불가"}]',
   '["모바일 티켓 (QR 코드)"]',
   '[{"code":"VIP","name":"VIP석","price":165000},{"code":"R","name":"R석","price":143000},{"code":"S","name":"S석","price":121000},{"code":"A","name":"A석","price":99000}]',
   '{"host":"JYP Entertainment","manager":"JYP Entertainment 공연팀","contact":"02-540-9670","email":"concert@jype.com"}',
   '2026-03-01 00:00:00', '2026-03-01 00:00:00'),

  -- event 9: SEVENTEEN WORLD TOUR (인천 아시아드)
  (9, 7,
   'SEVENTEEN WORLD TOUR',
   'SEVENTEEN의 글로벌 월드투어 서울 공연. 13인의 퍼포먼스가 인천을 채운다.',
   3, '2026-01-24', '2026-04-05', 1,
   '/artists/7/events/event_seventeen-be-the-sun.png',
   'CONCERT',
   '["HOT","PRE_SALE"]',
   '3시간', '전체 관람가',
   '인천광역시 서구 봉수대로 806 인천 아시아드 주경기장',
   'SEVENTEEN WORLD TOUR 2026',
   '["우천 시 공연 진행 (우비 지참 권장)","외부 음식물 반입 금지","대형 응원 도구 반입 금지"]',
   '["본인 명의 신분증 지참 필수","예매자 본인만 입장 가능"]',
   'SEVENTEEN (에스쿱스, 원우, 준, 호시, 승관, 우지, 도겸, 민규, 디에잇, 버논, 디노, 조슈아, 정한)',
   '[{"period":"관람일 7일 전까지","fee":"취소 수수료 없음"},{"period":"관람일 6~3일 전","fee":"티켓 금액의 10%"},{"period":"관람일 2~1일 전","fee":"티켓 금액의 20%"},{"period":"관람 당일","fee":"환불 불가"}]',
   '["모바일 티켓 (QR 코드)"]',
   '[{"code":"VIP","name":"VIP석","price":165000},{"code":"R","name":"R석","price":143000},{"code":"S","name":"S석","price":121000},{"code":"A","name":"A석","price":99000}]',
   '{"host":"PLEDIS Entertainment","manager":"PLEDIS Entertainment 공연팀","contact":"031-901-6700","email":"concert@pledis.co.kr"}',
   '2025-12-01 00:00:00', '2025-12-01 00:00:00'),

  -- event 10: SEVENTEEN FOLLOW AGAIN TOUR (인천 아시아드)
  (10, 7,
   'SEVENTEEN FOLLOW AGAIN TOUR',
   'SEVENTEEN의 FOLLOW 투어 후속 서울 추가 공연.',
   3, '2026-03-27', '2026-05-27', 1,
   '/artists/7/events/presale_seventeen-follow-again-tour.png',
   'CONCERT',
   '["PRE_SALE"]',
   '3시간', '전체 관람가',
   '인천광역시 서구 봉수대로 806 인천 아시아드 주경기장',
   'FOLLOW AGAIN TOUR 2026 IN SEOUL',
   '["우천 시 공연 진행","외부 음식물 반입 금지"]',
   '["본인 명의 신분증 지참 필수"]',
   'SEVENTEEN (에스쿱스, 원우, 준, 호시, 승관, 우지, 도겸, 민규, 디에잇, 버논, 디노, 조슈아, 정한)',
   '[{"period":"관람일 7일 전까지","fee":"취소 수수료 없음"},{"period":"관람일 6~3일 전","fee":"티켓 금액의 10%"},{"period":"관람일 2~1일 전","fee":"티켓 금액의 20%"},{"period":"관람 당일","fee":"환불 불가"}]',
   '["모바일 티켓 (QR 코드)"]',
   '[{"code":"VIP","name":"VIP석","price":165000},{"code":"R","name":"R석","price":143000},{"code":"S","name":"S석","price":121000},{"code":"A","name":"A석","price":99000}]',
   '{"host":"PLEDIS Entertainment","manager":"PLEDIS Entertainment 공연팀","contact":"031-901-6700","email":"concert@pledis.co.kr"}',
   '2026-02-01 00:00:00', '2026-02-01 00:00:00'),

  -- event 11: NewJeans × COMPLEXCON (Long Beach)
  (11, 8,
   'NewJeans × COMPLEXCON',
   'NewJeans와 COMPLEXCON이 함께하는 글로벌 페스티벌. 미국 롱비치에서 만나는 특별한 무대.',
   11, '2026-03-12', '2026-05-11', 1,
   '/artists/8/events/event_newjeans-complexcon.png',
   'FESTIVAL',
   '["NEW"]',
   '4시간', '전체 관람가',
   '300 E Ocean Blvd, Long Beach, CA 90802, USA',
   'COMPLEXCON LONG BEACH 2026',
   '["입장 시 신분증 확인","주류 구역은 21세 이상만 입장 가능"]',
   '["본인 명의 신분증 지참 필수"]',
   'NewJeans (민지, 하니, 다니엘, 해린, 혜인)',
   '[{"period":"관람일 14일 전까지","fee":"취소 수수료 없음"},{"period":"관람일 13~7일 전","fee":"티켓 금액의 10%"},{"period":"관람일 6~1일 전","fee":"티켓 금액의 30%"},{"period":"관람 당일","fee":"환불 불가"}]',
   '["모바일 티켓 (QR 코드)","현장 수령 불가"]',
   '[{"code":"VIP","name":"VIP Floor","price":220000},{"code":"R","name":"Floor","price":150000},{"code":"S","name":"Lower Bowl","price":110000},{"code":"A","name":"Upper Bowl","price":77000}]',
   '{"host":"ADOR / ComplexCon","manager":"ComplexCon Operations","contact":"+1-310-555-0100","email":"info@complexcon.com"}',
   '2026-01-15 00:00:00', '2026-01-15 00:00:00'),

  -- event 12: NewJeans Fan Meeting Bunnies Camp (올림픽공원 올림픽홀)
  (12, 8,
   'NewJeans Fan Meeting ''Bunnies Camp''',
   '버니즈를 위한 NewJeans 팬미팅. 캠프 콘셉트로 꾸며진 따뜻한 만남.',
   10, '2026-01-17', '2026-03-16', 1,
   '/artists/8/events/presale_newjeans-fan-meeting.png',
   'FANMEETING',
   '["NEW"]',
   '2시간', '전체 관람가',
   '서울특별시 송파구 올림픽로 424 올림픽공원 올림픽홀',
   'BUNNIES CAMP 2026',
   '["팬미팅 특성상 이벤트 구성이 달라질 수 있습니다","외부 음식물 반입 금지"]',
   '["본인 명의 신분증 지참 필수"]',
   'NewJeans (민지, 하니, 다니엘, 해린, 혜인)',
   '[{"period":"관람일 7일 전까지","fee":"취소 수수료 없음"},{"period":"관람일 6~3일 전","fee":"티켓 금액의 10%"},{"period":"관람일 2~1일 전","fee":"티켓 금액의 20%"},{"period":"관람 당일","fee":"환불 불가"}]',
   '["모바일 티켓 (QR 코드)"]',
   '[{"code":"VIP","name":"VIP석","price":110000},{"code":"R","name":"R석","price":88000},{"code":"S","name":"S석","price":66000},{"code":"A","name":"A석","price":55000}]',
   '{"host":"ADOR","manager":"ADOR 팬미팅팀","contact":"02-6008-7100","email":"fanmeeting@ador.kr"}',
   '2025-11-15 00:00:00', '2025-11-15 00:00:00'),

  -- event 13: (G)I-DLE WORLD TOUR iDOL (KSPO DOME)
  (13, 9,
   '(G)I-DLE WORLD TOUR ''iDOL''',
   '(G)I-DLE의 iDOL 월드투어. 자작곡으로 빚어낸 독보적인 무대.',
   1, '2026-02-22', '2026-04-21', 1,
   '/artists/9/events/presale_gi-dle-world-tour.png',
   'CONCERT',
   '["PRE_SALE"]',
   '2시간 20분', '만 7세 이상 관람가',
   '서울특별시 송파구 올림픽로 424 KSPO DOME',
   'iDOL WORLD TOUR 2026 IN SEOUL',
   '["외부 음식물 반입 금지","공식 응원봉 허용"]',
   '["본인 명의 신분증 지참 필수"]',
   '(G)I-DLE (미연, 민니, 소연, 우기, 슈화)',
   '[{"period":"관람일 7일 전까지","fee":"취소 수수료 없음"},{"period":"관람일 6~3일 전","fee":"티켓 금액의 10%"},{"period":"관람일 2~1일 전","fee":"티켓 금액의 20%"},{"period":"관람 당일","fee":"환불 불가"}]',
   '["모바일 티켓 (QR 코드)"]',
   '[{"code":"VIP","name":"VIP석","price":154000},{"code":"R","name":"R석","price":132000},{"code":"S","name":"S석","price":110000},{"code":"A","name":"A석","price":88000}]',
   '{"host":"CUBE Entertainment","manager":"CUBE Entertainment 공연팀","contact":"02-3497-1000","email":"concert@cubeent.co.kr"}',
   '2026-01-01 00:00:00', '2026-01-01 00:00:00'),

  -- event 14: TXT WORLD TOUR ACT PROMISE (KSPO DOME)
  (14, 10,
   'TXT WORLD TOUR ACT : PROMISE',
   'TXT의 ACT 시리즈 월드투어. MOA에게 전하는 약속의 무대.',
   1, '2026-04-12', '2026-06-12', 1,
   '/artists/10/events/presale_txt-world-tour.png',
   'CONCERT',
   '["PRE_SALE"]',
   '2시간 30분', '만 7세 이상 관람가',
   '서울특별시 송파구 올림픽로 424 KSPO DOME',
   'ACT : PROMISE WORLD TOUR 2026 IN SEOUL',
   '["외부 음식물 반입 금지","공식 응원봉 허용"]',
   '["본인 명의 신분증 지참 필수"]',
   'TXT (연준, 수빈, 범규, 태현, 휴닝카이)',
   '[{"period":"관람일 7일 전까지","fee":"취소 수수료 없음"},{"period":"관람일 6~3일 전","fee":"티켓 금액의 10%"},{"period":"관람일 2~1일 전","fee":"티켓 금액의 20%"},{"period":"관람 당일","fee":"환불 불가"}]',
   '["모바일 티켓 (QR 코드)"]',
   '[{"code":"VIP","name":"VIP석","price":154000},{"code":"R","name":"R석","price":132000},{"code":"S","name":"S석","price":110000},{"code":"A","name":"A석","price":88000}]',
   '{"host":"BIGHIT MUSIC","manager":"BIGHIT MUSIC 공연팀","contact":"02-6008-7000","email":"concert@bighitmusic.com"}',
   '2026-02-15 00:00:00', '2026-02-15 00:00:00'),

  -- event 15: DAY6 10th Anniversary Tour (광주 김대중컨벤션센터)
  (15, 11,
   'DAY6 10th Anniversary Tour',
   'DAY6 데뷔 10주년 기념 전국 투어. 밴드의 10년을 기억하는 팬들을 위한 특별한 무대.',
   12, '2026-01-16', '2026-03-15', 1,
   '/artists/11/events/event_day6-10th-anniversary-tour.png',
   'CONCERT',
   '["NEW"]',
   '2시간 30분', '전체 관람가',
   '광주광역시 서구 상무누리로 30 김대중컨벤션센터 A-C홀',
   '10TH ANNIVERSARY TOUR 2026 IN GWANGJU',
   '["공연 당일 티켓 수령 후 재입장 불가","외부 음식물 반입 금지"]',
   '["본인 명의 신분증 지참 필수"]',
   'DAY6 (성진, 영K, 원필, 도운, 원진)',
   '[{"period":"관람일 7일 전까지","fee":"취소 수수료 없음"},{"period":"관람일 6~3일 전","fee":"티켓 금액의 10%"},{"period":"관람일 2~1일 전","fee":"티켓 금액의 20%"},{"period":"관람 당일","fee":"환불 불가"}]',
   '["모바일 티켓 (QR 코드)"]',
   '[{"code":"VIP","name":"VIP석","price":110000},{"code":"R","name":"R석","price":88000},{"code":"S","name":"S석","price":66000},{"code":"A","name":"A석","price":55000}]',
   '{"host":"JYP Entertainment","manager":"JYP Entertainment 공연팀","contact":"02-540-9670","email":"concert@jype.com"}',
   '2025-12-01 00:00:00', '2025-12-01 00:00:00');


-- ──────────────────────────────────────────────────────────────
-- 5. shows
-- sale_open_at: LIGHTNING 선예매 시작 (= MIST 오픈 - 2940분)
-- sale_close_at: 공연 전날 23:59:59
-- status: 공연일이 2026-04-07 이전이면 CLOSED, 이후면 OPEN
-- seatmap_json: 구역별 잔여 현황 스냅샷
-- ──────────────────────────────────────────────────────────────
INSERT INTO shows
(id, event_id, session_no, start_at, end_at, capacity, active, sale_open_at, sale_close_at, status, seatmap_json, seatmap_version, created_at, updated_at)
SELECT s.id, s.event_id, s.session_no, s.start_at, s.end_at, 14693, 1,
       s.sale_open_at, s.sale_close_at, 'OPEN', vt.seatmap_json, 1,
       '2026-04-09 00:00:00', '2026-04-09 00:00:00'
FROM (
  SELECT 101 AS id, 1 AS event_id, 1 AS session_no, '2026-07-20 18:00:00' AS start_at, '2026-07-20 20:30:00' AS end_at, '2026-04-10 12:00:00' AS sale_open_at, '2026-07-19 23:59:59' AS sale_close_at
  UNION ALL SELECT 102, 1, 2, '2026-07-21 18:00:00', '2026-07-21 20:30:00', '2026-04-10 12:00:00', '2026-07-20 23:59:59'
  UNION ALL SELECT 103, 1, 3, '2026-07-22 18:00:00', '2026-07-22 20:30:00', '2026-04-10 12:00:00', '2026-07-21 23:59:59'
  UNION ALL SELECT 201, 2, 1, '2026-08-01 18:00:00', '2026-08-01 20:40:00', '2026-04-15 12:00:00', '2026-07-31 23:59:59'
  UNION ALL SELECT 202, 2, 2, '2026-08-02 18:00:00', '2026-08-02 20:40:00', '2026-04-15 12:00:00', '2026-08-01 23:59:59'
  UNION ALL SELECT 203, 2, 3, '2026-08-03 18:00:00', '2026-08-03 20:40:00', '2026-04-15 12:00:00', '2026-08-02 23:59:59'
  UNION ALL SELECT 301, 3, 1, '2026-08-10 18:00:00', '2026-08-10 20:20:00', '2026-04-18 12:00:00', '2026-08-09 23:59:59'
  UNION ALL SELECT 302, 3, 2, '2026-08-11 18:00:00', '2026-08-11 20:20:00', '2026-04-18 12:00:00', '2026-08-10 23:59:59'
  UNION ALL SELECT 303, 3, 3, '2026-08-12 18:00:00', '2026-08-12 20:20:00', '2026-04-18 12:00:00', '2026-08-11 23:59:59'
  UNION ALL SELECT 401, 4, 1, '2026-09-05 18:00:00', '2026-09-05 20:15:00', '2026-04-20 12:00:00', '2026-09-04 23:59:59'
  UNION ALL SELECT 402, 4, 2, '2026-09-06 18:00:00', '2026-09-06 20:15:00', '2026-04-20 12:00:00', '2026-09-05 23:59:59'
  UNION ALL SELECT 403, 4, 3, '2026-09-07 18:00:00', '2026-09-07 20:15:00', '2026-04-20 12:00:00', '2026-09-06 23:59:59'
  UNION ALL SELECT 501, 5, 1, '2026-09-20 18:00:00', '2026-09-20 20:35:00', '2026-04-22 12:00:00', '2026-09-19 23:59:59'
  UNION ALL SELECT 502, 5, 2, '2026-09-21 18:00:00', '2026-09-21 20:35:00', '2026-04-22 12:00:00', '2026-09-20 23:59:59'
  UNION ALL SELECT 503, 5, 3, '2026-09-22 18:00:00', '2026-09-22 20:35:00', '2026-04-22 12:00:00', '2026-09-21 23:59:59'
) s
JOIN venue_templates vt ON vt.id = 1;

-- ──────────────────────────────────────────────────────────────
-- 6. show_section_policies
-- 각 show당 VIP / R / S / A 4개 구역 (display_order 1~4)
-- color: VIP=#FF5E32, R=#1F2792, S=#4A90D9, A=#6DBE6B
-- ──────────────────────────────────────────────────────────────
INSERT INTO show_section_policies
(id, show_id, code, name, price, color, display_order, active, created_at, updated_at)
SELECT
  ((show_info.show_id * 10) + tier_info.display_order) AS id,
  show_info.show_id,
  tier_info.code,
  tier_info.code,
  CASE tier_info.code
    WHEN 'VIP' THEN show_info.vip_price
    WHEN 'S' THEN show_info.s_price
    WHEN 'R' THEN show_info.r_price
    ELSE show_info.a_price
  END AS price,
  tier_info.color,
  tier_info.display_order,
  1,
  '2026-04-09 00:00:00',
  '2026-04-09 00:00:00'
FROM (
  SELECT 101 AS show_id, 165000 AS vip_price, 132000 AS s_price, 121000 AS r_price, 99000 AS a_price
  UNION ALL SELECT 102, 165000, 132000, 121000, 99000
  UNION ALL SELECT 103, 165000, 132000, 121000, 99000
  UNION ALL SELECT 201, 189000, 154000, 132000, 110000
  UNION ALL SELECT 202, 189000, 154000, 132000, 110000
  UNION ALL SELECT 203, 189000, 154000, 132000, 110000
  UNION ALL SELECT 301, 176000, 143000, 126000, 104000
  UNION ALL SELECT 302, 176000, 143000, 126000, 104000
  UNION ALL SELECT 303, 176000, 143000, 126000, 104000
  UNION ALL SELECT 401, 171000, 139000, 123000, 101000
  UNION ALL SELECT 402, 171000, 139000, 123000, 101000
  UNION ALL SELECT 403, 171000, 139000, 123000, 101000
  UNION ALL SELECT 501, 192000, 158000, 136000, 113000
  UNION ALL SELECT 502, 192000, 158000, 136000, 113000
  UNION ALL SELECT 503, 192000, 158000, 136000, 113000
) show_info
JOIN (
  SELECT 'VIP' AS code, '#FF5E32' AS color, 1 AS display_order
  UNION ALL SELECT 'S', '#4A90D9', 2
  UNION ALL SELECT 'R', '#1F2792', 3
  UNION ALL SELECT 'A', '#6DBE6B', 4
) tier_info;


-- ──────────────────────────────────────────────────────────────
-- 7. artist_follows
-- mockUser (user_id=1) → artists 1, 2, 3, 4 팔로우
-- ──────────────────────────────────────────────────────────────
-- INSERT INTO artist_follows
--   (id, artist_id, user_id, created_at, updated_at)
-- VALUES
--   (1, 1, 1, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
--   (2, 2, 1, '2025-03-20 00:00:00', '2025-03-20 00:00:00'),
--   (3, 3, 1, '2025-06-01 00:00:00', '2025-06-01 00:00:00'),
--   (4, 4, 1, '2025-08-10 00:00:00', '2025-08-10 00:00:00');


-- ──────────────────────────────────────────────────────────────
-- 8. artist_memberships
-- mockUser (user_id=1) 멤버십 내역
-- BaseTimeEntity 미적용 → created_at / updated_at 컬럼 없음
-- pending_expires_at: 결제 완료된 멤버십은 의미 없지만 NOT NULL 이므로 가입 시각 +30분으로 설정
-- ──────────────────────────────────────────────────────────────
INSERT INTO artist_memberships
(id, artist_id, user_id, nickname, tier, status, order_id, payment_id, pending_expires_at, start_date, end_date)

VALUES
(1, 1, 1, '지디사랑해', 'LIGHTNING', 'ACTIVE', 'ORD-GD-2025-0001', 'PAY-GD-2025-0001', '2025-01-15 00:30:00', '2025-01-15', '2026-12-31'),
(2, 2, 1, '보라해아미', 'THUNDER', 'EXPIRED', 'ORD-BTS-2025-0042', 'PAY-BTS-2025-0042', '2025-03-20 00:30:00', '2025-03-20', '2026-06-30'),
(3, 3, 1, '마이윈터', 'CLOUD', 'ACTIVE', 'ORD-AE-2025-0128', 'PAY-AE-2025-0128', '2025-06-01 00:30:00', '2025-06-01', '2026-09-15'),
(4, 4, 1, '아이브최고', 'MIST', 'EXPIRED', 'ORD-IVE-2025-0085', 'PAY-IVE-2025-0085', '2025-08-10 00:30:00', '2025-08-10', '2026-08-10');
