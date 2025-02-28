import { Metadata } from "next"
import { adminDb } from "@/lib/firebase-admin"
import { ArticleFeed } from "@/components/article-feed"
import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageContainer } from "@/components/layout/page-container"

const PREDEFINED_CATEGORIES = [
  "Global",
  "Politics",
  "Business",
  "Entertainment",
  "Sport",
  "Technology",
  "Health",
  "Automotive",
  "Travel",
  "Food",
  "Music",
  "Gaming",
  "Education",
  "Science",
  "Fashion",
  "Finance",
  "Real Estate"
];

interface Props {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = params.slug;
  return {
    title: `${category} Articles`,
    description: `Browse all articles in ${category} category`,
  }
}

const getCategoryArticles = cache(async (categoryName: string) => {
  try {
    // Get all articles and filter by case-insensitive category
    const articlesRef = adminDb.collection('generated_content');
    const snapshot = await articlesRef
      .orderBy('time', 'desc')  // Only order by time
      .limit(100)
      .get();

    // Filter articles case-insensitively in memory
    const articles = snapshot.docs
      .filter(doc => {
        const data = doc.data();
        return data.category?.toLowerCase() === categoryName.toLowerCase();
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
          category: data.category || categoryName,
          timestamp: data.time || new Date().toISOString(),
          image: data.image_url || "/placeholder.jpg",
          tags: Array.isArray(data.tags) ? data.tags : [],
        };
      })
      .slice(0, 50); // Limit after filtering

    return articles;
  } catch (error) {
    console.error('Error fetching category articles:', error);
    return [];
  }
});

export default async function CategoryPage({ params }: Props) {
  if (!params.slug) {
    notFound();
  }

  try {
    // Check if category exists in predefined list (case-insensitive)
    const matchedCategory = PREDEFINED_CATEGORIES.find(
      cat => cat.toLowerCase() === params.slug.toLowerCase()
    );

    if (!matchedCategory) {
      notFound();
    }

    const articles = await getCategoryArticles(matchedCategory);

    if (!articles.length) {
      return (
        <PageContainer>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">{matchedCategory}</h2>
            <p className="text-muted-foreground mb-6">
              No articles found in this category yet.
            </p>
            <Link 
              href="/categories" 
              className="text-primary hover:underline"
            >
              Browse all categories
            </Link>
          </div>
        </PageContainer>
      );
    }

    return (
      <PageContainer>
        <h1 className="text-3xl font-bold mb-8">{matchedCategory}</h1>
        <ArticleFeed articles={articles} />
      </PageContainer>
    );
  } catch (error) {
    console.error('Error in CategoryPage:', error);
    notFound();
  }
} 