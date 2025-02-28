import { Metadata } from "next"
import { adminDb } from "@/lib/firebase-admin"
import { BestOfWeekFeed } from "../../components/best-of-week-feed"

export const metadata: Metadata = {
  title: "Best of the Week - Top Stories",
  description: "This week's most impactful and engaging stories",
}

export default async function BestOfWeekPage() {
  // Get the current date and date from 7 days ago
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  try {
    // First try to get articles from the last 7 days
    let querySnapshot = await adminDb
      .collection('generated_content')
      .orderBy('time', 'desc')
      .limit(10)
      .get();

    // If no articles found in the last 7 days, get the most recent articles
    if (querySnapshot.empty) {
      console.log('No articles found in the last 7 days, fetching most recent articles');
      querySnapshot = await adminDb
        .collection('generated_content')
        .orderBy('time', 'desc')
        .limit(10)
        .get();
    }

    console.log(`Found ${querySnapshot.docs.length} articles for best of week`);

    const articles = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.original_headline || data.headline || "Untitled Article",
        content: data.content || "No content available",
        author: {
          name: data.user || "Anonymous",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.id}`
        },
        category: data.category || "Uncategorized",
        timestamp: data.time || new Date().toISOString(),
        image: data.image_url || "/placeholder.jpg",
      };
    }).filter(article => article.title && article.content); // Filter out articles without title or content

    if (articles.length === 0) {
      console.log('No valid articles found');
      // Return a message to display when no articles are found
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <h1 className="text-2xl font-bold mb-4">No Articles Available</h1>
          <p className="text-muted-foreground">Check back later for the best articles of the week.</p>
        </div>
      );
    }

    return <BestOfWeekFeed articles={articles} />;
  } catch (error) {
    console.error('Error fetching best of week articles:', error);
    // Return an error message
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground">Unable to load articles at this time. Please try again later.</p>
      </div>
    );
  }
}

