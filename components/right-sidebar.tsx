import React from 'react'
import { Card } from "./ui/card"

export function RightSidebar() {
  return (
    <aside className="w-64 p-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Trending Topics</h3>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Technology</p>
          <p className="text-sm text-muted-foreground">Business</p>
          <p className="text-sm text-muted-foreground">Science</p>
        </div>
      </Card>
    </aside>
  )
}