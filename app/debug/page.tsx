"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchAllContent, fetchBreakingNews, fetchTrendingNews, FeedItem } from '@/lib/firebase-utils'

export default function DebugPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{
    allContent: FeedItem[];
    breakingNews: FeedItem[];
    trendingNews: FeedItem[];
  }>({
    allContent: [],
    breakingNews: [],
    trendingNews: []
  })
  const [error, setError] = useState<string | null>(null)

  const runDiagnostics = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('🔍 Starting Firebase diagnostics...')
      
      // Test all content fetch
      const allContent = await fetchAllContent(10)
      console.log('✅ fetchAllContent result:', allContent)
      
      // Test breaking news fetch
      const breakingNews = await fetchBreakingNews(5)
      console.log('✅ fetchBreakingNews result:', breakingNews)
      
      // Test trending news fetch
      const trendingNews = await fetchTrendingNews(5)
      console.log('✅ fetchTrendingNews result:', trendingNews)
      
      setResults({
        allContent,
        breakingNews,
        trendingNews
      })
      
    } catch (error: any) {
      console.error('❌ Diagnostic failed:', error)
      setError(error.message || 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Firebase Debug Dashboard</h1>
        <p className="text-muted-foreground">
          Diagnose Firebase data fetching issues
        </p>
      </div>
      
      <div className="mb-6">
        <Button 
          onClick={runDiagnostics} 
          disabled={isLoading}
          className="mr-4"
        >
          {isLoading ? 'Running Diagnostics...' : 'Refresh Diagnostics'}
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* All Content */}
        <Card>
          <CardHeader>
            <CardTitle>All Content</CardTitle>
            <p className="text-sm text-muted-foreground">
              Total: {results.allContent.length} items
            </p>
          </CardHeader>
          <CardContent>
            {results.allContent.length > 0 ? (
              <div className="space-y-2">
                {results.allContent.slice(0, 3).map((item, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                    <p className="font-medium">{item.title.substring(0, 50)}...</p>
                    <p className="text-gray-600">By: {item.author.name}</p>
                    <p className="text-gray-500">Category: {item.category}</p>
                  </div>
                ))}
                {results.allContent.length > 3 && (
                  <p className="text-sm text-gray-500">
                    +{results.allContent.length - 3} more items
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No content found</p>
            )}
          </CardContent>
        </Card>

        {/* Breaking News */}
        <Card>
          <CardHeader>
            <CardTitle>Breaking News</CardTitle>
            <p className="text-sm text-muted-foreground">
              Total: {results.breakingNews.length} items
            </p>
          </CardHeader>
          <CardContent>
            {results.breakingNews.length > 0 ? (
              <div className="space-y-2">
                {results.breakingNews.slice(0, 3).map((item, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                    <p className="font-medium">{item.title.substring(0, 50)}...</p>
                    <p className="text-gray-600">By: {item.author.name}</p>
                    <p className="text-gray-500">Category: {item.category}</p>
                  </div>
                ))}
                {results.breakingNews.length > 3 && (
                  <p className="text-sm text-gray-500">
                    +{results.breakingNews.length - 3} more items
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No breaking news found</p>
            )}
          </CardContent>
        </Card>

        {/* Trending News */}
        <Card>
          <CardHeader>
            <CardTitle>Trending News</CardTitle>
            <p className="text-sm text-muted-foreground">
              Total: {results.trendingNews.length} items
            </p>
          </CardHeader>
          <CardContent>
            {results.trendingNews.length > 0 ? (
              <div className="space-y-2">
                {results.trendingNews.slice(0, 3).map((item, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                    <p className="font-medium">{item.title.substring(0, 50)}...</p>
                    <p className="text-gray-600">By: {item.author.name}</p>
                    <p className="text-gray-500">Category: {item.category}</p>
                  </div>
                ))}
                {results.trendingNews.length > 3 && (
                  <p className="text-sm text-gray-500">
                    +{results.trendingNews.length - 3} more items
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No trending news found</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Raw Data Display */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Raw Data Sample</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs">
            <h4 className="font-medium mb-2">First Article Raw Data:</h4>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
              {results.allContent.length > 0 
                ? JSON.stringify(results.allContent[0], null, 2)
                : 'No data available'
              }
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
