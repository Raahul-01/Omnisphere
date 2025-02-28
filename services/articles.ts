import { Article } from "@/types/article"

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  try {
    const response = await fetch(`/api/articles?category=${category}`)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error('Failed to fetch articles')
    }
    
    return data.articles || []
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
} 