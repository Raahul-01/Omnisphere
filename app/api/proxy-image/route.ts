import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')

  if (!imageUrl) {
    return new NextResponse('Missing image URL', { status: 400 })
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status} ${response.statusText}`)
      return new NextResponse('Failed to fetch image', { status: response.status })
    }

    const contentType = response.headers.get('content-type')
    
    // Handle cases where content type might be text/html for some social media platforms
    if (contentType?.startsWith('text/html')) {
      // For social media platforms that return HTML instead of direct images
      return new NextResponse('Redirect to default image', {
        status: 307,
        headers: {
          'Location': '/placeholder.jpg'
        }
      })
    }

    if (!contentType?.startsWith('image/')) {
      console.error(`Invalid content type: ${contentType}`)
      return new NextResponse('Invalid image content type', { status: 400 })
    }

    const buffer = await response.arrayBuffer()
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*'
      },
    })
  } catch (error) {
    console.error('Error proxying image:', error)
    // Return a redirect to the default placeholder image
    return new NextResponse('Redirect to default image', {
      status: 307,
      headers: {
        'Location': '/placeholder.jpg'
      }
    })
  }
} 