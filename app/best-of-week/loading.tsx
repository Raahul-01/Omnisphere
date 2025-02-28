import { Card } from "@/components/ui/card"
import { Award } from "lucide-react"

export default function LoadingBestOfWeek() {
  return (
    <div className="container relative mx-auto px-4 py-6 ml-[240px] max-w-[calc(100vw-240px)]">
      {/* Header Skeleton */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Award className="w-8 h-8 text-yellow-500/50" />
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-4 w-96 mx-auto bg-muted rounded animate-pulse" />
      </div>

      {/* Timeline Skeleton */}
      <div className="relative max-w-5xl mx-auto">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-muted" />
        
        {[1, 2, 3].map((i) => (
          <div key={i} className={`mb-8 ${i % 2 === 0 ? 'pr-[50%]' : 'pl-[50%]'}`}>
            <Card className="animate-pulse">
              <div className="flex p-4">
                <div className="w-1/3 bg-muted rounded h-40" />
                <div className="w-2/3 pl-4 space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
} 