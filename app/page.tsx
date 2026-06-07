"use client"

import { MissionCard } from "@/components/mission/MissionCard"
import { VisionCard } from "@/components/vision/VisionCard"
import { CoreValuesGrid } from "@/components/values/CoreValuesGrid"
import { DailySummaryBanner } from "@/components/landing/DailySummaryBanner"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [uncheckedCount, setUncheckedCount] = useState(0)
  const [dailyTotalCount, setDailyTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchDailySummary = async () => {
      if (status === 'authenticated') {
        try {
          const today = new Date().toISOString().split('T')[0]
          const checksRes = await fetch(`/api/checks?date=${today}`)
          const checksData = await checksRes.json()

          const goalsRes = await fetch('/api/goals')
          const goalsData = await goalsRes.json()

          // Use all goal items (not just DAILY) to match check-in page behavior
          const allItems = goalsData.goalItems
          const checkedCount = checksData.checkRecords.filter((r: any) => r.checked).length

          setUncheckedCount(allItems.length - checkedCount)
          setDailyTotalCount(allItems.length)
        } catch (error) {
          console.error('Failed to fetch daily summary:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchDailySummary()
  }, [status])

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            나눔코칭
          </h1>
        </div>

        {/* Daily Summary Banner - Only show when logged in */}
        {status === 'authenticated' && !loading && (
          <div className="transform hover:scale-[1.01] transition-transform duration-300">
            <DailySummaryBanner
              uncheckedCount={uncheckedCount}
              totalCount={dailyTotalCount}
            />
          </div>
        )}

        {/* Mission & Vision - Side by Side, Emphasized */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="transform hover:scale-[1.02] transition-transform duration-300">
            <MissionCard />
          </div>
          <div className="transform hover:scale-[1.02] transition-transform duration-300">
            <VisionCard />
          </div>
        </div>

        {/* Core Values */}
        <section className="pt-8">
          <CoreValuesGrid />
        </section>

        {/* Call to Action */}
        {status === 'authenticated' ? (
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 text-center border border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              오늘도 말씀을 실천해요
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              목표를 체크하고 성장을 기록하세요<br />
              작은 실천이 모여 큰 변화를 만듭니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/check"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105"
              >
                오늘의 목표 체크하기 →
              </a>
              <a
                href="/goals"
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary/20 bg-background px-8 py-3 text-lg font-semibold text-primary hover:bg-primary/10 transition-all duration-200 hover:scale-105"
              >
                목표 둘러보기
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 text-center border border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              시작해볼까요?
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              로그인하고 목표 달성 여정을 시작하세요<br />
              이미 계정이 있으신가요?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105"
              >
                로그인 →
              </a>
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary/20 bg-background px-8 py-3 text-lg font-semibold text-primary hover:bg-primary/10 transition-all duration-200 hover:scale-105"
              >
                회원가입
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
