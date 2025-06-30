"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// Firebase removed - using mock auth
import { auth } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push("/profile")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/profile")
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 flex">
        {/* Left Section - Branding */}
        <div className="hidden lg:flex lg:flex-1 bg-muted items-center justify-center p-8">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-primary mb-4">OmniSphere</h1>
            <p className="text-xl text-muted-foreground">
              Your trusted source for the latest news and updates from around the world.
            </p>
          </div>
        </div>

        {/* Right Section - Sign In Form */}
        <div className="w-full lg:flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
              <p className="text-muted-foreground mt-2">Please sign in to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="text-sm">
                    Remember me
                  </label>
                </div>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

              <Button type="submit" className="w-full">
                Sign in
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/sign-up" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-muted border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-muted-foreground">
              &copy; {new Date().getFullYear()} OmniSphere. All rights reserved.
            </p>
          </div>
          <div className="flex justify-center space-x-6 md:order-2">
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              {[
                ["Categories", "/categories"],
                ["Bookmarks", "/bookmarks"],
                ["Saved", "/saved"],
                ["History", "/history"],
                ["Help", "/help"],
                ["Privacy Policy", "/privacy"],
                ["Terms", "/terms"],
              ].map(([name, href]) => (
                <Link key={name} href={href} className="text-xs leading-5 text-muted-foreground hover:text-foreground">
                  {name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

