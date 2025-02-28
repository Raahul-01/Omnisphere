import { Metadata } from "next"
import { CategoryPageContent } from "./category-content"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const decodedCategory = decodeURIComponent(params.category)
  return {
    title: `${decodedCategory} News - Baj Finance`,
    description: `Latest ${decodedCategory.toLowerCase()} news and updates from Baj Finance`,
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryPageContent category={params.category} />
}

