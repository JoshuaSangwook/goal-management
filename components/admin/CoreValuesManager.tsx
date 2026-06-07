"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Edit2, Check, ChevronDown, ChevronUp } from "lucide-react"

interface CoreValue {
  id: string
  title: string
  description: string
  icon: string
  verse?: string
  order: number
}

export function CoreValuesManager() {
  const [values, setValues] = useState<CoreValue[]>([])
  const [loading, setLoading] = useState(true)
  const [newValue, setNewValue] = useState({ title: "", description: "", icon: "Star", verse: "" })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: "", description: "", icon: "", verse: "" })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/core-values')
      if (!response.ok) throw new Error('Failed to fetch')

      const data = await response.json()
      setValues(data.coreValues)
    } catch (error) {
      console.error('Failed to fetch core values:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newValue.title || !newValue.description || !newValue.icon || !newValue.verse) {
      alert('모든 필드를 입력해주세요.')
      return
    }

    try {
      const response = await fetch('/api/admin/core-values', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newValue),
      })

      if (!response.ok) throw new Error('Failed to create')

      const created = await response.json()
      setValues([...values, created])
      setNewValue({ title: "", description: "", icon: "Star", verse: "" })
    } catch (error) {
      console.error('Failed to add core value:', error)
      alert('추가에 실패했습니다.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/core-values?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      setValues(values.filter((v) => v.id !== id))
    } catch (error) {
      console.error('Failed to delete core value:', error)
      alert('삭제에 실패했습니다.')
    }
  }

  const handleEdit = (value: CoreValue) => {
    setEditingId(value.id)
    setEditForm({
      title: value.title,
      description: value.description,
      icon: value.icon,
      verse: value.verse || "",
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({ title: "", description: "", icon: "", verse: "" })
  }

  const handleSaveEdit = async () => {
    if (!editingId || !editForm.title || !editForm.description || !editForm.icon) {
      alert('모든 필드를 입력해주세요.')
      return
    }

    try {
      const response = await fetch('/api/admin/core-values', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          ...editForm,
        }),
      })

      if (!response.ok) throw new Error('Failed to update')

      const updated = await response.json()
      setValues(values.map((v) => v.id === editingId ? updated : v))
      setEditingId(null)
      setEditForm({ title: "", description: "", icon: "", verse: "" })
    } catch (error) {
      console.error('Failed to update core value:', error)
      alert('수정에 실패했습니다.')
    }
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newValues = [...values]
    const temp = newValues[index - 1]
    newValues[index - 1] = { ...newValues[index], order: newValues[index - 1].order }
    newValues[index] = { ...temp, order: temp.order + 1 }
    setValues(newValues)
  }

  const moveDown = (index: number) => {
    if (index === values.length - 1) return
    const newValues = [...values]
    const temp = newValues[index + 1]
    newValues[index + 1] = { ...newValues[index], order: newValues[index + 1].order }
    newValues[index] = { ...temp, order: temp.order - 1 }
    setValues(newValues)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>핵심가치 관리</CardTitle>
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
        <CardTitle>핵심가치 관리</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Form */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="value-title">제목</Label>
              <Input
                id="value-title"
                placeholder="예: 정직"
                value={newValue.title}
                onChange={(e) => setNewValue({ ...newValue, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value-icon">아이콘</Label>
              <Input
                id="value-icon"
                placeholder="예: Shield"
                value={newValue.icon}
                onChange={(e) => setNewValue({ ...newValue, icon: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="value-desc">설명</Label>
              <Input
                id="value-desc"
                placeholder="예: 거짓을 버리고 참된 것을 말하기"
                value={newValue.description}
                onChange={(e) => setNewValue({ ...newValue, description: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="value-verse">성경 구절</Label>
              <Input
                id="value-verse"
                placeholder="예: 엡 4:25"
                value={newValue.verse}
                onChange={(e) => setNewValue({ ...newValue, verse: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleAdd} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            추가
          </Button>
        </div>

        {/* List */}
        <div className="space-y-2">
          {values.map((value, index) => (
            <div key={value.id}>
              {editingId === value.id ? (
                /* Edit Form */
                <div className="p-4 border-2 border-primary rounded-lg bg-primary/5 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>제목</Label>
                      <Input
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>아이콘</Label>
                      <Input
                        value={editForm.icon}
                        onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>설명</Label>
                      <Input
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>성경 구절</Label>
                      <Input
                        value={editForm.verse}
                        onChange={(e) => setEditForm({ ...editForm, verse: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit} size="sm" className="flex-1">
                      <Check className="h-4 w-4 mr-1" />
                      저장
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex-1">
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                /* Display Item */
                <div className="flex items-center gap-3 p-3 border rounded-lg group hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0"
                      onClick={() => moveDown(index)}
                      disabled={index === values.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge variant="outline">{value.title}</Badge>
                  {value.verse && (
                    <span className="text-xs text-muted-foreground">({value.verse})</span>
                  )}
                  <span className="text-sm text-muted-foreground flex-1">
                    {value.description}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(value)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(value.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
