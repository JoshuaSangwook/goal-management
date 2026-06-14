-- Create PostgreSQL Enums for Prisma compatibility
-- Run this in Supabase SQL Editor

-- Drop existing tables (data will be preserved in seed, or backup first)
-- Note: If you have data, backup first!

-- Create Enums
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');
CREATE TYPE "MvType" AS ENUM ('MISSION', 'VISION');
CREATE TYPE "GoalArea" AS ENUM ('INTELLECTUAL', 'SPIRITUAL', 'PHYSICAL', 'SOCIAL');
CREATE TYPE "Period" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- Recreate users table with enum
DROP TABLE IF EXISTS "users" CASCADE;
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Recreate mission_visions table with enum
DROP TABLE IF EXISTS "mission_visions" CASCADE;
CREATE TABLE "mission_visions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" "MvType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "subtitle" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Recreate goal_area_infos table with enum
DROP TABLE IF EXISTS "goal_area_infos" CASCADE;
CREATE TABLE "goal_area_infos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "area" "GoalArea" NOT NULL UNIQUE,
    "goal" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "strategy" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Recreate goal_items table with enums
DROP TABLE IF EXISTS "goal_items" CASCADE;
CREATE TABLE "goal_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "area" "GoalArea" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "period" "Period" NOT NULL,
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

-- Recreate other tables (these don't use enums but need to be recreated due to CASCADE)
DROP TABLE IF EXISTS "personal_targets" CASCADE;
CREATE TABLE "personal_targets" (
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

DROP TABLE IF EXISTS "check_records" CASCADE;
CREATE TABLE "check_records" (
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

DROP TABLE IF EXISTS "target_histories" CASCADE;
CREATE TABLE "target_histories" (
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

DROP TABLE IF EXISTS "core_values" CASCADE;
CREATE TABLE "core_values" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "verse" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS "check_records_userId_date_idx" ON "check_records"("userId", "date");

-- updatedAt trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
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
