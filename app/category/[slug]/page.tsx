import { Metadata } from "next"
import { CategoryFeed } from "@/components/category-feed"
import { CATEGORIES } from "@/lib/categories"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = CATEGORIES.find(cat => cat.slug === params.slug)
  
  if (!category) {
    return {
      title: "Category Not Found - OmniSphere",
    }
  }

  return {
    title: `${category.name} - OmniSphere`,
    description: `Latest ${category.name.toLowerCase()} articles and news`,
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = CATEGORIES.find(cat => cat.slug === params.slug)
  
  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto">
      <div className="px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <category.icon className={`w-8 h-8 ${category.color}`} />
            <h1 className="text-3xl font-bold">{category.name}</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {category.description}
          </p>
        </div>
        <CategoryFeed category={category.name} />
      </div>
    </div>
  )
}

// Generate static params for all categories
export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    slug: category.slug,
  }))
}
