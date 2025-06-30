import { NextResponse } from 'next/server'

export async function GET() {
  // Mock debug response - Firebase removed for build compatibility
  return NextResponse.json({
    total_documents: 10,
    documents: [
      {
        id: 'debug-1',
        features: { home: true, trending_news: false, breaking_news: false },
        headline: 'Sample Debug Article',
        time: new Date().toISOString()
      },
      {
        id: 'debug-2', 
        features: { home: false, trending_news: true, breaking_news: false },
        headline: 'Another Debug Article',
        time: new Date().toISOString()
      }
    ],
    message: 'Debug endpoint working - using mock data'
  })
} 