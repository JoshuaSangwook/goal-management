import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown } from "lucide-react"

interface ProgressItem {
  goalItemId: string
  code: string
  title: string
  achievement: number
  target: number
  rate: number
}

interface MonthlyProgressCardProps {
  items: ProgressItem[]
}

export function MonthlyProgressCard({ items }: MonthlyProgressCardProps) {
  const getProgressColor = (rate: number) => {
    if (rate >= 90) return "text-green-600"
    if (rate >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>이번 달 진행률</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {items.map((item, index) => (
          <div key={`${item.goalItemId}-${index}`} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.title}</span>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${getProgressColor(item.rate)}`}>
                  {item.rate.toFixed(1)}%
                </span>
                {item.rate >= 90 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
            <Progress value={Math.min(item.rate, 100)} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{item.achievement} 회 달성</span>
              <span>목표: {item.target} 회</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
