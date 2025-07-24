export default function ArticleLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Hero section */}
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-lg mb-8" />
      
      {/* Title */}
      <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-6" />
      
      {/* Author info */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full" />
        <div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24" />
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/6" />
      </div>
    </div>
  );
} 