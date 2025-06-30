import { NextResponse } from 'next/server'

export async function POST() {
  // Mock migration response - Firebase removed for build compatibility
  return NextResponse.json({
    success: true,
    message: 'Feature migration endpoint working - using mock data',
    migrated_count: 0,
    timestamp: new Date().toISOString()
  })
} 