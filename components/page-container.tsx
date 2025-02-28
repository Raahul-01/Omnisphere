export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen relative bg-gray-50 dark:bg-[#0c0c0c]">
      <div className="absolute top-14 left-0 right-0 bottom-0 md:left-[240px]">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}