'use client'

import React from 'react'
import Link from 'next/link'

export default function CategoryNotFound() {
  return (
    <main className="min-h-screen">
      <div className="md:ml-[240px]">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Category Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The category you're looking for doesn't exist or has no articles.
              </p>
              <Link 
                href="/categories" 
                className="text-primary hover:underline"
              >
                Browse all categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 