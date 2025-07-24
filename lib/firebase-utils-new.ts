import { db } from '@/lib/firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  startAfter
} from 'firebase/firestore';

export interface FeedItem {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  timestamp: string;
  image: string;
  features?: {
    // Old format (underscore)
    breaking_news?: boolean;
    trending_news?: boolean;
    home?: boolean;
    // New format (space and capitals) - matches your actual data
    'Breaking News'?: boolean;
    'Trending News'?: boolean;
    'Home'?: boolean;
    'Articles'?: boolean;
    'Best of Week'?: boolean;
    'Bookmarks'?: boolean;
    'Categories'?: boolean;
    'History'?: boolean;
    'Jobs/Careers'?: boolean;
  };
}

// Enhanced error handling wrapper
async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      console.warn(`Attempt ${i + 1} failed:`, error);

      // Log specific Firebase error details
      if (error.code) {
        console.error(`Firebase error code: ${error.code}`);
        console.error(`Firebase error message: ${error.message}`);

        // Don't retry on permission errors
        if (error.code === 'permission-denied' || error.code === 'unauthenticated') {
          console.error('🔒 Permission denied - check Firestore security rules');
          throw error;
        }
      }

      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('All retry attempts failed');
}

// Helper function to detect test data
function isTestData(data: any): boolean {
  const title = (data.original_headline || data.headline || data.title || '').toLowerCase()
  const author = (data.user || data.author?.name || '').toLowerCase()
  const content = (data.content || '').toLowerCase()

  // Patterns that indicate test data
  const testPatterns = [
    'test article',
    'major tech announcement',
    'surprise album',
    'earthquake hits pacific',
    'ai breakthrough',
    'tech reporter',
    'music critic',
    'emergency reporter',
    'system test'
  ]

  return testPatterns.some(pattern =>
    title.includes(pattern) ||
    author.includes(pattern) ||
    content.includes(pattern)
  ) || content.length < 100 // Very short content is likely test
}

// Convert Firestore document to FeedItem (handles both collections)
function docToFeedItem(doc: any, collection: 'articles' | 'generated_content' = 'generated_content'): FeedItem {
  const data = doc.data();

  // Handle Firestore Timestamp conversion
  const getTimestamp = (firestoreTimestamp: any) => {
    if (!firestoreTimestamp) return new Date().toISOString()

    // If it's a Firestore Timestamp object
    if (firestoreTimestamp.toDate && typeof firestoreTimestamp.toDate === 'function') {
      return firestoreTimestamp.toDate().toISOString()
    }

    // If it's already a Date object
    if (firestoreTimestamp instanceof Date) {
      return firestoreTimestamp.toISOString()
    }

    // If it's a string, return as is
    if (typeof firestoreTimestamp === 'string') {
      return firestoreTimestamp
    }

    // Fallback
    return new Date().toISOString()
  }

  if (collection === 'articles') {
    // Map from articles collection schema
    return {
      id: doc.id,
      title: (data.title || "Untitled").replace(/\*\*|##/g, ''),
      content: (data.content || data.excerpt || "").replace(/\*\*|##/g, ''),
      author: {
        name: data.authorName || "Anonymous",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.authorName || 'anonymous'}`
      },
      category: data.categoryName || data.categoryId || "General",
      timestamp: getTimestamp(data.createdAt || data.updatedAt),
      image: data.image || data.coverImage || "/placeholder.jpg",
      features: {} // Articles collection doesn't have features
    };
  } else {
    // Map from generated_content collection schema
    return {
      id: doc.id,
      title: (data.original_headline || data.headline || data.title || "Untitled").replace(/\*\*|##/g, ''),
      content: (data.content || "").replace(/\*\*|##/g, ''),
      author: {
        name: data.user || data.author?.name || "Anonymous",
        avatar: data.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user || 'anonymous'}`
      },
      category: data.category || "General",
      timestamp: data.time || data.timestamp || new Date().toISOString(),
      image: data.image_url || data.image || "/placeholder.jpg",
      features: data.features || {}
    };
  }
}

// Fetch all content (try both collections)
export async function fetchAllContent(limitCount = 50): Promise<FeedItem[]> {
  return withRetry(async () => {
    console.log(`🔄 Fetching all content (limit: ${limitCount})...`);

    let items: FeedItem[] = [];

    // Try generated_content collection first
    try {
      console.log('📊 Checking generated_content collection...');
      const generatedQuery = query(
        collection(db, 'generated_content'),
        orderBy('time', 'desc'),
        limit(limitCount)
      );

      const generatedSnapshot = await getDocs(generatedQuery);
      console.log(`✅ Found ${generatedSnapshot.size} documents in generated_content`);

      if (!generatedSnapshot.empty) {
        const generatedItems = generatedSnapshot.docs.map((doc) => {
          try {
            return docToFeedItem(doc, 'generated_content');
          } catch (error) {
            console.error(`❌ Error processing generated_content document ${doc.id}:`, error);
            return null;
          }
        }).filter(Boolean) as FeedItem[];
        items.push(...generatedItems);
      }
    } catch (error: any) {
      console.warn('⚠️ Could not fetch from generated_content:', error.message);
    }

    // Try articles collection as fallback
    if (items.length === 0) {
      try {
        console.log('📰 Checking articles collection...');
        const articlesQuery = query(
          collection(db, 'articles'),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );

        const articlesSnapshot = await getDocs(articlesQuery);
        console.log(`✅ Found ${articlesSnapshot.size} documents in articles`);

        if (!articlesSnapshot.empty) {
          const articleItems = articlesSnapshot.docs.map((doc) => {
            try {
              return docToFeedItem(doc, 'articles');
            } catch (error) {
              console.error(`❌ Error processing articles document ${doc.id}:`, error);
              return null;
            }
          }).filter(Boolean) as FeedItem[];
          items.push(...articleItems);
        }
      } catch (error: any) {
        console.warn('⚠️ Could not fetch from articles:', error.message);
      }
    }

    if (items.length === 0) {
      console.warn('⚠️ No documents found in either collection');
      return [];
    }

    console.log(`📄 Successfully processed ${items.length} items`);
    console.log('📄 Sample items:', items.slice(0, 2).map(item => ({
      id: item.id,
      title: item.title.substring(0, 50) + '...',
      timestamp: item.timestamp,
      category: item.category
    })));

    return items;
  });
}

// Helper function to check if an item has a specific feature
function hasFeature(item: FeedItem, featureName: string): boolean {
  if (!item.features) return false;
  
  // Check multiple possible formats for the feature name
  const variations = [
    featureName,
    featureName.toLowerCase(),
    featureName.replace(/\s+/g, '_').toLowerCase(),
    featureName.replace(/_/g, ' '),
    featureName.charAt(0).toUpperCase() + featureName.slice(1).toLowerCase(),
    featureName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
  ];
  
  return variations.some(variation => item.features?.[variation as keyof typeof item.features]);
}

// Fetch breaking news
export async function fetchBreakingNews(limitCount = 15): Promise<FeedItem[]> {
  return withRetry(async () => {
    console.log('🔄 Fetching breaking news...');

    try {
      // First try to get items with breaking_news feature from generated_content
      const generatedQuery = query(
        collection(db, 'generated_content'),
        orderBy('time', 'desc'),
        limit(limitCount * 2) // Get more to filter
      );

      const generatedSnapshot = await getDocs(generatedQuery);
      console.log(`📊 Found ${generatedSnapshot.size} documents in generated_content for breaking news`);

      if (!generatedSnapshot.empty) {
        const generatedItems = generatedSnapshot.docs.map((doc) => {
          try {
            return docToFeedItem(doc, 'generated_content');
          } catch (error) {
            console.error(`❌ Error processing document ${doc.id}:`, error);
            return null;
          }
        }).filter(Boolean) as FeedItem[];

        // Filter for breaking news features
        const breakingItems = generatedItems.filter(item => 
          hasFeature(item, 'breaking_news') || hasFeature(item, 'Breaking News')
        );

        if (breakingItems.length > 0) {
          console.log(`✅ Found ${breakingItems.length} breaking news items from generated_content`);
          return breakingItems.slice(0, limitCount);
        }
      }

      // Fallback: return latest articles
      const allContent = await fetchAllContent(limitCount);
      console.log(`✅ Using ${allContent.length} latest articles as breaking news fallback`);

      // Filter out test data if any
      const realItems = allContent.filter(item => !isTestData({
        original_headline: item.title,
        headline: item.title,
        user: item.author.name,
        content: item.content
      }));

      const finalItems = realItems.length > 0 ? realItems : allContent;
      console.log(`📄 Returning ${finalItems.length} breaking news items`);
      return finalItems;
    } catch (error) {
      console.warn('Breaking news fetch failed:', error);
      return [];
    }
  });
}

// Fetch trending news
export async function fetchTrendingNews(limitCount = 15): Promise<FeedItem[]> {
  return withRetry(async () => {
    console.log('🔄 Fetching trending news...');

    try {
      // First try to get items with trending_news feature from generated_content
      const generatedQuery = query(
        collection(db, 'generated_content'),
        orderBy('time', 'desc'),
        limit(limitCount * 2) // Get more to filter
      );

      const generatedSnapshot = await getDocs(generatedQuery);
      console.log(`📊 Found ${generatedSnapshot.size} documents in generated_content for trending news`);

      if (!generatedSnapshot.empty) {
        const generatedItems = generatedSnapshot.docs.map((doc) => {
          try {
            return docToFeedItem(doc, 'generated_content');
          } catch (error) {
            console.error(`❌ Error processing document ${doc.id}:`, error);
            return null;
          }
        }).filter(Boolean) as FeedItem[];

        // Filter for trending news features
        const trendingItems = generatedItems.filter(item => 
          hasFeature(item, 'trending_news') || hasFeature(item, 'Trending News')
        );

        if (trendingItems.length > 0) {
          console.log(`✅ Found ${trendingItems.length} trending news items from generated_content`);
          return trendingItems.slice(0, limitCount);
        }
      }

      // Fallback: return latest articles
      const allContent = await fetchAllContent(limitCount);
      console.log(`✅ Using ${allContent.length} latest articles as trending news fallback`);

      // Filter out test data if any
      const realItems = allContent.filter(item => !isTestData({
        original_headline: item.title,
        headline: item.title,
        user: item.author.name,
        content: item.content
      }));

      const finalItems = realItems.length > 0 ? realItems : allContent;
      console.log(`📄 Returning ${finalItems.length} trending news items`);
      return finalItems;
    } catch (error) {
      console.warn('Trending news fetch failed:', error);
      return [];
    }
  });
}

// Fetch home feed
export async function fetchHomeFeed(limitCount = 30): Promise<FeedItem[]> {
  return withRetry(async () => {
    console.log('🔄 Fetching home feed...');

    try {
      // First try to get items with home feature from generated_content
      const generatedQuery = query(
        collection(db, 'generated_content'),
        orderBy('time', 'desc'),
        limit(limitCount * 2) // Get more to filter
      );

      const generatedSnapshot = await getDocs(generatedQuery);
      console.log(`📊 Found ${generatedSnapshot.size} documents in generated_content for home feed`);

      if (!generatedSnapshot.empty) {
        const generatedItems = generatedSnapshot.docs.map((doc) => {
          try {
            return docToFeedItem(doc, 'generated_content');
          } catch (error) {
            console.error(`❌ Error processing document ${doc.id}:`, error);
            return null;
          }
        }).filter(Boolean) as FeedItem[];

        // Filter for home features
        const homeItems = generatedItems.filter(item => 
          hasFeature(item, 'home') || hasFeature(item, 'Home')
        );

        if (homeItems.length > 0) {
          console.log(`✅ Found ${homeItems.length} home feed items from generated_content`);
          return homeItems.slice(0, limitCount);
        }
      }

      // Fallback: return all latest content
      const allContent = await fetchAllContent(limitCount);
      console.log(`✅ Using ${allContent.length} latest articles as home feed fallback`);

      // Filter out test data if any
      const realItems = allContent.filter(item => !isTestData({
        original_headline: item.title,
        headline: item.title,
        user: item.author.name,
        content: item.content
      }));

      const finalItems = realItems.length > 0 ? realItems : allContent;
      console.log(`📄 Returning ${finalItems.length} home feed items`);
      return finalItems;
    } catch (error) {
      console.warn('Home feed fetch failed:', error);
      return [];
    }
  });
}

// Fetch single article
export async function fetchSingleArticle(id: string): Promise<FeedItem | null> {
  return withRetry(async () => {
    console.log(`🔄 Fetching single article: ${id}`);

    // Try generated_content collection first
    try {
      const docRef = doc(db, 'generated_content', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log(`✅ Found article in generated_content: ${id}`);
        return docToFeedItem(docSnap, 'generated_content');
      }
    } catch (error) {
      console.warn(`⚠️ Error fetching from generated_content: ${error}`);
    }

    // Try articles collection as fallback
    try {
      const docRef = doc(db, 'articles', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log(`✅ Found article in articles: ${id}`);
        return docToFeedItem(docSnap, 'articles');
      }
    } catch (error) {
      console.warn(`⚠️ Error fetching from articles: ${error}`);
    }

    console.log(`❌ Article not found: ${id}`);
    return null;
  });
}

// Fetch articles by category
export async function fetchByCategory(category: string, limitCount = 20): Promise<FeedItem[]> {
  return withRetry(async () => {
    console.log(`🔄 Fetching articles for category: ${category}`);

    const allContent = await fetchAllContent(limitCount * 2);
    
    // Filter by category (case-insensitive)
    const filtered = allContent.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );

    console.log(`✅ Found ${filtered.length} articles for category: ${category}`);
    return filtered.slice(0, limitCount);
  });
}

// Export additional utility functions
export { isTestData, hasFeature };
