import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const testFirestoreConnection = async () => {
  try {
    console.log('Testing Firestore connection...');
    const testQuery = await getDocs(collection(db, 'generated_content'));
    console.log('Firestore Test Results:', {
      isQuerySuccessful: true,
      documentsFound: testQuery.size,
      firstDocumentFields: testQuery.docs[0]?.data() ? Object.keys(testQuery.docs[0].data()) : null
    });
    return true;
  } catch (error) {
    console.error('Firestore Connection Test Failed:', error);
    return false;
  }
}; 