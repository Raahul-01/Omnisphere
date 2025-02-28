import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

const samplePosts = [
  {
    headline: "Latest Sports Update: Major Tournament Announced",
    category: '"Sports"',
    content: "A major sports tournament has been announced for next month. Teams from around the world will compete for the championship title.",
    user: "Sports Reporter",
    time: new Date().toISOString(),
    image_url: "https://source.unsplash.com/random/800x600?sports"
  },
  {
    headline: "Breaking Entertainment News: New Movie Release",
    category: '"Entertainment"',
    content: "A highly anticipated movie is set to release next week. Critics are already praising the performances and direction.",
    user: "Entertainment Weekly",
    time: new Date().toISOString(),
    image_url: "https://source.unsplash.com/random/800x600?movie"
  },
  {
    headline: "Technology Breakthrough: New Innovation Revealed",
    category: '"Technology"',
    content: "Scientists have announced a breakthrough in technology that could revolutionize how we use mobile devices.",
    user: "Tech Insider",
    time: new Date().toISOString(),
    image_url: "https://source.unsplash.com/random/800x600?technology"
  }
]

export async function GET() {
  try {
    const results = []
    
    // Add each sample post to Firestore
    for (const post of samplePosts) {
      const docRef = await addDoc(collection(db, "generated_content"), post)
      results.push({
        id: docRef.id,
        ...post
      })
    }

    return NextResponse.json({
      success: true,
      message: "Sample posts created",
      posts: results
    })
  } catch (error) {
    console.error('Error creating sample posts:', error)
    return NextResponse.json({
      error: 'Failed to create sample posts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 
