import { db } from './firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { Article } from './types';

// Enhanced error handling wrapper
async function withRetry<T>(
  operation: () => Promise<T>, 
  retries = 3, 
  delay = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('All retry attempts failed');
}

// Convert Firestore document to Article
function docToArticle(doc: any): Article {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.original_headline || data.headline || data.title || "Untitled",
    content: data.content || "",
    author: {
      name: data.user || data.author?.name || "Anonymous",
      avatar: data.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user || 'anonymous'}`
    },
    category: data.category || "General",
    timestamp: data.time || data.timestamp || new Date().toISOString(),
    image: data.image_url || data.image || "/placeholder.jpg",
    tags: data.tags || [],
    features: data.features || {},
    content_type: data.content_type,
    trending_topics: data.trending_topics,
    original_headline: data.original_headline,
    headline: data.headline,
    user: data.user,
    time: data.time,
    image_url: data.image_url
  };
}

// Get articles by category
export async function getArticlesByCategory(category: string, limitCount = 20): Promise<Article[]> {
  return withRetry(async () => {
    console.log(`🔄 Fetching articles for category: ${category}`);
    
    try {
      // Try with category filter first
      const q = query(
        collection(db, 'generated_content'),
        where('category', '==', category),
        orderBy('time', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      console.log(`✅ Found ${snapshot.size} articles for category ${category}`);
      
      if (snapshot.size > 0) {
        return snapshot.docs.map(docToArticle);
      }
    } catch (error) {
      console.warn(`Category query failed for ${category}, using fallback:`, error);
    }
    
    // Fallback: fetch all and filter
    const allQuery = query(
      collection(db, 'generated_content'),
      orderBy('time', 'desc'),
      limit(limitCount * 2)
    );
    
    const allSnapshot = await getDocs(allQuery);
    const allArticles = allSnapshot.docs.map(docToArticle);
    
    // Filter by category (case-insensitive)
    const filtered = allArticles.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    );
    
    return filtered.slice(0, limitCount);
  });
}

// Get all articles
export async function getAllArticles(limitCount = 50): Promise<Article[]> {
  return withRetry(async () => {
    console.log('🔄 Fetching all articles...');
    
    const q = query(
      collection(db, 'generated_content'),
      orderBy('time', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    console.log(`✅ Found ${snapshot.size} articles`);
    
    return snapshot.docs.map(docToArticle);
  });
}

// Get article by ID
export async function getArticleById(id: string): Promise<Article | null> {
  return withRetry(async () => {
    console.log(`🔄 Fetching article: ${id}`);
    
    const docRef = doc(db, 'generated_content', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.log('Article not found:', id);
      return null;
    }
    
    return docToArticle(docSnap);
  });
}

// Get articles by feature
export async function getArticlesByFeature(feature: string, limitCount = 20): Promise<Article[]> {
  return withRetry(async () => {
    console.log(`🔄 Fetching articles with feature: ${feature}`);
    
    try {
      const q = query(
        collection(db, 'generated_content'),
        where(`features.${feature}`, '==', true),
        orderBy('time', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      console.log(`✅ Found ${snapshot.size} articles with feature ${feature}`);
      
      if (snapshot.size > 0) {
        return snapshot.docs.map(docToArticle);
      }
    } catch (error) {
      console.warn(`Feature query failed for ${feature}, using fallback:`, error);
    }
    
    // Fallback: fetch all and filter
    const allArticles = await getAllArticles(limitCount * 2);
    return allArticles.filter(article => 
      article.features && (article.features as any)[feature] === true
    ).slice(0, limitCount);
  });
}

// Search articles
export async function searchArticles(searchTerm: string, limitCount = 20): Promise<Article[]> {
  return withRetry(async () => {
    console.log(`🔄 Searching articles for: ${searchTerm}`);
    
    // Since Firestore doesn't support full-text search, we'll fetch all and filter
    const allArticles = await getAllArticles(100);
    
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = allArticles.filter(article => 
      article.title.toLowerCase().includes(searchTermLower) ||
      article.content.toLowerCase().includes(searchTermLower) ||
      article.category.toLowerCase().includes(searchTermLower) ||
      (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTermLower)))
    );
    
    console.log(`✅ Found ${filtered.length} articles matching "${searchTerm}"`);
    return filtered.slice(0, limitCount);
  });
}

// Get trending articles
export async function getTrendingArticles(limitCount = 10): Promise<Article[]> {
  return getArticlesByFeature('trending_news', limitCount);
}

// Get breaking news articles
export async function getBreakingNewsArticles(limitCount = 5): Promise<Article[]> {
  return getArticlesByFeature('breaking_news', limitCount);
}

// Get featured articles
export async function getFeaturedArticles(limitCount = 10): Promise<Article[]> {
  return getArticlesByFeature('home', limitCount);
}

// Get articles by multiple categories
export async function getArticlesByCategories(categories: string[], limitCount = 20): Promise<Article[]> {
  const allPromises = categories.map(category => getArticlesByCategory(category, Math.ceil(limitCount / categories.length)));
  const results = await Promise.all(allPromises);
  
  // Flatten and sort by timestamp
  const allArticles = results.flat().sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Remove duplicates and limit
  const uniqueArticles = allArticles.filter((article, index, self) => 
    index === self.findIndex(a => a.id === article.id)
  );
  
  return uniqueArticles.slice(0, limitCount);
}
