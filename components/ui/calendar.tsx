import * as React from "react"

import { cn } from "@/lib/utils"

export interface CalendarProps {
  className?: string
  selected?: Date
  onSelect?: (date: Date) => void
  mode?: "single"
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, selected, onSelect }, ref) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date())

    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate()

    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay()

    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    const monthNames = [
      "1월", "2월", "3월", "4월", "5월", "6월",
      "7월", "8월", "9월", "10월", "11월", "12월"
    ]

    const handleDateClick = (day: number) => {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      onSelect?.(newDate)
    }

    const isSelected = (day: number) => {
      return selected &&
        selected.getDate() === day &&
        selected.getMonth() === currentMonth.getMonth() &&
        selected.getFullYear() === currentMonth.getFullYear()
    }

    const isToday = (day: number) => {
      const today = new Date()
      return today.getDate() === day &&
        today.getMonth() === currentMonth.getMonth() &&
        today.getFullYear() === currentMonth.getFullYear()
    }

    return (
      <div ref={ref} className={cn("p-3", className)}>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-accent rounded"
          >
            ←
          </button>
          <div className="font-semibold">
            {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
          </div>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-accent rounded"
          >
            →
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <div key={day} className="font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => day && handleDateClick(day)}
              disabled={!day}
              className={cn(
                "py-2 rounded hover:bg-accent disabled:opacity-0",
                isSelected(day || 0) && "bg-primary text-primary-foreground hover:bg-primary",
                isToday(day || 0) && !isSelected(day || 0) && "border-2 border-primary"
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    )
  }
)
Calendar.displayName = "Calendar"

export { Calendar }
