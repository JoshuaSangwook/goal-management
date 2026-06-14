"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface MonthlyTrendChartProps {
  data: { month: string; planned: number; actual: number; rate: number }[]
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>월별 트렌드</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: unknown, name: unknown) => {
                const numValue = typeof value === 'number' ? value : 0
                const nameStr = String(name ?? '')
                if (nameStr === 'planned') return [numValue, '계획']
                if (nameStr === 'actual') return [numValue, '실제']
                return [numValue, nameStr]
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="planned"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#94a3b8" }}
              name="계획"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))" }}
              name="실제"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>100% 이상 (우수)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span>70-100% (보통)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>70% 미만 (미달)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Alias for backward compatibility
export const YearlyTrendChart = MonthlyTrendChart
