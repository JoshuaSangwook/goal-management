import { SignupForm } from "@/components/auth/SignupForm"

export default function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">계정 만들기</h1>
          <p className="text-muted-foreground">
            목표 달성을 위한 새로운 여정을 시작하세요
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
