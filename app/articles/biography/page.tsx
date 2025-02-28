"use client"

import { CategoryFeed } from "@/components/category-feed"

export default function BiographyPage() {
  return (
    <div className="md:ml-[240px] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Biography Articles</h1>
        <CategoryFeed category="biography" />
      </div>
    </div>
  )
} 