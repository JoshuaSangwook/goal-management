import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Calendar } from "lucide-react"

interface DailySummaryBannerProps {
  uncheckedCount: number
  totalCount: number
}

export function DailySummaryBanner({
  uncheckedCount,
  totalCount,
}: DailySummaryBannerProps) {
  const checkedCount = totalCount - uncheckedCount
  const progress = (checkedCount / totalCount) * 100
  const isComplete = checkedCount === totalCount

  return (
    <Card className={`border-2 transition-all duration-300 ${
      isComplete
        ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 shadow-lg shadow-green-500/20"
        : "bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30"
    }`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Icon and Status */}
          <div className="flex items-center gap-4">
            <div className={`h-14 w-14 rounded-full flex items-center justify-center ${
              isComplete
                ? "bg-green-500/20"
                : "bg-primary/20"
            }`}>
              {isComplete ? (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              ) : (
                <Calendar className="h-8 w-8 text-primary" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {isComplete ? "🎉 오늘의 목표 완료!" : "오늘의 체크 현황"}
              </p>
              <p className="text-2xl md:text-3xl font-bold">
                {checkedCount}/{totalCount} 완료
              </p>
            </div>
          </div>

          {/* Right: Progress */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="text-right flex-1 md:flex-none">
              <p className="text-sm text-muted-foreground mb-1">달성률</p>
              <p className={`text-3xl md:text-4xl font-bold ${
                isComplete ? "text-green-600" : "text-primary"
              }`}>
                {progress.toFixed(0)}%
              </p>
            </div>

            {/* Progress Bar (Circular) */}
            <div className="relative h-20 w-20">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  className="stroke-muted"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  className={isComplete ? "stroke-green-600" : "stroke-primary"}
                  strokeWidth="3"
                  strokeDasharray={`${progress}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-bold ${
                  isComplete ? "text-green-600" : "text-primary"
                }`}>
                  {progress.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar (Linear) */}
        <div className="mt-4">
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isComplete
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-primary to-primary/70"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
