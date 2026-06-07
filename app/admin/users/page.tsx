import { UserTable } from "@/components/admin/UserTable"

export default function AdminUsersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">관리자 - 사용자 관리</h1>
          <p className="text-muted-foreground">
            사용자 정보를 관리하고 권한을 부여하세요
          </p>
        </div>

        <UserTable />
      </div>
    </div>
  )
}
