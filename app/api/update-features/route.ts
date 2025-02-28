import { adminDb } from '@/lib/firebase-admin'
import { NextResponse } from 'next/server'
import { evaluateContentFeatures } from '@/lib/content-criteria'

export async function GET() {
  try {
    const contentRef = adminDb.collection('generated_content')
    const snapshot = await contentRef.get()
    const updates = []

    for (const doc of snapshot.docs) {
      const data = doc.data()
      const features = evaluateContentFeatures({
        time: data.time,
        views: data.views || 0,
        likes: data.likes || 0,
        shares: data.shares || 0
      })

      // Only update if features have changed
      if (JSON.stringify(data.features) !== JSON.stringify(features)) {
        updates.push(doc.ref.update({ features }))
      }
    }

    await Promise.all(updates)

    return NextResponse.json({
      success: true,
      message: `Updated features for ${updates.length} documents`
    })
  } catch (error) {
    console.error('Error updating features:', error)
    return NextResponse.json({
      error: 'Failed to update features',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { features } = body

    await adminDb.collection('features').doc('settings').set({
      features
    }, { merge: true })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating features:', error)
    return NextResponse.json({ error: 'Failed to update features' }, { status: 500 })
  }
} 