import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

// Function to fetch breaking news
export const fetchBreakingNews = async (limitCount = 20) => {
  try {
    console.log('Attempting to fetch breaking news...');
    const q = query(
      collection(db, 'generated_content'),
      orderBy('time', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    logDocumentStructure(querySnapshot);
    
    // Filter breaking news after fetching
    const breakingNews = querySnapshot.docs
      .filter(doc => doc.data().features?.breaking_news === true)
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    
    console.log('Filtered Breaking News:', breakingNews.length);
    return breakingNews;
  } catch (error) {
    console.error('Breaking News Error:', error);
    throw error;
  }
};

// Debug function to log document structure
const logDocumentStructure = (querySnapshot) => {
  console.log('Document Structure Check:', {
    totalDocs: querySnapshot.size,
    documents: querySnapshot.docs.map(doc => ({
      id: doc.id,
      path: doc.ref.path,
      allFields: doc.data(),
    }))
  });
};

// Function to fetch trending news
export const fetchTrendingNews = async (limitCount = 20) => {
  try {
    console.log('Attempting to fetch trending news...');
    const q = query(
      collection(db, 'generated_content'),
      orderBy('time', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    logDocumentStructure(querySnapshot);
    
    // Filter trending news after fetching
    const trendingNews = querySnapshot.docs
      .filter(doc => doc.data().features?.trending_news === true)
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    
    console.log('Filtered Trending News:', trendingNews.length);
    return trendingNews;
  } catch (error) {
    console.error('Trending News Error:', error);
    throw error;
  }
};

// Function to fetch news by category
export const fetchNewsByCategory = async (category, limitCount = 20) => {
  try {
    console.log(`Attempting to fetch ${category} news...`);
    const q = query(
      collection(db, 'generated_content'),
      orderBy('time', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    logDocumentStructure(querySnapshot);
    
    // Filter by category after fetching
    const categoryNews = querySnapshot.docs
      .filter(doc => doc.data().category?.toLowerCase() === category.toLowerCase())
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    
    console.log(`Filtered ${category} News:`, categoryNews.length);
    return categoryNews;
  } catch (error) {
    console.error('Category News Error:', error);
    throw error;
  }
};

// Function to fetch all news
export const fetchAllNews = async (limitCount = 20) => {
  try {
    console.log('Attempting to fetch all news...');
    const q = query(
      collection(db, 'generated_content'),
      orderBy('time', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    logDocumentStructure(querySnapshot);
    
    const allNews = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('All News:', allNews.length);
    return allNews;
  } catch (error) {
    console.error('All News Error:', error);
    throw error;
  }
}; 