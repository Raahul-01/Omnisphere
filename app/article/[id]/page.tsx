import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleContent } from "@/components/article-content"
import { RelatedPeopleArticles } from "@/components/related-people-articles"
import { PageContainer } from "@/components/layout/page-container"

interface Article {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
  }
  category: string
  timestamp: string
  image: string
  tags: string[]
}

interface Props {
  params: { id: string }
}

// Mock article data matching ArticleContent interface
const mockArticle = {
  id: '1',
  title: 'Sample Article: Technology Breakthrough',
  content: 'This is a comprehensive article about the latest technology breakthrough. Scientists have made significant progress in quantum computing, which could revolutionize how we process information in the future.',
  author: {
    name: 'Tech Reporter',
    avatar: 'https://ui-avatars.com/api/?name=Tech+Reporter&background=random&size=128'
  },
  category: 'Technology',
  contentType: 'Article',
  createdAt: new Date().toISOString(),
  imageUrl: '/placeholder.jpg',
  trendingNews: 'Quantum Computing',
  features: {
    home: true,
    breakingNews: false,
    articles: true,
    jobsCareers: false,
    trendingNews: true,
    categories: true,
    bestOfWeek: false,
    history: false,
    bookmarks: false
  }
}

const mockRelatedArticles: Article[] = [
  {
    id: '2',
    title: 'Related: Future of Technology',
    content: 'Exploring what the future holds for technology.',
    author: {
      name: 'Future Tech',
      avatar: 'https://ui-avatars.com/api/?name=Future+Tech&background=random&size=128'
    },
    category: 'Technology',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    image: '/placeholder.jpg',
    tags: ['future', 'technology']
  }
]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: mockArticle.title,
    description: mockArticle.content.slice(0, 160),
  }
}

export default async function ArticlePage({ params }: Props) {
  const { id } = params

  if (!id) {
    notFound()
  }

  // For demo purposes, we'll show the mock article for any ID
  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <ArticleContent 
          article={mockArticle}
        />
        <div className="mt-12">
          <RelatedPeopleArticles articles={mockRelatedArticles} />
        </div>
      </div>
    </PageContainer>
  )
} 
