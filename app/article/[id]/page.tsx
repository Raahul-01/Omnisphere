import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Share2, Bookmark, ThumbsUp, ArrowLeft, ArrowRight, Clock, BookOpen, FolderOpen, Mail } from "lucide-react"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentData } from 'firebase/firestore'
import { ArticleContent } from "@/components/article-content"
import { RelatedPeopleArticles } from "@/components/related-people-articles"
import { PageContainer } from "@/components/layout/page-container"
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { BackButton } from "@/components/back-button"
import { Input } from "@/components/ui/input"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"

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

interface RelatedArticle {
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
}

const FIREBASE_TIMEOUT = 10000; // 10 seconds

// Cache the article data fetching
const getArticleData = async (id: string): Promise<Article | null> => {
  try {
    if (!id) {
      console.error('No article ID provided');
      return null;
    }

    const cleanId = decodeURIComponent(id).trim();
    const docRef = doc(db, 'generated_content', cleanId);
    
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log('Article not found:', cleanId);
      return null;
    }

    const data = docSnap.data();
    if (!data) {
      console.log('No data found for article:', cleanId);
      return null;
    }

    return {
      id: cleanId,
      ...data
    } as Article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
};

// Cache the related articles fetching
const getRelatedArticles = async (id: string, category: string): Promise<RelatedArticle[]> => {
  try {
    if (!category) {
      console.log('No category provided for related articles');
      return [];
    }

    console.log('Fetching related articles for category:', category);

    const q = query(
      collection(db, 'generated_content'),
      where('category', '==', category)
    );
    
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No related articles found for category:', category);
      return [];
    }

    console.log('Found total documents:', querySnapshot.docs.length);

    // Get all articles except current one and map them
    const articles = querySnapshot.docs
      .filter(doc => doc.id !== id)
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.original_headline || data.headline || "Untitled Article",
          content: data.content || "",
          author: {
            name: data.user || "Anonymous",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user || 'Anonymous')}&background=random&size=128`
          },
          category: data.category || "Uncategorized",
          timestamp: data.time || new Date().toISOString(),
          image: data.image_url || '/placeholder.jpg',
        };
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 4);

    console.log('Final related articles count:', articles.length);
    return articles;

  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
};

type Props = {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const articleId = String(id);
  const article = await getArticleData(articleId);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.'
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.imageUrl ? [article.imageUrl] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const articleId = String(id);

  const article = await getArticleData(articleId);
  
  if (!article) {
    notFound();
  }

  // Validate required data
  if (!article.content || !article.original_headline) {
    console.error('Invalid article data:', article);
    notFound();
  }

  let relatedArticles: RelatedArticle[] = [];
  try {
    console.log('Raw category from article:', article.category);
    const normalizedCategory = article.category?.trim() || "Uncategorized";
    console.log('Normalized category:', normalizedCategory);
    console.log('Current article ID:', articleId);
    
    relatedArticles = await getRelatedArticles(articleId, normalizedCategory);
    console.log('Found related articles:', relatedArticles.length);
  } catch (error) {
    console.error('Error fetching related articles:', error);
  }

  const post = {
    id: articleId,
    title: article.original_headline || "Untitled Article",
    content: article.content || "",
    author: {
      name: article.user || "Anonymous",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(article.user || 'Anonymous')}&background=random&size=128`
    },
    category: article.category || "Uncategorized",
    contentType: article.content_type || "",
    createdAt: article.time || new Date().toISOString(),
    imageUrl: article.image_url || '/placeholder.jpg',
    trendingNews: article.trending_topics || "",
    features: {
      home: article.features?.home || false,
      breakingNews: article.features?.breaking_news || false,
      articles: article.features?.articles || false,
      jobsCareers: article.features?.["Jobs/Careers"] || false,
      trendingNews: article.features?.trending_news || false,
      categories: article.features?.categories || false,
      bestOfWeek: article.features?.best_of_week || false,
      history: article.features?.history || false,
      bookmarks: article.features?.bookmarks || false
    }
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
          <div className="sticky top-20 bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center gap-1.5 text-zinc-900 dark:text-white text-sm">
              <FolderOpen className="h-3.5 w-3.5 text-[#FF7043]" />
              More from {post.category}
            </h3>
            <div className="space-y-2">
              {relatedArticles.length > 0 ? (
                relatedArticles.map((article) => (
                  <Link 
                    key={article.id} 
                    href={`/article/${article.id}`}
                    className="block group"
                  >
                    <div className="flex gap-2 items-start hover:bg-white dark:hover:bg-zinc-800/50 p-2 rounded-lg transition-colors">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs leading-normal font-medium line-clamp-2 text-zinc-900 dark:text-zinc-100 group-hover:text-[#FF7043] transition-colors">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
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
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p className="text-xs">No related articles found</p>
                  <p className="text-[10px] mt-1">Check back later for more articles in this category</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
} 
