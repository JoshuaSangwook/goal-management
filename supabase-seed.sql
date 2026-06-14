-- Supabase Seed Data for Goal Management System
-- Run this AFTER the migration SQL
-- This inserts initial data: mission, vision, core values, goal areas, and goal items

-- ===== MISSION & VISION =====
-- Mission
INSERT INTO "mission_visions" ("id", "type", "title", "content", "subtitle")
VALUES ('mission-1', 'MISSION', '나눔 코칭', '말씀을 행하는 자가 되고, 듣기만 하여 자신을 속이는 자가 되지 말라', '야고보서 1:22')
ON CONFLICT ("id") DO NOTHING;

-- Vision
INSERT INTO "mission_visions" ("id", "type", "title", "content", "subtitle")
VALUES ('vision-1', 'VISION', '비전', '1년에 10회 이상 난민학교에서 어성경 강의로 청소년들이 말씀을 읽을 수 있도록 돕는다', '영어로 된 강의안을 잘 만들고 외워서 강의하는 어성경 전문강사가 된다')
ON CONFLICT ("id") DO NOTHING;

-- ===== CORE VALUES =====
INSERT INTO "core_values" ("id", "title", "description", "icon", "verse", "order") VALUES
('cv-1', '정직', '거짓을 버리고 각각 그 이웃으로 더불어 참된 것을 말하기', 'Shield', '엡 4:25', 1),
('cv-2', '충성', '빠짐없는 일별 체크와 연속 달성', 'HeartHandshake', '고전 4:2', 2),
('cv-3', '온유함', '미달성 시 비난 없는 중립적 피드백', 'Feather', '빌 4:5', 3),
('cv-4', '기록', '달려가면서도 읽을 수 있게 — 모바일 친화적 체크 UI', 'BookOpen', '합 2:2', 4),
('cv-5', '변화', '이전 달 대비 변화량 시각화', 'TrendingUp', '사 43:19', 5),
('cv-6', '성장', '누적 달성률 트렌드 그래프', 'LineChart', '골 2:7', 6)
ON CONFLICT ("id") DO NOTHING;

-- ===== GOAL AREA INFOS =====
-- First create area info records
INSERT INTO "goal_area_infos" ("id", "area", "goal", "target", "strategy") VALUES
('area-intellectual', 'INTELLECTUAL', '배우고 행하고 가르치기', '난민학교 강의', '눅 2:52 — 예수는 지혜와 키가 자라며 하나님과 사람에게 더 사랑스러워지셨다'),
('area-spiritual', 'SPIRITUAL', '하나님과 친밀해지는 시간, 성령님의 음성 듣기', '말씀 묵상, 찬양, 기도', '막 1:35 — 새벽 미명에 예수께 일어나 나 한적한 곳으로 가사 기도하시다'),
('area-physical', 'PHYSICAL', '몸도 마음도 영도 짱인 삶', '코어 운동, 걷기/달리기', '고전 9:24-27 — 이기기 위하여 내 몸을 쳐 복종하게 하노라'),
('area-social', 'SOCIAL', '교회 공동체 (목장, 청소년부)', '목장 예배, 청소년부, 난민학교', '행 2:42 — 사도들의 가르침을 받아 교제하기를 힘쓰라')
ON CONFLICT ("area") DO NOTHING;

-- ===== GOAL ITEMS =====
-- 지적 (INTELLECTUAL)
INSERT INTO "goal_items" ("id", "code", "area", "title", "description", "period", "defaultTarget", "targetUnit", "monthlyTarget", "yearlyTarget", "active", "order", "areaId") VALUES
('item-4-1-1', '4.1.1', 'INTELLECTUAL', '유튜브 채널 듣기 + 추천 책 읽고 독후감 작성', NULL, 'DAILY', 1, '회/일', 30, 365, true, 1, 'area-intellectual'),
('item-4-1-2', '4.1.2', 'INTELLECTUAL', '어성경 강의안 한국어·영어 정리 및 업데이트', NULL, 'WEEKLY', 1, '회/주', 4, 52, true, 2, 'area-intellectual')
ON CONFLICT ("code") DO NOTHING;

-- 영적 (SPIRITUAL)
INSERT INTO "goal_items" ("id", "code", "area", "title", "description", "period", "defaultTarget", "targetUnit", "monthlyTarget", "yearlyTarget", "active", "order", "areaId") VALUES
('item-4-2-1', '4.2.1', 'SPIRITUAL', '아침 큐티(말씀묵상) 후 가족·목장 단체톡 공유', NULL, 'DAILY', 1, '회/일 (월 30회, 연 365회)', 30, 365, true, 3, 'area-spiritual'),
('item-4-2-2', '4.2.2', 'SPIRITUAL', '찬양 듣기', NULL, 'DAILY', 1, '곡/일 (월 30곡, 연 365곡)', 30, 365, true, 4, 'area-spiritual'),
('item-4-2-3', '4.2.3', 'SPIRITUAL', '성경 듣기', NULL, 'DAILY', 5, '장/일 (월 140장, 연 1680장)', 140, 1680, true, 5, 'area-spiritual'),
('item-4-2-4', '4.2.4', 'SPIRITUAL', '중보기도문 읽고 기도하기', NULL, 'DAILY', 1, '회/일 (월 30회, 연 365회)', 30, 365, true, 6, 'area-spiritual')
ON CONFLICT ("code") DO NOTHING;

-- 신체 (PHYSICAL)
INSERT INTO "goal_items" ("id", "code", "area", "title", "description", "period", "defaultTarget", "targetUnit", "monthlyTarget", "yearlyTarget", "active", "order", "areaId") VALUES
('item-4-3-1', '4.3.1', 'PHYSICAL', '코어 힘주기 + 바른 자세 유지 (앉기/서기)', NULL, 'DAILY', 1, '회/일 (의식적 체크)', 30, 365, true, 7, 'area-physical'),
('item-4-3-2', '4.3.2', 'PHYSICAL', '12km 완주', NULL, 'MONTHLY', 1, '회/월', 1, 12, true, 8, 'area-physical'),
('item-4-3-3', '4.3.3', 'PHYSICAL', '골프 라운딩 (유산소)', NULL, 'WEEKLY', 3, '회 이상/주', 12, 144, true, 9, 'area-physical')
ON CONFLICT ("code") DO NOTHING;

-- 사회 (SOCIAL)
INSERT INTO "goal_items" ("id", "code", "area", "title", "description", "period", "defaultTarget", "targetUnit", "monthlyTarget", "yearlyTarget", "active", "order", "areaId") VALUES
('item-4-4-1', '4.4.1', 'SOCIAL', '목장예배 + 목원과 말씀 나눔 + 식사', NULL, 'MONTHLY', 2, '회 이상/월', 2, 24, true, 10, 'area-social'),
('item-4-4-2', '4.4.2', 'SOCIAL', '청소년부 선생님·학생과 교제 및 중보기도', NULL, 'WEEKLY', 1, '회/주', 4, 52, true, 11, 'area-social'),
('item-4-4-3', '4.4.3', 'SOCIAL', '난민학교 강의 (MIKS 8회, TOUCH 2회)', NULL, 'YEARLY', 10, '회 이상/년', 0, 10, true, 12, 'area-social'),
('item-4-4-4', '4.4.4', 'SOCIAL', '남편과 미·고·사·축 말하기', NULL, 'WEEKLY', 1, '회 이상/주', 4, 52, true, 13, 'area-social')
ON CONFLICT ("code") DO NOTHING;
