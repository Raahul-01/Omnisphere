export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-6 ml-[240px]">
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
} 