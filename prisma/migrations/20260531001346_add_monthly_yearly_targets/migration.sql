-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_goal_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "goal_items_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "goal_area_infos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_goal_items" ("active", "area", "areaId", "code", "createdAt", "defaultTarget", "description", "id", "order", "period", "targetUnit", "title", "updatedAt") SELECT "active", "area", "areaId", "code", "createdAt", "defaultTarget", "description", "id", "order", "period", "targetUnit", "title", "updatedAt" FROM "goal_items";
DROP TABLE "goal_items";
ALTER TABLE "new_goal_items" RENAME TO "goal_items";
CREATE UNIQUE INDEX "goal_items_code_key" ON "goal_items"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
