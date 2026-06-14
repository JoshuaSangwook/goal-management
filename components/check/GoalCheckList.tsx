"use client"

import { useState, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { GoalCheckItem } from "./GoalCheckItem"
import { CheckStatusSummary } from "./CheckStatusSummary"
import { DatePicker } from "./DatePicker"
import { startOfDay } from "date-fns"
import { GoalItem } from "@/lib/mock-data"
import { CheckCircle2, Calendar } from "lucide-react"

interface CheckRecord {
  id: string
  goalItemId: string
  date: Date
  checked: boolean
  createdAt: Date
  goalItem: GoalItem
}

export function GoalCheckList() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const dateParam = searchParams.get('date')

  const [selectedDate, setSelectedDate] = useState(
    dateParam ? new Date(dateParam) : new Date()
  )
  const [goalItems, setGoalItems] = useState<GoalItem[]>([])
  const [checkStates, setCheckStates] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | undefined>()
  const [submitting, setSubmitting] = useState(false)

  // Fetch data
  const fetchData = async (date: Date) => {
    if (!session?.user) return

    setLoading(true)
    try {
      // Fetch goals
      const goalsRes = await fetch('/api/goals')
      const goalsData = await goalsRes.json()

      // Show all goal items regardless of period
      setGoalItems(goalsData.goalItems)

      // Fetch checks for the selected date
      const dateStr = date.toISOString().split('T')[0]
      const checksRes = await fetch(`/api/checks?date=${dateStr}`)
      const checksData = await checksRes.json()

      // Initialize check states
      const states: Record<string, boolean> = {}
      checksData.checkRecords.forEach((record: CheckRecord) => {
        states[record.goalItemId] = record.checked
        if (record.checked && (!lastUpdate || new Date(record.createdAt) > lastUpdate)) {
          setLastUpdate(new Date(record.createdAt))
        }
      })
      setCheckStates(states)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load data on mount and when date/session changes
  useMemo(() => {
    if (status === 'authenticated') {
      fetchData(selectedDate)
    }
  }, [session, selectedDate, status])

  const handleToggle = async (goalItemId: string) => {
    if (submitting) return

    setSubmitting(true)
    const newChecked = !checkStates[goalItemId]

    try {
      const response = await fetch('/api/checks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalItemId,
          checked: newChecked,
          date: selectedDate.toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update check')
      }

      const data = await response.json()

      setCheckStates((prev) => ({
        ...prev,
        [goalItemId]: newChecked,
      }))
      setLastUpdate(new Date(data.createdAt))
    } catch (error) {
      console.error('Failed to toggle check:', error)
      // Revert on error
      setCheckStates((prev) => ({
        ...prev,
        [goalItemId]: !newChecked,
      }))
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-muted animate-pulse rounded-lg" />
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const checkedCount = Object.values(checkStates).filter(Boolean).length
  const totalCount = goalItems.length
  const allChecked = checkedCount === totalCount && totalCount > 0

  return (
    <div className="space-y-6">
      <DatePicker
        selected={selectedDate}
        onSelect={(date) => {
          setSelectedDate(date)
          router.push(`/check?date=${date.toISOString().split('T')[0]}`)
        }}
      />

      <CheckStatusSummary
        checkedCount={checkedCount}
        totalCount={totalCount}
        lastUpdate={lastUpdate}
      />

      <div className="space-y-3">
        {goalItems.map((item) => (
          <GoalCheckItem
            key={item.id}
            item={item}
            checked={checkStates[item.id] || false}
            onToggle={handleToggle}
            checkedAt={lastUpdate && checkStates[item.id] ? lastUpdate.toISOString() : undefined}
            disabled={submitting}
          />
        ))}
      </div>
    </div>
  )
}
