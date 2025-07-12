import { Metadata } from "next"
import { fetchTrendingNews } from "@/lib/firebase-utils"
import { TrendingFeed } from "@/components/trending-feed"

export const metadata: Metadata = {
  title: "Trending Now - OminiSphere",
  description: "Most popular and trending stories from OminiSphere",
}

export default async function TrendingPage() {
  // Fetch real trending data from Firebase
  try {
    const trendingArticles = await fetchTrendingNews(20);

    return (
      <div className="px-4 py-4">
        <TrendingFeed articles={trendingArticles} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching trending articles:', error);
    return (
      <div className="px-4 py-4">
        <TrendingFeed articles={[]} />
      </div>
    );
  }
}

