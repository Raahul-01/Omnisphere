import { NextResponse } from 'next/server'

export async function POST() {
  // Mock test post creation - Firebase removed for build compatibility
  return NextResponse.json({
    success: true,
    message: 'Test post endpoint working - using mock data',
    post: {
      id: 'test-post-1',
      title: 'Test Post',
      content: 'This is a test post for API validation',
      timestamp: new Date().toISOString()
    }
  })
} 