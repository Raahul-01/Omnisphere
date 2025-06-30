import { NextResponse } from 'next/server'

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5000'

// Function to fetch trending topics
async function fetchTrendingTopics() {
  try {
    const response = await fetch(`${PYTHON_API_URL}/api/trends`)
    if (!response.ok) throw new Error('Failed to fetch trends')
    return await response.json()
  } catch (error) {
    console.error('Error fetching trends:', error)
    return { trends: [] }
  }
}

// Function to fetch latest articles
async function fetchLatestArticles() {
  try {
    const response = await fetch(`${PYTHON_API_URL}/api/articles`)
    if (!response.ok) throw new Error('Failed to fetch articles')
    return await response.json()
  } catch (error) {
    console.error('Error fetching articles:', error)
    return { articles: [] }
  }
}

export async function GET() {
  try {
    if (!process.env.PYTHON_API_URL) {
      return NextResponse.json({
        success: false,
        message: 'PYTHON_API_URL environment variable is not set',
        timestamp: new Date().toISOString()
      }, { status: 400 })
    }

    // Fetch both trends and articles concurrently
    const [trendsData, articlesData] = await Promise.all([
      fetchTrendingTopics(),
      fetchLatestArticles()
    ])

    return NextResponse.json({
      success: true,
      message: 'Content fetched successfully',
      data: {
        trends: trendsData.trends,
        articles: articlesData.articles
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Automation error:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch content',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 