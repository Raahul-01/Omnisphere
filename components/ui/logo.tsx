import Link from "next/link"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl"
  }

  return (
    <Link href="/" className={className}>
      <span className={`font-bold ${sizes[size]}`}>
        <span className="text-orange-500">Omini</span>
        <span>Sphere</span>
        <span className="text-orange-500">.</span>
      </span>
    </Link>
  )
} 