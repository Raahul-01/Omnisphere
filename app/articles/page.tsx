import { Metadata } from "next"
import { adminDb } from "@/lib/firebase-admin"
import { ArticleFeed } from "@/components/article-feed"
import { cache } from 'react'
import { PageContainer } from "@/components/layout/page-container"

export const metadata: Metadata = {
  title: "Latest Articles",
  description: "Browse all articles",
}

// Cache the data fetching
const getArticles = cache(async () => {
  try {
    // First try to get articles with features.articles = true
    const articlesRef = adminDb.collection('generated_content');
    
    // First get all documents and filter for articles feature
    const querySnapshot = await articlesRef
      .orderBy('time', 'desc')
      .limit(100)
      .get();

    console.log('Fetching articles...');

    // Filter documents that have features.articles = true
    const articles = querySnapshot.docs
      .filter(doc => {
        const data = doc.data();
        return data.features?.articles === true;
      })
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.original_headline || data.headline || "",
          content: data.content || "",
          author: {
            name: data.user || "Anonymous",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user || 'Anonymous')}&background=random&size=128`
          },
          category: data.category || "General",
          timestamp: data.time || new Date().toISOString(),
          image: data.image_url || "/placeholder.jpg",
          tags: Array.isArray(data.tags) ? data.tags : [],
        };
      })
      .slice(0, 50); // Limit to 50 articles after filtering

    console.log(`Found ${articles.length} articles with articles feature`);
    return articles;

  } catch (error) {
    console.error('Error fetching articles:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    return [];
  }
});

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <PageContainer>
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Latest Articles</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover interesting stories and insights
        </p>
      </div>
      <ArticleFeed articles={articles} />
    </PageContainer>
  );
} 