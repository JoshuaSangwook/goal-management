"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface DatePickerProps {
  selected: Date
  onSelect: (date: Date) => void
}

export function DatePicker({ selected, onSelect }: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="w-full justify-start text-left font-normal"
        onClick={() => setOpen(!open)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {format(selected, "yyyy년 MM월 dd일 EEE")}
      </Button>

      {open && (
        <div className="absolute z-10 mt-2 rounded-md border bg-popover shadow-md">
          <Calendar
            selected={selected}
            onSelect={(date) => {
              if (date) {
                onSelect(date)
                setOpen(false)
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
