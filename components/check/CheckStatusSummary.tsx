import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Circle } from "lucide-react"

interface CheckStatusSummaryProps {
  checkedCount: number
  totalCount: number
  lastUpdate?: Date
}

export function CheckStatusSummary({
  checkedCount,
  totalCount,
  lastUpdate,
}: CheckStatusSummaryProps) {
  const progress = (checkedCount / totalCount) * 100
  const allChecked = checkedCount === totalCount

  return (
    <Card className={`${
      allChecked ? "bg-green-50 border-green-200" : "bg-primary/10 border-primary/20"
    }`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {allChecked ? (
              <CheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <Circle className="h-10 w-10 text-primary" />
            )}
            <div>
              <p className="text-sm font-medium">
                {allChecked ? "🎉 모두 완료!" : "오늘의 체크 현황"}
              </p>
              <p className="text-2xl font-bold">
                {checkedCount}/{totalCount}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">달성률</p>
            <p className={`text-3xl font-bold ${
              allChecked ? "text-green-600" : "text-primary"
            }`}>
              {progress.toFixed(0)}%
            </p>
          </div>
        </div>
        {lastUpdate && (
          <div className="mt-4 text-xs text-muted-foreground text-center">
            마지막 업데이트: {lastUpdate.toLocaleString("ko-KR")}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
