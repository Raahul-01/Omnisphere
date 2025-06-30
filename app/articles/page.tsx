import { Metadata } from "next"
import { ArticleFeed } from "@/components/article-feed"
import { PageContainer } from "@/components/layout/page-container"

export const metadata: Metadata = {
  title: "Latest Articles",
  description: "Browse all articles",
}

// Mock articles data for now
const mockArticles = [
  {
    id: '1',
    title: 'Welcome to Omnisphere',
    content: 'This is a sample article to demonstrate the platform.',
    author: {
      name: 'Admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=random&size=128'
    },
    category: 'Technology',
    timestamp: new Date().toISOString(),
    image: '/placeholder.jpg',
    tags: ['tech', 'platform']
  }
];

export default async function ArticlesPage() {
  return (
    <PageContainer>
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Latest Articles</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover interesting stories and insights
        </p>
      </div>
      <ArticleFeed articles={mockArticles} />
    </PageContainer>
  );
} 