"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/lib/auth-context"
import { AuthForm } from "@/components/auth/auth-form"

export default function AuthPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/")
      router.refresh()
    }
  }, [user, loading, router])

  // Don't render anything while checking auth state
  if (loading) {
    return null
  }

  // Don't render the form if user is logged in
  if (user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AuthForm />
    </div>
  )
} 