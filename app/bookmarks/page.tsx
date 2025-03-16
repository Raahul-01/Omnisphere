import { Button } from "@/components/ui/button"
import { Plus, Bookmark, MoreVertical } from "lucide-react"

export default function Bookmarks() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex-1 md:ml-[260px]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
            {/* Remove SearchBar component if it exists */}
          </div>
          <div className="py-4 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold">Bookmarks</h1>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Bookmark
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 hover:border-primary transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Bookmark className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Bookmark {i + 1}</h3>
                      <p className="text-sm text-muted-foreground">{5 + i} articles</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

