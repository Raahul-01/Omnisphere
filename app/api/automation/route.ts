import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

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

// Function to update Firebase with new content
async function updateFirebaseContent(content: any) {
  try {
    const batch = adminDb.batch()
    
    // Update trends
    if (content.trends?.length > 0) {
      const trendsRef = adminDb.collection('trends').doc('latest')
      batch.set(trendsRef, { 
        trends: content.trends,
        updatedAt: new Date().toISOString()
      })
    }

    // Update articles
    if (content.articles?.length > 0) {
      for (const article of content.articles) {
        if (!article.title || !article.content) continue;
        
        const articleRef = adminDb.collection('generated_content').doc()
        batch.set(articleRef, {
          ...article,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    }

    await batch.commit()
    return true
  } catch (error) {
    console.error('Error updating Firebase:', error)
    return false
  }
}

export async function GET() {
  try {
    if (!process.env.PYTHON_API_URL) {
      throw new Error('PYTHON_API_URL environment variable is not set')
    }

    // Fetch both trends and articles concurrently
    const [trendsData, articlesData] = await Promise.all([
      fetchTrendingTopics(),
      fetchLatestArticles()
    ])

    // Update Firebase with new content
    const updated = await updateFirebaseContent({
      trends: trendsData.trends,
      articles: articlesData.articles
    })

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      updated,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Automation error:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update content',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 