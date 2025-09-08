"use client"

import { useConvexAuth } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Navbar() {
  const { isAuthenticated } = useConvexAuth()
  const { signOut } = useAuthActions()
  const router = useRouter()

  const handleSignOut = () => {
    void signOut().then(() => {
      router.push("/signin")
    })
  }

  return (
    <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800">
      <nav className="flex flex-row justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            Convex + Next.js + Convex Auth
          </Link>
          <div className="hidden md:flex gap-4">
            <Link 
              href="/" 
              className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/server" 
              className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Server Route
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button
              className="bg-slate-200 dark:bg-slate-800 text-foreground rounded-md px-3 py-2 text-sm hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/signin"
              className="bg-blue-600 text-white rounded-md px-3 py-2 text-sm hover:bg-blue-700 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
