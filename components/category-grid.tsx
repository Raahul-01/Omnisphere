"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { 
  Globe, 
  Briefcase, 
  Film, 
  Trophy, 
  Cpu, 
  Heart, 
  Car, 
  Plane, 
  Utensils, 
  Music, 
  Gamepad2, 
  GraduationCap,
  Microscope,
  Shirt,
  DollarSign,
  Building2,
  LandPlot
} from "lucide-react"

const PREDEFINED_CATEGORIES = [
  "Global",
  "Politics",
  "Business",
  "Entertainment",
  "Sport",
  "Technology",
  "Health",
  "Automotive",
  "Travel",
  "Food",
  "Music",
  "Gaming",
  "Education",
  "Science",
  "Fashion",
  "Finance",
  "Real Estate"
];

interface CategoryCount {
  name: string;
  count: number;
  latestArticle: {
    title: string;
    image: string;
  };
}

interface CategoryGridProps {
  categories: CategoryCount[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="container relative mx-auto px-4 pt-20 pb-6 ml-0 md:ml-[240px] max-w-full md:max-w-[calc(100vw-240px)]">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore articles across different topics
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PREDEFINED_CATEGORIES.map((categoryName) => {
          const category = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase()) || {
            name: categoryName,
            count: 0,
            latestArticle: {
              title: "No articles yet",
              image: "/placeholder.jpg"
            }
          };
          
          return (
            <Link 
              key={categoryName} 
              href={`/category/${categoryName}`}
              className="block"
            >
              <Card className="group relative h-48 overflow-hidden">
                {/* Background Image */}
                <Image
                  src={category.latestArticle.image}
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
                      <h2 className="text-xl font-bold text-white mb-2">
                        {category.name}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {category.count} {category.count === 1 ? 'article' : 'articles'}
                      </p>
                    </div>
                    
                    <p className="text-white/60 text-sm line-clamp-2">
                      Latest: {category.latestArticle.title}
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

