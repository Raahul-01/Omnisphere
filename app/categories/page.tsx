import { Metadata } from "next"
import { adminDb } from "@/lib/firebase-admin"
import { cache } from 'react'
import { CategoryGrid } from "@/components/category-grid"

export const metadata: Metadata = {
  title: "Categories - Browse by Topic",
  description: "Explore articles by category",
}

interface CategoryCount {
  name: string;
  count: number;
  latestArticle: {
    title: string;
    image: string;
  };
}

// Cache the data fetching
const getCategoriesWithCounts = cache(async () => {
  try {
    const articlesRef = adminDb.collection('generated_content');
    const snapshot = await articlesRef
      .orderBy('time', 'desc')
      .get();

    // Create a map to store category data
    const categoryMap = new Map<string, CategoryCount>();

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const category = data.category || "Uncategorized";

      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          name: category,
          count: 1,
          latestArticle: {
            title: data.original_headline || data.headline || "",
            image: data.image_url || "/placeholder.jpg"
          }
        });
      } else {
        const current = categoryMap.get(category)!;
        categoryMap.set(category, {
          ...current,
          count: current.count + 1
        });
      }
    });

    // Convert map to array and sort by count
    return Array.from(categoryMap.values())
      .sort((a, b) => b.count - a.count);

  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
});

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts();

  return <CategoryGrid categories={categories} />;
}

