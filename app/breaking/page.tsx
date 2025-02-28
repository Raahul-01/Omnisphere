import { Feed } from "@/components/feed"

const BREAKING_NEWS = [
  {
    id: "1",
    title: "Global Health Crisis: New Virus Strain Emerges",
    author: {
      name: "Breaking News",
      avatar: "/avatars/breaking.jpg"
    },
    category: "Breaking",
    timestamp: new Date(Date.now() - 1000 * 60).toISOString(),
    image: "/images/breaking.jpg",
    format: "inverted-pyramid",
    lead: "Health officials worldwide are on high alert as a new virus strain is detected in multiple countries.",
    body: "The World Health Organization has called an emergency meeting to address the rapid spread of the virus. Initial reports suggest the strain is more transmissible but less severe than previous variants.",
    priority: 2
  },
  {
    id: "2",
    title: "Tech Giant Announces Revolutionary AI Breakthrough",
    author: {
      name: "Tech News",
      avatar: "/avatars/tech.jpg"
    },
    category: "Breaking",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    image: "/images/tech.jpg",
    format: "nut-graf",
    lead: "A major technology company claims to have achieved quantum supremacy.",
    body: "The breakthrough could revolutionize computing as we know it, with implications for cryptography, drug discovery, and climate modeling.",
    nutGraf: "This development marks a significant milestone in the quantum computing race, potentially changing the landscape of modern computing.",
    priority: 1
  }
]

export default function Breaking() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex-1 md:ml-[240px] p-4">
        <div className="max-w-[700px] mx-auto">
          <h1 className="text-xl font-bold py-3">Breaking News</h1>
          <Feed items={BREAKING_NEWS} showHeader={false} />
        </div>
      </div>
    </main>
  )
}

