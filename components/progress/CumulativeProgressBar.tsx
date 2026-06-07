import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface CumulativeProgressBarProps {
  actual: number
  totalAchievement: number
  totalTargetExpected: number
}

export function CumulativeProgressBar({
  actual,
  totalAchievement,
  totalTargetExpected,
}: CumulativeProgressBarProps) {
  const isAhead = actual >= 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>누적 달성률</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">실제 달성률</span>
            <span className="text-2xl font-bold text-primary">{actual.toFixed(1)}%</span>
          </div>
          <Progress value={Math.min(actual, 100)} />
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">실제 달성</p>
            <p className="text-lg font-semibold">{totalAchievement}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">연간 목표</p>
            <p className="text-lg font-semibold">{totalTargetExpected}</p>
          </div>
        </div>

        <div className={`text-center p-4 rounded-lg ${
          isAhead ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}>
          <p className="text-sm font-medium">
            {isAhead ? "🎉 목표를 달성했습니다!" : "💪 조금만 더 힘내세요!"}
          </p>
          <p className="text-xs mt-1">
            {isAhead
              ? `${(actual - 100).toFixed(1)}% 초과`
              : `${(100 - actual).toFixed(1)}% 남음`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
