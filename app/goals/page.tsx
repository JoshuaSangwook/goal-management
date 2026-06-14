"use client"

import { GoalAreaSection } from "@/components/goal/GoalAreaSection"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { GoalArea } from "@/lib/mock-data"

interface GoalItem {
  id: string
  code: string
  area: GoalArea
  title: string
  targetUnit: string
  period: string
  defaultTarget: number
}

interface GoalAreaInfo {
  area: GoalArea
  goal: string
}

export default function GoalsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [goalItems, setGoalItems] = useState<GoalItem[]>([])
  const [areaInfos, setAreaInfos] = useState<GoalAreaInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        const response = await fetch('/api/goals')
        const data = await response.json()

        setGoalItems(data.goalItems)
        setAreaInfos(data.areaInfos)
      } catch (error) {
        console.error('Failed to fetch goals:', error)
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
            <div className="h-10 w-64 bg-muted animate-pulse mx-auto rounded" />
            <div className="h-6 w-48 bg-muted animate-pulse mx-auto rounded" />
          </div>
          <div className="space-y-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Group items by area
  const itemsByArea = goalItems.reduce<Record<GoalArea, GoalItem[]>>((acc, item) => {
    if (!acc[item.area]) {
      acc[item.area] = []
    }
    acc[item.area].push(item)
    return acc
  }, {})

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">목표 개요</h1>
          <p className="text-muted-foreground">
            4가지 영역에서 균형 잡힌 성장을 이루세요
          </p>
        </div>

        <div className="space-y-12">
          {(Object.keys(itemsByArea) as GoalArea[]).map((area) => (
            <GoalAreaSection
              key={area}
              area={area}
              items={itemsByArea[area] || []}
              areaInfo={areaInfos.find((info) => info.area === area)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
