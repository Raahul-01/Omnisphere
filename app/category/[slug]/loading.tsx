export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="md:ml-[240px]">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-lg overflow-hidden">
                    <div className="h-48 bg-muted"></div>
                    <div className="p-4">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 