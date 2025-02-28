"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface BackButtonProps {
  className?: string
}

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className={cn(
        "gap-1 px-2 h-8 text-muted-foreground hover:text-foreground transition-colors duration-200",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="text-sm">Back</span>
    </Button>
  )
} 