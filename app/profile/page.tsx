"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/layout/page-container"
import { useAuth } from "@/lib/auth-context"
import { User, Mail, Calendar, Settings } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <p className="text-muted-foreground">You need to be signed in to view your profile.</p>
        </div>
      </PageContainer>
    )
  }

  const mockStats = {
    articlesRead: 42,
    bookmarks: 15,
    timeSpent: "12h 34m",
    favoriteCategory: "Technology"
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} />
                <AvatarFallback className="text-2xl">
                  {user.displayName?.[0] || user.email?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{user.displayName || 'Anonymous User'}</h1>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Member since January 2024
                </div>
              </div>
              <div className="ml-auto">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Articles Read</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.articlesRead}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.bookmarks}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.timeSpent}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Favorite Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">{mockStats.favoriteCategory}</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Read "AI Breakthrough in Healthcare"</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
                <Badge variant="outline">Technology</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Bookmarked "Market Analysis 2024"</p>
                  <p className="text-sm text-muted-foreground">1 day ago</p>
                </div>
                <Badge variant="outline">Business</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Read "Climate Change Solutions"</p>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
                <Badge variant="outline">Science</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}

