import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Best of the Week",
  description: "Top articles from this week",
}

export default function BestOfWeekPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Best of the Week</h1>
      <p>Top articles from this week will appear here.</p>
    </div>
  )
}

