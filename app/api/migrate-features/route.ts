import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'

export async function GET() {
  try {
    const contentRef = collection(db, "generated_content")
    const snapshot = await getDocs(contentRef)
    const updates = []

    for (const document of snapshot.docs) {
      const data = document.data()
      if (data.features) {
        const newFeatures = {
          home: data.features['Home'] || data.features.home || false,
          breaking_news: data.features['Breaking News'] || data.features.breaking_news || false,
          articles: data.features['Articles'] || data.features.articles || false,
          jobs_careers: data.features['Jobs/Careers'] || data.features.jobs_careers || false,
          trending_news: data.features['Trending News'] || data.features.trending_news || false,
          categories: data.features['Categories'] || data.features.categories || false,
          best_of_week: data.features['Best of Week'] || data.features.best_of_week || false,
          history: data.features['History'] || data.features.history || false,
          bookmarks: data.features['Bookmarks'] || data.features.bookmarks || false
        }

        updates.push(updateDoc(doc(db, 'generated_content', document.id), {
          features: newFeatures
        }))
      }
    }

    await Promise.all(updates)

    return NextResponse.json({
      success: true,
      message: `Updated ${updates.length} documents`
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({
      error: 'Failed to migrate documents',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 