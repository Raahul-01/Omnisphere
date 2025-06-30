"use client"

import { TrendingFeed } from "@/components/trending-feed"
import { PageContainer } from "@/components/layout/page-container"
import { RightSidebar } from "@/components/right-sidebar"

// Mock trending articles
const mockTrendingArticles = [
  {
    id: '1',
    title: 'Breaking Technology News',
    content: 'Latest developments in tech...',
    category: 'Technology'
  },
  {
    id: '2', 
    title: 'Market Analysis Update',
    content: 'Current market trends...',
    category: 'Business'
  }
];

export default function TrendingContent() {
  return (
    <PageContainer>
      <div className="flex gap-6">
        <div className="flex-1">
          <TrendingFeed articles={mockTrendingArticles} />
        </div>
        <RightSidebar />
      </div>
    </PageContainer>
  )
} 