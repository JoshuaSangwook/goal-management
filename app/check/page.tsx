import { Suspense } from "react"
import { GoalCheckList } from "@/components/check/GoalCheckList"

export default function CheckPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">데일리 체크인</h1>
          <p className="text-muted-foreground">
            오늘의 목표를 체크하고 성장을 기록하세요
          </p>
        </div>

        <Suspense fallback={<div className="h-40 bg-muted animate-pulse rounded-lg" />}>
          <GoalCheckList />
        </Suspense>
      </div>
    </div>
  )
}
