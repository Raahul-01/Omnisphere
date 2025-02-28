import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export async function GET() {
  try {
    const contentRef = collection(db, "generated_content")
    const snapshot = await getDocs(contentRef)
    const documents = []

    for (const doc of snapshot.docs) {
      const data = doc.data()
      documents.push({
        id: doc.id,
        features: data.features,
        headline: data.headline,
        time: data.time
      })
    }

    return NextResponse.json({
      total_documents: snapshot.size,
      documents: documents
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({
      error: 'Failed to fetch documents',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 