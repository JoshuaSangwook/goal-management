"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { GoalArea, Period, goalAreaConfig, periodLabels, GoalItem as BaseGoalItem } from "@/lib/mock-data"
import { X, Plus, GripVertical, Edit2, Check, ChevronDown, ChevronUp } from "lucide-react"

// Extended interface for admin with database fields
interface GoalItem extends Omit<BaseGoalItem, 'active'> {
  monthlyTarget: number
  yearlyTarget: number
  order: number
  areaId: string
  active?: boolean
}

export function GoalItemManager() {
  const [items, setItems] = useState<GoalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState({
    area: "INTELLECTUAL" as GoalArea,
    period: "DAILY" as Period,
    title: "",
    defaultTarget: 1,
    targetUnit: "",
    monthlyTarget: 0,
    yearlyTarget: 0,
  })
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    title: "",
    area: "INTELLECTUAL" as GoalArea,
    period: "DAILY" as Period,
    defaultTarget: 1,
    targetUnit: "",
    monthlyTarget: 0,
    yearlyTarget: 0,
  })
  const [saving, setSaving] = useState(false)
  const [showInactive, setShowInactive] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/goal-items')
      if (!response.ok) throw new Error('Failed to fetch')

      const data = await response.json()
      setItems(data.goalItems)
    } catch (error) {
      console.error('Failed to fetch goal items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newItem.title) {
      alert('제목을 입력해주세요.')
      return
    }

    setAdding(true)
    try {
      const response = await fetch('/api/admin/goal-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      })

      if (!response.ok) throw new Error('Failed to create')

      const created = await response.json()
      setItems([...items, created])
      setNewItem({
        area: "INTELLECTUAL",
        period: "DAILY",
        title: "",
        defaultTarget: 1,
        targetUnit: "",
        monthlyTarget: 0,
        yearlyTarget: 0,
      })
    } catch (error) {
      console.error('Failed to add goal item:', error)
      alert('추가에 실패했습니다.')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/admin/goal-items?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      // Soft delete - just update active state
      setItems(items.map((item) => (item.id === id ? { ...item, active: false } : item)))
    } catch (error) {
      console.error('Failed to delete goal item:', error)
      alert('삭제에 실패했습니다.')
    }
  }

  const handleToggleActive = async (id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item) return

    // Toggle active state (undefined defaults to true)
    const currentActive = item.active ?? true
    const newActive = !currentActive

    try {
      const response = await fetch('/api/admin/goal-items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          active: newActive,
        }),
      })

      if (!response.ok) throw new Error('Failed to update')

      const updated = await response.json()
      setItems(items.map((i) => (i.id === id ? updated : i)))
    } catch (error) {
      console.error('Failed to toggle goal item:', error)
      alert('상태 변경에 실패했습니다.')
    }
  }

  const handleEdit = (item: GoalItem) => {
    setEditingId(item.id)
    setEditForm({
      title: item.title,
      area: item.area,
      period: item.period,
      defaultTarget: item.defaultTarget,
      targetUnit: item.targetUnit,
      monthlyTarget: item.monthlyTarget,
      yearlyTarget: item.yearlyTarget,
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({
      title: "",
      area: "INTELLECTUAL",
      period: "DAILY",
      defaultTarget: 1,
      targetUnit: "",
      monthlyTarget: 0,
      yearlyTarget: 0,
    })
  }

  const handleSaveEdit = async () => {
    if (!editingId || !editForm.title) {
      alert('제목을 입력해주세요.')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/admin/goal-items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          ...editForm,
        }),
      })

      if (!response.ok) throw new Error('Failed to update')

      const updated = await response.json()
      setItems(items.map((i) => i.id === editingId ? updated : i))
      setEditingId(null)
      setEditForm({
        title: "",
        area: "INTELLECTUAL",
        period: "DAILY",
        defaultTarget: 1,
        targetUnit: "",
        monthlyTarget: 0,
        yearlyTarget: 0,
      })
    } catch (error) {
      console.error('Failed to update goal item:', error)
      alert('수정에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newItems = [...items]
    const temp = newItems[index - 1]
    newItems[index - 1] = { ...newItems[index], order: newItems[index - 1].order }
    newItems[index] = { ...temp, order: temp.order + 1 }
    setItems(newItems)
  }

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return
    const newItems = [...items]
    const temp = newItems[index + 1]
    newItems[index + 1] = { ...newItems[index], order: newItems[index + 1].order }
    newItems[index] = { ...temp, order: temp.order - 1 }
    setItems(newItems)
  }

  const filteredItems = showInactive ? items : items.filter(item => item.active !== false)
  const activeItems = items.filter(item => item.active !== false)
  const inactiveItems = items.filter(item => item.active === false)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>목표 아이템 관리</CardTitle>
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
        <CardTitle>목표 아이템 관리</CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            활성: {activeItems.length}개 / 비활성: {inactiveItems.length}개
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInactive(!showInactive)}
          >
            {showInactive ? "비활성 숨기기" : "비활성 보기"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="item-title">목표 제목</Label>
              <Input
                id="item-title"
                placeholder="목표 제목"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-area">영역</Label>
              <Select
                value={newItem.area}
                onValueChange={(value) => setNewItem({ ...newItem, area: value as GoalArea })}
              >
                <SelectTrigger id="item-area">
                  <span>{goalAreaConfig[newItem.area].label}</span>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(goalAreaConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-period">주기</Label>
              <Select
                value={newItem.period}
                onValueChange={(value) => setNewItem({ ...newItem, period: value as Period })}
              >
                <SelectTrigger id="item-period">
                  <span>{periodLabels[newItem.period]}</span>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(periodLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-target">기본 목표</Label>
              <Input
                id="item-target"
                type="number"
                min={1}
                value={newItem.defaultTarget}
                onChange={(e) => setNewItem({ ...newItem, defaultTarget: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-unit">목표 단위</Label>
              <Input
                id="item-unit"
                placeholder="회/일 (월 30회, 연 365회)"
                value={newItem.targetUnit}
                onChange={(e) => setNewItem({ ...newItem, targetUnit: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-monthly">월별 목표</Label>
              <Input
                id="item-monthly"
                type="number"
                min={0}
                placeholder="30"
                value={newItem.monthlyTarget || ''}
                onChange={(e) => setNewItem({ ...newItem, monthlyTarget: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-yearly">연별 목표</Label>
              <Input
                id="item-yearly"
                type="number"
                min={0}
                placeholder="365"
                value={newItem.yearlyTarget || ''}
                onChange={(e) => setNewItem({ ...newItem, yearlyTarget: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <Button onClick={handleAdd} className="w-full" disabled={adding}>
            <Plus className="h-4 w-4 mr-2" />
            {adding ? '추가 중...' : '추가'}
          </Button>
        </div>

        <div className="space-y-2">
          {filteredItems.map((item, index) => {
            const areaConfig = goalAreaConfig[item.area]
            const isEditing = editingId === item.id
            const isActive = item.active ?? true

            return (
              <div key={item.id}>
                {isEditing ? (
                  // Edit Mode
                  <div className="p-4 border-2 border-primary rounded-lg bg-primary/5 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label>목표 제목</Label>
                        <Input
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          placeholder="목표 제목"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>영역</Label>
                        <Select
                          value={editForm.area}
                          onValueChange={(value) => setEditForm({ ...editForm, area: value as GoalArea })}
                        >
                          <SelectTrigger>
                            <span>{goalAreaConfig[editForm.area].label}</span>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(goalAreaConfig).map(([key, config]) => (
                              <SelectItem key={key} value={key}>
                                {config.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>주기</Label>
                        <Select
                          value={editForm.period}
                          onValueChange={(value) => setEditForm({ ...editForm, period: value as Period })}
                        >
                          <SelectTrigger>
                            <span>{periodLabels[editForm.period]}</span>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(periodLabels).map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>기본 목표</Label>
                        <Input
                          type="number"
                          min={1}
                          value={editForm.defaultTarget}
                          onChange={(e) => setEditForm({ ...editForm, defaultTarget: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>목표 단위</Label>
                        <Input
                          placeholder="회/일"
                          value={editForm.targetUnit}
                          onChange={(e) => setEditForm({ ...editForm, targetUnit: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>월별 목표</Label>
                        <Input
                          type="number"
                          min={0}
                          value={editForm.monthlyTarget || ''}
                          onChange={(e) => setEditForm({ ...editForm, monthlyTarget: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>연별 목표</Label>
                        <Input
                          type="number"
                          min={0}
                          value={editForm.yearlyTarget || ''}
                          onChange={(e) => setEditForm({ ...editForm, yearlyTarget: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveEdit} size="sm" disabled={saving} className="flex-1">
                        <Check className="h-4 w-4 mr-1" />
                        {saving ? '저장 중...' : '저장'}
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex-1">
                        취소
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div
                    className={`flex items-center gap-3 p-3 border rounded-lg ${
                      !isActive ? "opacity-50 bg-muted/30" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === filteredItems.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge className={`${areaConfig.textColor} ${areaConfig.bgColor}`}>
                      {areaConfig.label}
                    </Badge>
                    <span className="flex-1 font-medium">
                      {item.title}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {periodLabels[item.period]} · {item.defaultTarget}{item.targetUnit && ` (${item.targetUnit})`}
                      {item.monthlyTarget > 0 && ` · 월 ${item.monthlyTarget}`}
                      {item.yearlyTarget > 0 && ` · 연 ${item.yearlyTarget}`}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(item.id)}
                    >
                      {isActive ? "활성" : "비활성"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
          {filteredItems.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              {showInactive ? "비활성화된 아이템이 없습니다." : "등록된 아이템이 없습니다."}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
