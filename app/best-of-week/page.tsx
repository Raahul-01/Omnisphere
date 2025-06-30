import { Metadata } from "next"
import { BestOfWeekFeed } from "../../components/best-of-week-feed"

export const metadata: Metadata = {
  title: "Best of the Week - Top Stories",
  description: "This week's most impactful and engaging stories",
}

// Mock articles data for now
const mockArticles = [
  {
    id: '1',
    title: 'Top Story of the Week',
    content: 'This is a sample article highlighting the best content of the week.',
    author: {
      name: 'Editor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor'
    },
    category: 'Featured',
    timestamp: new Date().toISOString(),
    image: '/placeholder.jpg',
  }
];

export default async function BestOfWeekPage() {
  return <BestOfWeekFeed articles={mockArticles} />;
}

