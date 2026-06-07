import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">환영합니다!</h1>
          <p className="text-muted-foreground">
            목표 달성 시스템에 로그인하세요
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
