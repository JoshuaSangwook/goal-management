import { GoalItemCard } from "./GoalItemCard"
import { GoalItem, goalAreaConfig, GoalArea } from "@/lib/mock-data"

interface GoalAreaInfo {
  area: GoalArea
  goal: string
}

interface GoalAreaSectionProps {
  area: GoalArea
  items: GoalItem[]
  areaInfo?: GoalAreaInfo
}

export function GoalAreaSection({ area, items, areaInfo }: GoalAreaSectionProps) {
  const areaConfig = goalAreaConfig[area]

  return (
    <section className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className={`h-8 w-2 ${areaConfig.color} rounded`} />
        <h2 className="text-2xl font-bold">{areaConfig.label} 성장</h2>
      </div>

      {/* Area Info */}
      {areaInfo && (
        <div className={`${areaConfig.bgColor} border ${areaConfig.borderColor} rounded-lg p-4`}>
          <div className="text-sm">
            <span className="font-semibold text-muted-foreground">목표</span>
            <p className="mt-1">{areaInfo.goal}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <GoalItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
