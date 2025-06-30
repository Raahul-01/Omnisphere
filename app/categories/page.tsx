import { Metadata } from "next"
import { CategoryGrid } from "@/components/category-grid"

export const metadata: Metadata = {
  title: "Categories - Omnisphere",
  description: "Explore articles by category",
}

// Mock categories data matching the CategoryCount interface
const mockCategories = [
  { 
    name: 'Technology', 
    count: 25, 
    latestArticle: { 
      title: 'Latest Tech Innovation', 
      image: '/placeholder.jpg' 
    } 
  },
  { 
    name: 'Science', 
    count: 18, 
    latestArticle: { 
      title: 'Scientific Breakthrough', 
      image: '/placeholder.jpg' 
    } 
  },
  { 
    name: 'Business', 
    count: 32, 
    latestArticle: { 
      title: 'Market Update', 
      image: '/placeholder.jpg' 
    } 
  },
  { 
    name: 'Health', 
    count: 15, 
    latestArticle: { 
      title: 'Health Tips', 
      image: '/placeholder.jpg' 
    } 
  },
];

export default async function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse Categories</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore articles organized by topics that interest you
        </p>
      </div>
      <CategoryGrid categories={mockCategories} />
    </div>
  );
}

