"use client"

import React, { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export function AuthForm() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (isSignIn) {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
      router.push("/")
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication")
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isSignIn ? "Sign In" : "Create Account"}
      </h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isSignIn ? "Sign In" : "Create Account"}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          onClick={() => setIsSignIn(!isSignIn)}
          className="text-sm text-blue-600 hover:underline"
        >
          {isSignIn
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  )
} 