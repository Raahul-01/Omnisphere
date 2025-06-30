import React from 'react'
import { Card } from "./ui/card"

interface FeedProps {
  articles?: any[]
}

export function Feed({ articles = [] }: FeedProps) {
  return (
    <div className="space-y-4">
      {articles.length > 0 ? (
        articles.map((article, index) => (
          <Card key={index} className="p-4">
            <h3 className="font-semibold">{article.title || 'Article Title'}</h3>
            <p className="text-muted-foreground text-sm mt-2">
              {article.content || 'Article content...'}
            </p>
          </Card>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No articles available</p>
        </div>
      )}
    </div>
  )
}