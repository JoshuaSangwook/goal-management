"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface MissionVision {
  id: string
  type: "MISSION" | "VISION"
  title: string
  content: string
  subtitle?: string
}

export function MissionVisionEditor() {
  const [mission, setMission] = useState<Partial<MissionVision>>({})
  const [vision, setVision] = useState<Partial<MissionVision>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/mission-vision')
      if (!response.ok) throw new Error('Failed to fetch')

      const data = await response.json()
      const missionItem = data.missionVisions.find((mv: MissionVision) => mv.type === 'MISSION')
      const visionItem = data.missionVisions.find((mv: MissionVision) => mv.type === 'VISION')

      if (missionItem) setMission(missionItem)
      if (visionItem) setVision(visionItem)
    } catch (error) {
      console.error('Failed to fetch mission/vision:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!mission.id || !vision.id) {
      alert('미션과 비전이 모두 필요합니다.')
      return
    }

    setSaving(true)
    try {
      // Update mission
      await fetch('/api/admin/mission-vision', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: mission.id,
          type: 'MISSION',
          content: mission.content,
          subtitle: mission.subtitle,
        }),
      })

      // Update vision
      await fetch('/api/admin/mission-vision', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: vision.id,
          type: 'VISION',
          content: vision.content,
          subtitle: vision.subtitle,
        }),
      })

      alert('저장되었습니다!')
    } catch (error) {
      console.error('Failed to save:', error)
      alert('저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>내용 편집</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>내용 편집</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">사명 (Mission)</h3>
          <div className="space-y-2">
            <Label htmlFor="mission-content1">내용1</Label>
            <Input
              id="mission-content1"
              value={mission.content || ''}
              onChange={(e) => setMission({ ...mission, content: e.target.value })}
              placeholder="(약1:22) 너희는 말씀을 행하는 자가 되고..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mission-content2">내용2</Label>
            <Input
              id="mission-content2"
              value={mission.subtitle || ''}
              onChange={(e) => setMission({ ...mission, subtitle: e.target.value })}
              placeholder="말씨을 듣기만 하여 자신을 속이는 자가 되지 않고..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">비전 (Vision)</h3>
          <div className="space-y-2">
            <Label htmlFor="vision-content1">내용1</Label>
            <Input
              id="vision-content1"
              value={vision.content || ''}
              onChange={(e) => setVision({ ...vision, content: e.target.value })}
              placeholder="1년에 10회 이상 난민학교에서..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vision-content2">내용2</Label>
            <Input
              id="vision-content2"
              value={vision.subtitle || ''}
              onChange={(e) => setVision({ ...vision, subtitle: e.target.value })}
              placeholder="영어로 된 강의안을 잘 만들고..."
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full" disabled={saving}>
          {saving ? '저장 중...' : '저장'}
        </Button>
      </CardContent>
    </Card>
  )
}
