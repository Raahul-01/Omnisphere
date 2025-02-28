import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Share2, Bookmark, ThumbsUp, ArrowLeft, ArrowRight, Clock, BookOpen, FolderOpen, Mail } from "lucide-react"
import { adminDb } from "@/lib/firebase-admin"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentData } from 'firebase-admin/firestore'
import { ArticleContent } from "@/components/article-content"
import { RelatedPeopleArticles } from "@/components/related-people-articles"
import { PageContainer } from "@/components/layout/page-container"
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { BackButton } from "@/components/back-button"
import { Input } from "@/components/ui/input"

interface Article extends DocumentData {
  id: string
  original_headline: string
  content: string
  category: string
  image_url?: string
  user: string
  time: string
  content_type?: string
  trending_topics?: string
  features?: {
    home?: boolean
    breaking_news?: boolean
    articles?: boolean
    "Jobs/Careers"?: boolean
    trending_news?: boolean
    categories?: boolean
    best_of_week?: boolean
    history?: boolean
    bookmarks?: boolean
  }
}

async function getArticleData(id: string) {
  try {
    const cleanId = decodeURIComponent(id).trim();
    console.log('Fetching article:', cleanId);

    const docRef = adminDb.collection('generated_content').doc(cleanId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.log('Article not found:', cleanId);
      return null;
    }

    const data = docSnap.data();
    if (!data) {
      console.log('No data in document:', cleanId);
      return null;
    }

    return {
      id: cleanId,
      ...data
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const article = await getArticleData(params.id);
  
  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.'
    };
  }

  const title = article.original_headline || article.headline || 'Article';
  const description = article.content?.substring(0, 160) || '';
  const images = article.image_url ? [article.image_url] : [];

  return {
    title,
    description,
    openGraph: {
      images,
    },
  };
}

const ArticlePage = async ({ params }: { params: { id: string } }) => {
  try {
    if (!params.id) {
      notFound();
    }

    const cleanId = decodeURIComponent(params.id).trim();
    console.log('Fetching article:', cleanId);

    const docRef = adminDb.collection('generated_content').doc(cleanId);
    const docSnap = await docRef.get();

    if (!docSnap.exists || !docSnap.data()) {
      notFound();
    }

    const data = docSnap.data()!;
    
    // Validate required data
    if (!data.content || !data.original_headline) {
      console.error('Invalid article data:', data);
      notFound();
    }

    // Modify the related articles query
    const relatedSnapshot = await adminDb
      .collection('generated_content')
      .orderBy('time', 'desc')
      .limit(100)
      .get();

    // Then filter in memory
    const relatedArticles = relatedSnapshot.docs
      .filter(doc => doc.id !== cleanId && doc.data().category === data.category)
      .slice(0, 3)
      .map(doc => {
        const articleData = doc.data();
        return {
          id: doc.id,
          title: articleData.original_headline || articleData.headline || "Untitled Article",
          content: articleData.content || "",
          author: {
            name: articleData.user || "Anonymous",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(articleData.user || 'Anonymous')}&background=random&size=128`
          },
          category: articleData.category || "Uncategorized",
          timestamp: articleData.time || new Date().toISOString(),
          image: articleData.image_url || '/placeholder.jpg',
        };
      });

    const post = {
      id: cleanId,
      title: data.original_headline || data.headline || "Untitled Article",
      content: data.content || "",
      author: {
        name: data.user || "Anonymous",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user || 'Anonymous')}&background=random&size=128`
      },
      category: data.category || "Uncategorized",
      contentType: data.content_type || "",
      createdAt: data.time || new Date().toISOString(),
      imageUrl: data.image_url || '/placeholder.jpg',
      trendingNews: data.trending_topics || "",
      features: data.features || {}
    };

  return (
      <PageContainer>
        <div className="lg:flex gap-8">
          {/* Main Article Content */}
          <div className="flex-1">
            <ArticleContent article={post} />
          </div>

          {/* Sidebar with Suggestions */}
          <div className="hidden lg:block w-[250px]">
            <div className="sticky top-20">
              <h3 className="font-medium mb-3 flex items-center gap-1.5 text-zinc-900 dark:text-white text-sm">
                <FolderOpen className="h-3.5 w-3.5 text-[#FF7043]" />
                More from {post.category}
              </h3>
              <div className="space-y-2.5">
                {relatedArticles.slice(0, 4).map((article) => (
                  <Link 
                    key={article.id} 
                    href={`/article/${article.id}`}
                    className="block group"
                  >
                    <div className="flex gap-2 items-start hover:bg-zinc-50 dark:hover:bg-zinc-900/50 p-2 rounded-lg transition-colors">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover rounded group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs leading-normal font-medium line-clamp-2 text-zinc-900 dark:text-zinc-100 group-hover:text-[#FF7043] transition-colors">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="flex items-center gap-1">
                            <div className="relative w-3 h-3 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={article.author.avatar}
                                alt={article.author.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground truncate">
                              {article.author.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            · {formatDistanceToNow(new Date(article.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  } catch (error) {
    console.error('Error in ArticlePage:', error);
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Error Loading Article</h2>
          <p className="text-muted-foreground">
            Sorry, there was a problem loading this article. Please try again later.
          </p>
    </div>
      </PageContainer>
    );
  }
} 

export default ArticlePage; 
