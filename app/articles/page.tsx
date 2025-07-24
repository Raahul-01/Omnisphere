import { Metadata } from "next"
import { fetchAllContent } from "@/lib/firebase-utils"
import AllArticlesFeed from "@/components/all-articles-feed"

export const metadata: Metadata = {
  title: "All Articles - OminiSphere",
  description: "Browse all articles and stories from OminiSphere",
}

export default async function AllArticlesPage() {
  // Fetch all articles from Firebase
  try {
    const allArticles = await fetchAllContent(100); // Fetch more articles

    return (
      <div className="px-4 py-4">
        <AllArticlesFeed articles={allArticles} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching all articles:', error);
    return (
      <div className="px-4 py-4">
        <AllArticlesFeed articles={[]} />
      </div>
    );
  }
}
