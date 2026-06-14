import { MissionVisionEditor } from "@/components/admin/MissionVisionEditor"
import { CoreValuesManager } from "@/components/admin/CoreValuesManager"
import { GoalAreaManager } from "@/components/admin/GoalAreaManager"
import { GoalItemManager } from "@/components/admin/GoalItemManager"
import { AdminGuard } from "@/components/admin/AdminGuard"

export default function AdminItemsPage() {
  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">관리자 - 아이템 관리</h1>
            <p className="text-muted-foreground">
              미션, 비전, 핵심가치, 목표 아이템을 관리하세요
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MissionVisionEditor />
            <CoreValuesManager />
          </div>

          <GoalAreaManager />

          <GoalItemManager />
        </div>
      </div>
    </AdminGuard>
  )
}
