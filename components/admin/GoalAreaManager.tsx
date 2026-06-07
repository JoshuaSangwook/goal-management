"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GoalArea, goalAreaConfig } from "@/lib/mock-data"
import { Save } from "lucide-react"

interface GoalAreaInfo {
  id: string
  area: GoalArea
  goal: string
}

export function GoalAreaManager() {
  const [areas, setAreas] = useState<GoalAreaInfo[]>([])
  const [editingArea, setEditingArea] = useState<GoalArea | null>(null)
  const [editForm, setEditForm] = useState({
    goal: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/goal-areas')
      if (!response.ok) throw new Error('Failed to fetch')

      const data = await response.json()
      setAreas(data.goalAreaInfos)
    } catch (error) {
      console.error('Failed to fetch goal areas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (area: GoalArea) => {
    const areaData = areas.find((a) => a.area === area)
    if (areaData) {
      setEditingArea(area)
      setEditForm({
        goal: areaData.goal,
      })
    }
  }

  const handleSave = async () => {
    if (!editingArea) return

    setSaving(true)
    try {
      const response = await fetch('/api/admin/goal-areas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          area: editingArea,
          goal: editForm.goal,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      const updated = await response.json()
      setAreas(areas.map((a) => (a.area === editingArea ? updated : a)))
      setEditingArea(null)
      alert('저장되었습니다!')
    } catch (error) {
      console.error('Failed to save goal area:', error)
      alert('저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingArea(null)
    setEditForm({ goal: "" })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>목표 영역 관리</CardTitle>
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
        <CardTitle>목표 영역 관리</CardTitle>
        <p className="text-sm text-muted-foreground">
          4대 영역의 목표를 관리하세요
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {(Object.keys(goalAreaConfig) as GoalArea[]).map((area) => {
          const areaConfig = goalAreaConfig[area]
          const areaData = areas.find((a) => a.area === area)
          const isEditing = editingArea === area

          return (
            <div key={area} className="border rounded-lg p-4 space-y-4">
              {/* Area Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={`${areaConfig.textColor} ${areaConfig.bgColor}`}>
                    {areaConfig.label}
                  </Badge>
                  <span className="font-semibold">{area}</span>
                </div>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => handleEdit(area)}>
                    수정
                  </Button>
                )}
              </div>

              {/* View Mode */}
              {!isEditing && areaData && (
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">목표: </span>
                    <span>{areaData.goal}</span>
                  </div>
                </div>
              )}

              {/* Edit Mode */}
              {isEditing && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor={`goal-${area}`}>목표</Label>
                    <Input
                      id={`goal-${area}`}
                      value={editForm.goal}
                      onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
                      placeholder="영역의 목표"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? '저장 중...' : '저장'}
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      취소
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
