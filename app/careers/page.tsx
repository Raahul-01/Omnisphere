import { Metadata } from "next"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Jobs & Careers | Omnisphere",
  description: "Find your next career opportunity",
}

export default function CareersPage() {
  return (
    <div className="md:ml-[240px] p-4">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Jobs & Careers</h1>
          <Button variant="secondary">Post a Job</Button>
        </div>

        <div className="space-y-4">
          {/* Sample job listings */}
          <div className="bg-card rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Senior Software Engineer</h2>
              <p className="text-muted-foreground">TechCorp Inc.</p>
            </div>
            <p className="text-muted-foreground mb-4">
              We are looking for an experienced software engineer to join our team and help build scalable solutions...
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Remote</span>
              <span>•</span>
              <span>Full-time</span>
              <span>•</span>
              <span>$120k - $180k</span>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Product Designer</h2>
              <p className="text-muted-foreground">Design Studio X</p>
            </div>
            <p className="text-muted-foreground mb-4">
              Join our creative team to design beautiful and functional user experiences...
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Hybrid</span>
              <span>•</span>
              <span>Full-time</span>
              <span>•</span>
              <span>$90k - $130k</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 