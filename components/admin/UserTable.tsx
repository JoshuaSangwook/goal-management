"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Shield, ShieldOff } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "USER"
  active: boolean
  achievementRate?: number
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Failed to fetch')

      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggleActive = async (id: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: id,
          action: 'toggleActive',
        }),
      })

      if (!response.ok) throw new Error('Failed to update')

      const updated = await response.json()
      setUsers(users.map((user) => (user.id === id ? updated : user)))
    } catch (error) {
      console.error('Failed to toggle active:', error)
      alert('상태 변경에 실패했습니다.')
    }
  }

  const handleToggleRole = async (id: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: id,
          action: 'toggleRole',
        }),
      })

      if (!response.ok) throw new Error('Failed to update')

      const updated = await response.json()
      setUsers(users.map((user) => (user.id === id ? updated : user)))
    } catch (error) {
      console.error('Failed to toggle role:', error)
      alert('권한 변경에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>사용자 관리</CardTitle>
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
        <CardTitle>사용자 관리</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="이름 또는 이메일 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="rounded-md border">
          <div className="grid grid-cols-5 gap-4 p-3 bg-muted font-medium text-sm">
            <div>이름</div>
            <div>이메일</div>
            <div>역할</div>
            <div>달성률</div>
            <div className="text-right">작업</div>
          </div>
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-5 gap-4 p-3 border-t items-center"
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
              <div>
                <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                  {user.role === "ADMIN" ? (
                    <>
                      <Shield className="h-3 w-3 mr-1" />
                      관리자
                    </>
                  ) : (
                    "사용자"
                  )}
                </Badge>
              </div>
              <div>
                <span className={`font-bold ${
                  (user.achievementRate || 0) >= 90
                    ? "text-green-600"
                    : (user.achievementRate || 0) >= 70
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}>
                  {user.achievementRate?.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(user.id)}
                >
                  {user.active ? "비활성" : "활성"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleToggleRole(user.id)}
                >
                  {user.role === "ADMIN" ? (
                    <Shield className="h-4 w-4" />
                  ) : (
                    <ShieldOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
