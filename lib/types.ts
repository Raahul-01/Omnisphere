// Article type definitions
export interface Article {
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
  tags?: string[];
  features?: {
    breaking_news?: boolean;
    trending_news?: boolean;
    home?: boolean;
    articles?: boolean;
    best_of_week?: boolean;
    categories?: boolean;
    bookmarks?: boolean;
    history?: boolean;
    "Jobs/Careers"?: boolean;
  };
  content_type?: string;
  trending_topics?: string;
  original_headline?: string;
  headline?: string;
  user?: string;
  time?: string;
  image_url?: string;
}

// User type definitions
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    categories: string[];
    notifications: boolean;
  };
}

// Category type definitions
export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  count?: number;
}

// Feed item type (compatible with Firebase utils)
export interface FeedItem {
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
  features?: {
    breaking_news?: boolean;
    trending_news?: boolean;
    home?: boolean;
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Search types
export interface SearchResult {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
}

// Bookmark types
export interface Bookmark {
  id: string;
  userId: string;
  articleId: string;
  createdAt: string;
}

// Comment types
export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    avatar: string;
  };
}
