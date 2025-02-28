import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

export async function GET() {
  try {
    // Create a test document
    const docRef = await addDoc(collection(db, "generated_content"), {
      headline: "Test Post",
      category: "Sport",
      content: "This is a test post content.",
      user: "Test User",
      time: new Date().toISOString(),
      image_url: "https://source.unsplash.com/random/800x600?sport"
    })

    return NextResponse.json({
      success: true,
      message: "Test document created",
      documentId: docRef.id
    })
  } catch (error) {
    console.error('Error creating test document:', error)
    return NextResponse.json({
      error: 'Failed to create test document',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 