"use client"

import { MonthlyProgressCard } from "@/components/progress/MonthlyProgressCard"
import { CumulativeProgressBar } from "@/components/progress/CumulativeProgressBar"
import { YearlyTrendChart } from "@/components/progress/YearlyTrendChart"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface ProgressItem {
  goalItemId: string
  code: string
  title: string
  achievement: number
  target: number
  rate: number
}

interface ProgressData {
  monthly: ProgressItem[]
  cumulative: {
    actual: string
    totalAchievement: number
    totalTargetExpected: number
  }
  monthlyTrend: { month: string; planned: number; actual: number; rate: number }[]
  year: number
  month: number
}

export default function ProgressPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/progress`)
        const data = await response.json()
        setProgressData(data)
      } catch (error) {
        console.error('Failed to fetch progress:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchData()
    }
  }, [status, router])

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="h-10 w-48 bg-muted animate-pulse mx-auto rounded" />
            <div className="h-6 w-64 bg-muted animate-pulse mx-auto rounded" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
          </div>
          <div className="h-80 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">달성 현황</h1>
          <p className="text-muted-foreground">
            목표 달성 현황을 한눈에 확인하세요
          </p>
        </div>

        {progressData && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CumulativeProgressBar
                actual={parseFloat(progressData.cumulative.actual)}
                totalAchievement={progressData.cumulative.totalAchievement}
                totalTargetExpected={progressData.cumulative.totalTargetExpected}
              />
              <YearlyTrendChart data={progressData.monthlyTrend} />
            </div>

            <MonthlyProgressCard items={progressData.monthly} />
          </>
        )}
      </div>
    </div>
  )
}
