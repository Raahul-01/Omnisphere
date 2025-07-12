import { Metadata } from "next"
import { CategoryGrid } from "@/components/category-grid"
import { CATEGORIES } from "@/lib/categories"

export const metadata: Metadata = {
  title: "Categories - OmniSphere",
  description: "Browse articles by category",
}

export default async function CategoriesPage() {
  // For now, we'll use static data since we don't have enough articles to populate categories
  // In the future, this could fetch real category stats from Firebase
  const categoriesWithStats = CATEGORIES.map(category => ({
    ...category,
    count: Math.floor(Math.random() * 50) + 5, // Random count for demo
    latestArticle: {
      title: `Latest ${category.name} Article`,
      image: "/placeholder.jpg"
    }
  }))

  return (
    <div className="container mx-auto">
      <CategoryGrid categories={categoriesWithStats} />
    </div>
  )
}
