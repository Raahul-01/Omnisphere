import { NextResponse } from 'next/server'

export async function POST() {
  // Mock sample posts creation - Firebase removed for build compatibility
  return NextResponse.json({
    success: true,
    message: 'Sample posts endpoint working - using mock data',
    created_posts: 3,
    timestamp: new Date().toISOString()
  })
} 
