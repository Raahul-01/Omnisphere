import { db } from '../lib/firebase';

async function migrateFeatureNames() {
  const batch = db.batch();
  const snapshot = await db.collection('generated_content').get();
  
  let count = 0;
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const features = data.features || {};
    
    // Create new features object with updated keys
    const updatedFeatures = {
      ...features,
      breakingNews: features['Breaking News'] || false,
    };
    
    // Remove old key
    delete updatedFeatures['Breaking News'];
    
    // Update document
    batch.update(doc.ref, {
      features: updatedFeatures
    });
    
    count++;
    
    // Firestore has a limit of 500 operations per batch
    if (count % 500 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }
  
  // Commit any remaining updates
  if (count % 500 !== 0) {
    await batch.commit();
  }
  
  console.log(`Updated ${count} documents`);
}

// Run the migration
migrateFeatureNames()
  .then(() => console.log('Migration completed successfully'))
  .catch(error => console.error('Migration failed:', error)); 