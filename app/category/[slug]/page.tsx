import { Metadata } from "next"
import { adminDb } from "@/lib/firebase-admin"
import { ArticleFeed } from "@/components/article-feed"
import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageContainer } from "@/components/layout/page-container"
import { CategoryFeed } from "@/components/category-feed"

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
  const { slug } = await params;
  const category = slug;
  return {
    title: `${category} Articles`,
    description: `Browse all articles in ${category} category`,
  };
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
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  // Check if category exists in predefined list (case-insensitive)
  const matchedCategory = PREDEFINED_CATEGORIES.find(
    cat => cat.toLowerCase() === slug.toLowerCase()
  );

  if (!matchedCategory) {
    notFound();
  }

  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex-1 md:ml-[240px] p-4">
        <div className="max-w-[700px] mx-auto">
          <h1 className="text-xl font-bold py-3">{matchedCategory} Articles</h1>
          <CategoryFeed category={matchedCategory} />
        </div>
      </div>
    </main>
  );
} 