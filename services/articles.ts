import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Article } from '@/types/article';

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(
      postsRef,
      where('categories', 'array-contains', category),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Article[];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
} 