"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { CATEGORIES, type CategoryWithStats } from "@/lib/categories"

interface CategoryGridProps {
  categories: CategoryWithStats[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="px-4 py-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore articles across different topics
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((categoryConfig) => {
          const category = categories.find(c => c.name.toLowerCase() === categoryConfig.name.toLowerCase()) || {
            ...categoryConfig,
            count: 0,
            latestArticle: {
              title: "No articles yet",
              image: "/placeholder.jpg"
            }
          };

          const IconComponent = categoryConfig.icon;

          return (
            <Link
              key={categoryConfig.id}
              href={`/category/${categoryConfig.slug}`}
              className="block"
            >
              <Card className="group relative h-48 overflow-hidden">
                {/* Background Image */}
                <Image
                  src={category.latestArticle?.image || "/placeholder.jpg"}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== "/placeholder.jpg") {
                      target.src = "/placeholder.jpg";
                    }
                  }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors">
                  <div className="p-6 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <IconComponent className="w-5 h-5 text-white" />
                        <h2 className="text-xl font-bold text-white">
                          {category.name}
                        </h2>
                      </div>
                      <p className="text-white/80 text-sm">
                        {category.count} {category.count === 1 ? 'article' : 'articles'}
                      </p>
                    </div>
                    
                    <p className="text-white/60 text-sm line-clamp-2">
                      {category.latestArticle?.title || categoryConfig.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

