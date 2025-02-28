import { Card } from "@/components/ui/card"
import { Briefcase } from "lucide-react"

export default function LoadingJobs() {
  return (
    <div className="container relative mx-auto px-4 py-6 ml-[240px] max-w-[calc(100vw-240px)]">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Briefcase className="w-8 h-8 text-primary/50" />
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-4 w-96 mx-auto bg-muted rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-[500px] animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg" />
            <div className="p-6 space-y-4">
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-muted rounded" />
                <div className="h-6 w-16 bg-muted rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 