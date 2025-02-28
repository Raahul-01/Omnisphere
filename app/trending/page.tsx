import { Metadata } from "next"
import { adminDb } from "@/lib/firebase-admin"
import { TrendingFeed } from "@/components/trending-feed"
import { PageContainer } from "@/components/layout/page-container"

export const metadata: Metadata = {
  title: "Trending Now - OminiSphere",
  description: "Most popular and trending stories from OminiSphere",
}

export default async function TrendingPage() {
  // Fetch articles where features.trending_news is true
  const querySnapshot = await adminDb
    .collection('generated_content')
    .where('features.trending_news', '==', true)
    .orderBy('time', 'desc')
    .get();

  const trendingArticles = querySnapshot.docs.map(doc => ({
    id: doc.id,
    title: doc.data().original_headline || doc.data().headline || "",
    content: doc.data().content || "",
    author: {
      name: doc.data().user || "Anonymous",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.id}`
    },
    category: doc.data().category || "",
    timestamp: doc.data().time || "",
    image: doc.data().image_url || "",
  }));

  return (
    <PageContainer>
      <TrendingFeed articles={trendingArticles} />
    </PageContainer>
  );
}

