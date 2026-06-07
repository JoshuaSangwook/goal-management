"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { GoalItem, goalAreaConfig, periodLabels } from "@/lib/mock-data"
import { format } from "date-fns"

interface GoalCheckItemProps {
  item: GoalItem
  checked: boolean
  onToggle: (itemId: string) => void
  checkedAt?: string
  disabled?: boolean
}

export function GoalCheckItem({
  item,
  checked,
  onToggle,
  checkedAt,
  disabled = false,
}: GoalCheckItemProps) {
  const areaConfig = goalAreaConfig[item.area]
  const periodLabel = periodLabels[item.period]

  return (
    <Card className={`${checked ? areaConfig.bgColor + " border-2 " + areaConfig.borderColor : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-2">
              <Badge className={`${areaConfig.textColor} ${areaConfig.bgColor} shrink-0`}>
                {areaConfig.label}
              </Badge>
              <h3 className="font-medium leading-tight">{item.title}</h3>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{periodLabel}</span>
              <span>·</span>
              <span>목표: {item.defaultTarget}</span>
            </div>
            {checked && checkedAt && (
              <div className="text-xs text-muted-foreground">
                체크 시간: {format(new Date(checkedAt), "a h:mm")}
              </div>
            )}
          </div>
          <Switch
            checked={checked}
            onCheckedChange={() => onToggle(item.id)}
            disabled={disabled}
            className="shrink-0"
          />
        </div>
      </CardContent>
    </Card>
  )
}
