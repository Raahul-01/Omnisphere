import { Metadata } from "next"
import { adminDb } from "@/lib/firebase-admin"
import { ArticleFeed } from "@/components/article-feed"
import { cache } from 'react'

export const metadata: Metadata = {
  title: "Jobs and Careers",
  description: "Browse job opportunities and career insights",
}

const getJobArticles = cache(async () => {
  try {
    const articlesRef = adminDb.collection('generated_content');
    const querySnapshot = await articlesRef
      .orderBy('time', 'desc')  // Only order by time
      .limit(100)  // Get more items to filter from
      .get();

    // Filter for jobs in memory
    const articles = querySnapshot.docs
      .filter(doc => {
        const data = doc.data();
        return data.category?.toLowerCase() === 'jobs';
      })
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.original_headline || data.headline || "",
          content: data.content || "",
          author: {
            name: data.user || "Anonymous",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user || 'Anonymous')}&background=random`
          },
          category: data.category || "Jobs",
          timestamp: data.time || new Date().toISOString(),
          image: data.image_url || "/placeholder.jpg",
          tags: Array.isArray(data.tags) ? data.tags : [],
        };
      })
      .slice(0, 50); // Limit after filtering

    return articles;
  } catch (error) {
    console.error('Error fetching job articles:', error);
    return [];
  }
});

export default async function JobsPage() {
  const articles = await getJobArticles();

  if (!articles.length) {
    return (
      <main className="min-h-screen">
        <div className="md:ml-[240px]">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-[1200px] mx-auto">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-2">No Job Listings</h2>
                <p className="text-muted-foreground">
                  There are currently no job listings available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="md:ml-[240px]">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Jobs and Careers</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore job opportunities and career insights
              </p>
            </div>
            <ArticleFeed articles={articles} />
          </div>
        </div>
      </div>
    </main>
  );
} 