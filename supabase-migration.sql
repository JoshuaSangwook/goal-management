-- Supabase Migration SQL for Goal Management System
-- Run this in Supabase SQL Editor

-- Users Table
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Mission Visions Table
CREATE TABLE IF NOT EXISTS "mission_visions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "subtitle" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Core Values Table
CREATE TABLE IF NOT EXISTS "core_values" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "verse" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Goal Area Infos Table
CREATE TABLE IF NOT EXISTS "goal_area_infos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "area" TEXT NOT NULL UNIQUE,
    "goal" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "strategy" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Goal Items Table
CREATE TABLE IF NOT EXISTS "goal_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "area" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "period" TEXT NOT NULL,
    "defaultTarget" INTEGER NOT NULL,
    "targetUnit" TEXT NOT NULL,
    "monthlyTarget" INTEGER NOT NULL DEFAULT 0,
    "yearlyTarget" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL,
    "areaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("areaId") REFERENCES "goal_area_infos"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Personal Targets Table
CREATE TABLE IF NOT EXISTS "personal_targets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "goalItemId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "target" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("goalItemId") REFERENCES "goal_items"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE("userId", "goalItemId", "year", "month")
);

-- Check Records Table
CREATE TABLE IF NOT EXISTS "check_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "goalItemId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("goalItemId") REFERENCES "goal_items"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE("userId", "goalItemId", "date")
);

-- Target Histories Table
CREATE TABLE IF NOT EXISTS "target_histories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "goalItemId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "oldTarget" INTEGER NOT NULL,
    "newTarget" INTEGER NOT NULL,
    "changedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS "check_records_userId_date_idx" ON "check_records"("userId", "date");

-- Function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updatedAt
DROP TRIGGER IF EXISTS update_users_updated_at ON "users";
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mission_visions_updated_at ON "mission_visions";
CREATE TRIGGER update_mission_visions_updated_at BEFORE UPDATE ON "mission_visions"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_core_values_updated_at ON "core_values";
CREATE TRIGGER update_core_values_updated_at BEFORE UPDATE ON "core_values"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_goal_area_infos_updated_at ON "goal_area_infos";
CREATE TRIGGER update_goal_area_infos_updated_at BEFORE UPDATE ON "goal_area_infos"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_goal_items_updated_at ON "goal_items";
CREATE TRIGGER update_goal_items_updated_at BEFORE UPDATE ON "goal_items"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_check_records_updated_at ON "check_records";
CREATE TRIGGER update_check_records_updated_at BEFORE UPDATE ON "check_records"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
