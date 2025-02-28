import { SearchBar } from "@/components/search-bar"

export default function Settings() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex-1 md:ml-[260px]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
            <SearchBar />
          </div>
          <div className="py-4">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p>This is the settings page. You can customize your preferences here.</p>
          </div>
        </div>
      </div>
    </main>
  )
}

