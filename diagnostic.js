// Firebase Data Diagnostic Script
// Run this in the browser console to debug Firebase data fetching issues

import { db } from './lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

async function diagnoseProblem() {
  console.log('🔍 Starting Firebase diagnostics...');
  
  try {
    // Test 1: Check generated_content collection
    console.log('\n📊 Testing generated_content collection...');
    const generatedQuery = query(collection(db, 'generated_content'), limit(5));
    const generatedSnapshot = await getDocs(generatedQuery);
    console.log(`Found ${generatedSnapshot.size} documents in generated_content`);
    
    if (!generatedSnapshot.empty) {
      const sample = generatedSnapshot.docs[0].data();
      console.log('Sample generated_content document:', sample);
    }
    
    // Test 2: Check articles collection  
    console.log('\n📰 Testing articles collection...');
    const articlesQuery = query(collection(db, 'articles'), limit(5));
    const articlesSnapshot = await getDocs(articlesQuery);
    console.log(`Found ${articlesSnapshot.size} documents in articles`);
    
    if (!articlesSnapshot.empty) {
      const sample = articlesSnapshot.docs[0].data();
      console.log('Sample articles document:', sample);
    }
    
    // Test 3: Check for any other collections
    console.log('\n🔍 Firebase connection successful!');
    console.log('✅ Diagnostic complete');
    
  } catch (error) {
    console.error('❌ Firebase diagnostic failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message
    });
  }
}

// Auto-run diagnostic
diagnoseProblem();
