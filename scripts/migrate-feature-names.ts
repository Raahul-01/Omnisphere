import { db } from '@/lib/firebase'

const FEATURE_NAME_MAPPING = {
  'Breaking News': 'breaking_news',
  'Best of Week': 'best_of_week',
  'Trending News': 'trending_news',
} as const

async function migrateFeatureNames() {
  console.log('Starting feature names migration...')
  
  try {
    const snapshot = await db.collection('generated_content').get()
    console.log(`Found ${snapshot.size} documents to process`)
    
    let batchCount = 0
    let batch = db.batch()
    let updateCount = 0
    
    for (const doc of snapshot.docs) {
      const data = doc.data()
      let needsUpdate = false
      const newFeatures = { ...data.features }
      
      // Check for each old feature name
      for (const [oldName, newName] of Object.entries(FEATURE_NAME_MAPPING)) {
        if (data.features && oldName in data.features) {
          newFeatures[newName] = data.features[oldName]
          delete newFeatures[oldName]
          needsUpdate = true
        }
      }
      
      if (needsUpdate) {
        batch.update(doc.ref, { features: newFeatures })
        updateCount++
        
        // Commit batch every 500 updates (Firestore limit)
        if (updateCount % 500 === 0) {
          console.log(`Committing batch ${++batchCount}...`)
          await batch.commit()
          batch = db.batch()
        }
      }
    }
    
    // Commit any remaining updates
    if (updateCount % 500 !== 0) {
      console.log(`Committing final batch...`)
      await batch.commit()
    }
    
    console.log(`Migration completed successfully. Updated ${updateCount} documents.`)
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

// Run migration
migrateFeatureNames()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Migration failed:', error)
    process.exit(1)
  }) 