"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { History, Bookmark } from "lucide-react"
import { ArticleFeed } from "@/components/article-feed"
import { PageContainer } from "@/components/layout/page-container"

interface Article {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  timestamp: string;
  image: string;
  tags: string[];
}

// Mock data for demonstration
const mockHistoryArticles: Article[] = [
  {
    id: '1',
    title: 'Recently Read Article',
    content: 'This is an article you recently viewed.',
    author: {
      name: 'John Doe',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random&size=128'
    },
    category: 'Technology',
    timestamp: new Date().toISOString(),
    image: '/placeholder.jpg',
    tags: ['tech', 'recent']
  }
];

const mockBookmarkedArticles: Article[] = [
  {
    id: '2',
    title: 'Bookmarked Article',
    content: 'This is an article you bookmarked for later reading.',
    author: {
      name: 'Jane Smith',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random&size=128'
    },
    category: 'Business',
    timestamp: new Date().toISOString(),
    image: '/placeholder.jpg',
    tags: ['business', 'saved']
  }
];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState("history");

  return (
    <PageContainer>
      <div className="max-w-[1200px] mx-auto">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Library</h1>
            <TabsList>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                Bookmarks
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="history">
            {mockHistoryArticles.length > 0 ? (
              <ArticleFeed articles={mockHistoryArticles} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No reading history yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookmarks">
            {mockBookmarkedArticles.length > 0 ? (
              <ArticleFeed articles={mockBookmarkedArticles} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No bookmarks yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
} 