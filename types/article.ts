export interface Article {
  id: string
  title: string
  excerpt?: string
  content?: string
  category: string
  imageUrl?: string
  author?: {
    name: string
    avatar?: string
  }
  timestamp?: string
} 