import { Metadata } from "next"
import { TrendingFeed } from "@/components/trending-feed"
import { PageContainer } from "@/components/layout/page-container"

export const metadata: Metadata = {
  title: "Trending Stories",
  description: "What's trending right now",
}

// Mock trending articles for now
const mockTrendingArticles = [
  {
    id: '1',
    title: 'Trending Story',
    content: 'This is a trending article that everyone is talking about.',
    author: {
      name: 'Trending Author',
      avatar: 'https://ui-avatars.com/api/?name=Trending&background=random&size=128'
    },
    category: 'Trending',
    timestamp: new Date().toISOString(),
    image: '/placeholder.jpg',
    tags: ['trending', 'popular']
  }
];

export default async function TrendingPage() {
  return (
    <PageContainer>
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Trending Stories</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover what's trending right now
        </p>
      </div>
      <TrendingFeed articles={mockTrendingArticles} />
    </PageContainer>
  );
}

