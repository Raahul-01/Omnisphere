"use client"

import { TrendingFeed } from "@/components/trending-feed"
import { LeftSidebar } from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"

export function TrendingPageContent() {
  return (
    <main className="flex min-h-screen relative">
      <LeftSidebar />
      <div className="flex-1 flex flex-col md:ml-[240px] md:mr-[240px]">
        {/* Static Header */}
        <div className="fixed top-0 left-0 right-0 z-30 bg-background md:fixed md:left-[240px] md:right-[240px]">
          <div className="h-14 flex items-center justify-center border-b">
            <span className="text-lg font-bold">Trending News</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 w-full mt-[60px] px-4">
          <TrendingFeed />
        </div>
      </div>
      <RightSidebar />
    </main>
  )
} 