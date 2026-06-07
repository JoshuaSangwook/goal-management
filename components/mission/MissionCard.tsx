"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface MissionVision {
  type: "MISSION" | "VISION"
  title: string
  content: string
  subtitle?: string
}

export function MissionCard() {
  const [mission, setMission] = useState<Partial<MissionVision>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/mission-vision')
      .then((res) => res.json())
      .then((data) => {
        const missionItem = data.missionVisions.find((mv: MissionVision) => mv.type === 'MISSION')
        if (missionItem) setMission(missionItem)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card className="relative overflow-hidden border-2 border-primary/30 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 h-full">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70" />

      <div className="relative p-8 md:p-12 flex flex-col h-full">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white drop-shadow-lg">
          사명 (Mission)
        </h2>

        {/* Content Area - Grows to fill space */}
        <div className="flex-1 flex flex-col justify-center">
          {loading ? (
            <div className="space-y-4">
              <div className="h-6 bg-white/20 animate-pulse rounded" />
              <div className="h-20 bg-white/20 animate-pulse rounded" />
              <div className="h-6 bg-white/20 animate-pulse rounded" />
            </div>
          ) : (
            <>
              {/* Verse Box */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/30 shadow-lg">
                <p className="text-center text-base md:text-lg font-semibold text-white break-keep leading-relaxed">
                  {mission.subtitle}
                </p>
              </div>

              {/* Main Verse Text */}
              <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-lg">
                <p className="text-center text-lg md:text-xl font-medium leading-relaxed text-white break-keep">
                  "{mission.content}"
                </p>
              </div>
            </>
          )}
        </div>

        {/* Decorative bottom line */}
        <div className="mt-8 flex justify-center">
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full" />
        </div>
      </div>
    </Card>
  )
}
