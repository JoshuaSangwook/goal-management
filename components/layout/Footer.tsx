import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2026 나눔 코칭. All rights reserved.
          </div>
          <div className="flex space-x-4 text-sm">
            {/* Reserved for future pages */}
          </div>
        </div>
      </div>
    </footer>
  )
}
