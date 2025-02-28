import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: Request) {
  const headersList = headers()
  const authHeader = headersList.get('authorization')

  // Verify the request is from our cron job
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // Call our update features endpoint
    const response = await fetch(`${request.url.split('/cron')[0]}/api/update-features`)
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({
      error: 'Failed to run feature update cron job',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 