-- Docker Compose 초기 데이터 (MySQL)
-- URR Event Service Seed Data (MySQL)
-- Generated: 2026-04-09
-- Updated: 2026-04-11
-- NOTE: Spring Boot src/main/resources/data.sql 에서 실행되므로 CREATE DATABASE / USE 는 포함하지 않음

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE artist_follows;
TRUNCATE TABLE show_section_policies;
TRUNCATE TABLE shows;
TRUNCATE TABLE events;
TRUNCATE TABLE artist_memberships;
TRUNCATE TABLE membership_policies;
TRUNCATE TABLE venue_templates;
TRUNCATE TABLE artists;

SET FOREIGN_KEY_CHECKS = 1;

-- 1) artists
INSERT INTO artists
(id, name, profile_image_url, description, bio, banner_image_url, category, created_at, updated_at)
VALUES
    (1, 'G-Dragon', '/artists/1/profile.png', 'BIGBANG 리더이자 솔로 아티스트. K-POP의 아이콘.', 'BIGBANG 리더이자 솔로 아티스트. K-POP의 아이콘.', '/artists/1/banner.png', 'SOLO', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
    (2, 'BTS', '/artists/2/profile.png', '글로벌 K-POP 보이그룹. 전 세계를 사로잡은 음악과 메시지.', '글로벌 K-POP 보이그룹. 전 세계를 사로잡은 음악과 메시지.', '/artists/2/banner.png', 'BOYGROUP', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
    (3, 'aespa', '/artists/3/profile.png', 'SM Entertainment 4인조 걸그룹. 메타버스 세계관의 선두주자.', 'SM Entertainment 4인조 걸그룹. 메타버스 세계관의 선두주자.', '/artists/3/banner.png', 'GIRLGROUP', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
    (4, 'IVE', '/artists/4/profile.png', 'Starship Entertainment 6인조 걸그룹. 나를 당당하게 표현하는 음악.', 'Starship Entertainment 6인조 걸그룹. 나를 당당하게 표현하는 음악.', '/artists/4/banner.jpeg', 'GIRLGROUP', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
    (5, 'BLACKPINK', '/artists/5/profile.png', 'YG Entertainment 글로벌 걸그룹. 음악, 패션, 퍼포먼스의 완성형.', 'YG Entertainment 글로벌 걸그룹. 음악, 패션, 퍼포먼스의 완성형.', '/artists/5/banner.png', 'GIRLGROUP', '2025-01-01 00:00:00', '2025-01-01 00:00:00');

/*-- 2) venue_templates
INSERT INTO venue_templates
(id, name, seatmap_json, base_capacity, active, created_at, updated_at)
VALUES
(1, 'KSPO DOME',
 '{"sections":[{"code":"VIP","name":"VIP석","sectionCount":3,"rowsPerSection":23,"seatsPerRow":29,"capacity":2001},{"code":"R","name":"R석","sectionCount":7,"rowsPerSection":27,"seatsPerRow":28,"capacity":5292},{"code":"S","name":"S석","sectionCount":8,"rowsPerSection":25,"seatsPerRow":22,"capacity":4400},{"code":"A","name":"A석","sectionCount":20,"rowsPerSection":10,"seatsPerRow":15,"capacity":3000}]}',
 14693, 1, '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
(2, '잠실종합운동장 주경기장',
 '{"sections":[{"code":"VIP","name":"VIP석","sectionCount":4,"rowsPerSection":20,"seatsPerRow":30,"capacity":2400},{"code":"R","name":"R석","sectionCount":10,"rowsPerSection":30,"seatsPerRow":35,"capacity":10500},{"code":"S","name":"S석","sectionCount":12,"rowsPerSection":30,"seatsPerRow":40,"capacity":14400},{"code":"A","name":"A석","sectionCount":16,"rowsPerSection":20,"seatsPerRow":30,"capacity":9600}]}',
 46900, 1, '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
(3, '인천 아시아드 주경기장',
 '{"sections":[{"code":"VIP","name":"VIP석","sectionCount":3,"rowsPerSection":18,"seatsPerRow":28,"capacity":1512},{"code":"R","name":"R석","sectionCount":8,"rowsPerSection":25,"seatsPerRow":32,"capacity":6400},{"code":"S","name":"S석","sectionCount":10,"rowsPerSection":25,"seatsPerRow":35,"capacity":8750},{"code":"A","name":"A석","sectionCount":12,"rowsPerSection":18,"seatsPerRow":28,"capacity":6048}]}',
 22710, 1, '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
(4, '고척스카이돔',
 '{"sections":[{"code":"VIP","name":"VIP석","sectionCount":3,"rowsPerSection":20,"seatsPerRow":28,"capacity":1680},{"code":"R","name":"R석","sectionCount":7,"rowsPerSection":24,"seatsPerRow":28,"capacity":4704},{"code":"S","name":"S석","sectionCount":8,"rowsPerSection":22,"seatsPerRow":26,"capacity":4576},{"code":"A","name":"A석","sectionCount":10,"rowsPerSection":15,"seatsPerRow":20,"capacity":3000}]}',
 13960, 1, '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
(5, '고양종합운동장 주경기장',
 '{"sections":[{"code":"VIP","name":"VIP석","sectionCount":4,"rowsPerSection":18,"seatsPerRow":28,"capacity":2016},{"code":"R","name":"R석","sectionCount":8,"rowsPerSection":26,"seatsPerRow":32,"capacity":6656},{"code":"S","name":"S석","sectionCount":12,"rowsPerSection":28,"seatsPerRow":38,"capacity":12768},{"code":"A","name":"A석","sectionCount":14,"rowsPerSection":20,"seatsPerRow":28,"capacity":7840}]}',
 29280, 1, '2025-01-01 00:00:00', '2025-01-01 00:00:00');*/

-- 2) membership_policies
INSERT INTO membership_policies
(id, artist_id, tier, presale_offset_minutes, booking_fee_won, created_at, updated_at)
VALUES
(1, 1, 'LIGHTNING', 2940, 0, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(2, 1, 'THUNDER', 2880, 3000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(3, 1, 'CLOUD', 60, 5000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(4, 1, 'MIST', 0, 8000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(5, 2, 'LIGHTNING', 2940, 0, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(6, 2, 'THUNDER', 2880, 3000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(7, 2, 'CLOUD', 60, 5000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(8, 2, 'MIST', 0, 8000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(9, 3, 'LIGHTNING', 2940, 0, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(10, 3, 'THUNDER', 2880, 3000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(11, 3, 'CLOUD', 60, 5000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(12, 3, 'MIST', 0, 8000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(13, 4, 'LIGHTNING', 2940, 0, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(14, 4, 'THUNDER', 2880, 3000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(15, 4, 'CLOUD', 60, 5000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(16, 4, 'MIST', 0, 8000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(17, 5, 'LIGHTNING', 2940, 0, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(18, 5, 'THUNDER', 2880, 3000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(19, 5, 'CLOUD', 60, 5000, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(20, 5, 'MIST', 0, 8000, '2025-01-15 00:00:00', '2025-01-15 00:00:00');



-- Minimal seed SQL for zoned template + show/session with per-section pricing policies
-- Updated: 2026-04-09

-- 3) venue template (minimal + VIP2)
INSERT INTO venue_templates
(id, name, seatmap_json, base_capacity, active, created_at, updated_at)
VALUES
(1, 'KSPO DOME', '{"venueTemplateName":"URR KSPO DOME STYLE V2","version":1,"tiers":[{"tierCode":"VIP","zones":[{"zoneNo":1,"rowStart":"1","rowEnd":"23","colStart":1,"colEnd":29},{"zoneNo":2,"rowStart":"1","rowEnd":"23","colStart":1,"colEnd":29},{"zoneNo":3,"rowStart":"1","rowEnd":"23","colStart":1,"colEnd":29}]},{"tierCode":"S","zones":[{"zoneNo":1,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"zoneNo":2,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"zoneNo":3,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"zoneNo":4,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"zoneNo":5,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"zoneNo":6,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"zoneNo":7,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"zoneNo":8,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22}]},{"tierCode":"R","zones":[{"zoneNo":1,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"zoneNo":2,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"zoneNo":3,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"zoneNo":4,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"zoneNo":5,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"zoneNo":6,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"zoneNo":7,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28}]},{"tierCode":"A","zones":[{"zoneNo":1,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":2,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":3,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":4,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":5,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":6,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":7,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":8,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":9,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":10,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":11,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":12,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":13,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":14,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":15,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":16,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":17,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":18,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":19,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"zoneNo":20,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15}]}],"sections":[{"name":"VIP1","tier":"VIP","zoneNo":1,"rowStart":"1","rowEnd":"23","colStart":1,"colEnd":29},{"name":"VIP2","tier":"VIP","zoneNo":2,"rowStart":"1","rowEnd":"23","colStart":1,"colEnd":29},{"name":"VIP3","tier":"VIP","zoneNo":3,"rowStart":"1","rowEnd":"23","colStart":1,"colEnd":29},{"name":"S1","tier":"S","zoneNo":1,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"name":"S2","tier":"S","zoneNo":2,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"name":"S3","tier":"S","zoneNo":3,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"name":"S4","tier":"S","zoneNo":4,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"name":"S5","tier":"S","zoneNo":5,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"name":"S6","tier":"S","zoneNo":6,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"name":"S7","tier":"S","zoneNo":7,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"name":"S8","tier":"S","zoneNo":8,"rowStart":"1","rowEnd":"25","colStart":1,"colEnd":22},{"name":"R1","tier":"R","zoneNo":1,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"name":"R2","tier":"R","zoneNo":2,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"name":"R3","tier":"R","zoneNo":3,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"name":"R4","tier":"R","zoneNo":4,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"name":"R5","tier":"R","zoneNo":5,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"name":"R6","tier":"R","zoneNo":6,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"name":"R7","tier":"R","zoneNo":7,"rowStart":"1","rowEnd":"27","colStart":1,"colEnd":28},{"name":"A1","tier":"A","zoneNo":1,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A2","tier":"A","zoneNo":2,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A3","tier":"A","zoneNo":3,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A4","tier":"A","zoneNo":4,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A5","tier":"A","zoneNo":5,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A6","tier":"A","zoneNo":6,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A7","tier":"A","zoneNo":7,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A8","tier":"A","zoneNo":8,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A9","tier":"A","zoneNo":9,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A10","tier":"A","zoneNo":10,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A11","tier":"A","zoneNo":11,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A12","tier":"A","zoneNo":12,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A13","tier":"A","zoneNo":13,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A14","tier":"A","zoneNo":14,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A15","tier":"A","zoneNo":15,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A16","tier":"A","zoneNo":16,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A17","tier":"A","zoneNo":17,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A18","tier":"A","zoneNo":18,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A19","tier":"A","zoneNo":19,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15},{"name":"A20","tier":"A","zoneNo":20,"rowStart":"1","rowEnd":"10","colStart":1,"colEnd":15}]}', 14693, 1, '2026-04-09 00:00:00', '2026-04-09 00:00:00');

-- 4) event created from the minimal template
INSERT INTO events
(id, artist_id, title, description, venue_template_id, open_date, end_date, active,
 poster_image_url, category, tags_json, runtime, age_rating, venue_address, subtitle,
 notices_json, identity_verification_json, cast_info, cancellation_policy_json,
 ticket_delivery_json, sections_json, organizer_json, created_at, updated_at)
VALUES
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
(2, 2,
   'BTS YET TO COME IN CINEMAS',
   '전 세계 아미를 위한 BTS 2026 서울 앙코르 콘서트. 잠실 주경기장에서 만나는 역대급 무대.',
   1, '2026-05-24', '2026-08-03', 1,
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
(3, 2,
   'BTS WORLD TOUR ARIRANG IN GOYANG',
   'BTS와 함께하는 아리랑 공연. 고양종합운동장에서 펼쳐지는 K-POP과 한국 전통의 만남.',
   1, '2026-02-14', '2026-04-12', 1,
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
(4, 4,
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
(5, 5,
   'BLACKPINK BORN PINK WORLD TOUR',
   'BLACKPINK의 BORN PINK 월드투어 서울 추가 공연. 고척스카이돔을 물들이는 핑크빛 무대.',
   1, '2026-05-17', '2026-07-16', 1,
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
   '2026-04-01 00:00:00', '2026-04-01 00:00:00');

-- 5) show/session created from the template response seatmap
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

-- 6) section policies generated from sectionPolicies (minimal)
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

-- 7) artist_follows
INSERT INTO artist_follows
(id, artist_id, user_id, created_at, updated_at)
VALUES
(1, 1, 1, '2025-01-15 00:00:00', '2025-01-15 00:00:00'),
(2, 2, 1, '2025-03-20 00:00:00', '2025-03-20 00:00:00'),
(3, 3, 1, '2025-06-01 00:00:00', '2025-06-01 00:00:00'),
(4, 4, 1, '2025-08-10 00:00:00', '2025-08-10 00:00:00');

-- 8) artist_memberships (BaseTimeEntity 미적용)
INSERT INTO artist_memberships
(id, artist_id, user_id, nickname, tier, status, order_id, payment_id, pending_expires_at, start_date, end_date)

VALUES
(1, 1, 1, '지디사랑해', 'LIGHTNING', 'ACTIVE', 'ORD-GD-2025-0001', 'PAY-GD-2025-0001', '2025-01-15 00:30:00', '2025-01-15', '2026-12-31'),
(2, 2, 1, '보라해아미', 'THUNDER', 'EXPIRED', 'ORD-BTS-2025-0042', 'PAY-BTS-2025-0042', '2025-03-20 00:30:00', '2025-03-20', '2026-06-30'),
(3, 3, 1, '마이윈터', 'CLOUD', 'ACTIVE', 'ORD-AE-2025-0128', 'PAY-AE-2025-0128', '2025-06-01 00:30:00', '2025-06-01', '2026-09-15'),
(4, 4, 1, '아이브최고', 'MIST', 'EXPIRED', 'ORD-IVE-2025-0085', 'PAY-IVE-2025-0085', '2025-08-10 00:30:00', '2025-08-10', '2026-08-10');
