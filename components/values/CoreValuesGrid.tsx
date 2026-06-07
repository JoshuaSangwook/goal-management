"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  BookOpen,
  HeartHandshake,
  Feather,
  Shield,
  TrendingUp,
  LineChart,
} from "lucide-react"

const iconMap = {
  BookOpen,
  HeartHandshake,
  Feather,
  Shield,
  TrendingUp,
  LineChart,
}

interface CoreValue {
  id: string
  title: string
  description: string
  icon: string
  verse?: string
  order: number
}

export function CoreValuesGrid() {
  const [values, setValues] = useState<CoreValue[]>([])
  const [loading, setLoading] = useState(true)

  const gradients = [
    "from-blue-500/10 to-blue-600/5 border-blue-200/50 hover:border-blue-400",
    "from-purple-500/10 to-purple-600/5 border-purple-200/50 hover:border-purple-400",
    "from-pink-500/10 to-pink-600/5 border-pink-200/50 hover:border-pink-400",
    "from-cyan-500/10 to-cyan-600/5 border-cyan-200/50 hover:border-cyan-400",
    "from-amber-500/10 to-amber-600/5 border-amber-200/50 hover:border-amber-400",
    "from-emerald-500/10 to-emerald-600/5 border-emerald-200/50 hover:border-emerald-400",
  ]

  useEffect(() => {
    fetch('/api/public/core-values')
      .then((res) => res.json())
      .then((data) => setValues(data.coreValues))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold">핵심 가치</h2>
      </div>

      {/* Loading or Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const Icon = iconMap[value.icon as keyof typeof iconMap]
            const gradient = gradients[index % gradients.length]
            return (
              <Card
                key={value.id}
                className={`group overflow-hidden border-2 bg-gradient-to-br ${gradient} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <CardContent className="p-6">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${gradient.split(' ')[0].replace('/10', '/20')} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      {Icon && <Icon className="h-8 w-8 text-foreground" />}
                    </div>
                  </div>

                  {/* Title & Verse */}
                  <div className="text-center mb-3">
                    <h3 className="text-xl font-bold mb-1">{value.title}</h3>
                    {value.verse && (
                      <p className="text-xs font-medium text-muted-foreground">{value.verse}</p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-center text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
