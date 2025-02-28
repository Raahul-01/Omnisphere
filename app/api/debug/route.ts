import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export async function GET() {
  try {
    const allDocs = await getDocs(collection(db, "generated_content"))
    const data: any[] = []
    
    allDocs.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data()
      })
    })

    return NextResponse.json({
      totalDocuments: allDocs.size,
      documents: data
    })
  } catch (error) {
    console.error('Debug route error:', error)
    return NextResponse.json({
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 