import { NextResponse } from 'next/server'

// Simplified API route for build process
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Automation endpoint',
    timestamp: new Date().toISOString()
  })
} 