import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GoalItem, goalAreaConfig, periodLabels } from "@/lib/mock-data"

interface GoalItemCardProps {
  item: GoalItem
}

export function GoalItemCard({ item }: GoalItemCardProps) {
  const areaConfig = goalAreaConfig[item.area]
  const periodLabel = periodLabels[item.period]

  return (
    <Card className={`${areaConfig.bgColor} ${areaConfig.borderColor} border hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base">{item.title}</CardTitle>
          </div>
          <Badge className={`${areaConfig.textColor} ${areaConfig.bgColor}`}>
            {areaConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">주기</span>
          <span className="font-medium">{periodLabel}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-muted-foreground">기본 목표</span>
          <span className="font-medium">{item.defaultTarget}{item.targetUnit && ` (${item.targetUnit})`}</span>
        </div>
      </CardContent>
    </Card>
  )
}
