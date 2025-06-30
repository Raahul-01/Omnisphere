import { NextResponse } from 'next/server'

export async function GET() {
  // Mock debug response - Firebase removed for build compatibility
  return NextResponse.json({
    totalDocuments: 5,
    documents: [
      {
        id: 'mock-1',
        title: 'Mock Article 1',
        content: 'This is a mock article for debugging',
        category: 'Technology',
        time: new Date().toISOString()
      },
      {
        id: 'mock-2',
        title: 'Mock Article 2', 
        content: 'Another mock article for debugging',
        category: 'Business',
        time: new Date().toISOString()
      }
    ],
    message: 'Debug API working with mock data'
  })
} 