import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')

    if (!imageUrl) {
      return new NextResponse('Image URL is required', { status: 400 })
    }

    const response = await fetch(imageUrl)
    const buffer = await response.arrayBuffer()
    const headers = new Headers(response.headers)
    
    // Ensure we're sending the correct content type
    headers.set('Content-Type', response.headers.get('content-type') || 'image/jpeg')
    headers.set('Cache-Control', 'public, max-age=31536000')

    return new NextResponse(buffer, {
      headers,
      status: response.status,
    })
  } catch (error) {
    console.error('Image proxy error:', error)
    return new NextResponse('Error loading image', { status: 500 })
  }
} 