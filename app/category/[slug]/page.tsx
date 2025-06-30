import { Metadata } from "next"
import { ArticleFeed } from "@/components/article-feed"
import { notFound } from 'next/navigation'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)
  
  return {
    title: `${categoryName} Articles`,
    description: `Browse ${categoryName.toLowerCase()} articles`,
  }
}

// Mock articles data for category
const getMockArticlesForCategory = (slug: string) => [
  {
    id: '1',
    title: `Sample ${slug} Article`,
    content: `This is a sample article about ${slug}.`,
    author: {
      name: 'Category Author',
      avatar: 'https://ui-avatars.com/api/?name=Category&background=random&size=128'
    },
    category: slug,
    timestamp: new Date().toISOString(),
    image: '/placeholder.jpg',
    tags: [slug]
  }
];

export default async function CategoryPage({ params }: Props) {
  const { slug } = params
  
  // Basic validation
  if (!slug || slug.length < 2) {
    notFound()
  }

  const articles = getMockArticlesForCategory(slug);
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{categoryName} Articles</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore the latest in {categoryName.toLowerCase()}
        </p>
      </div>
      <ArticleFeed articles={articles} />
    </div>
  )
} 