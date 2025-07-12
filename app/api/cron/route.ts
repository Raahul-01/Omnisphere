import { NextResponse } from 'next/server'

// Validate the cron secret to ensure only authorized calls are processed
const validateCronSecret = (request: Request) => {
  const authHeader = request.headers.get('authorization')
  const expectedSecret = process.env.CRON_SECRET
  return authHeader === `Bearer ${expectedSecret}`
}

export async function POST(request: Request) {
  // Validate the request
  if (!validateCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Trigger the automation endpoint
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/automation`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    return NextResponse.json({
      success: true,
      message: 'Cron job completed successfully',
      data
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({
      success: false,
      message: 'Cron job failed'
    }, { status: 500 })
  }
} 