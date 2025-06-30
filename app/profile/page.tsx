"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { Edit2, Save, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
// Firebase removed - using mock auth
import { useRouter } from "next/navigation"
import { PageContainer } from "@/components/layout/page-container"

// Predefined avatar options
const avatarOptions = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Nova",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zephyr",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
]

export default function Profile() {
  const { user } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatar: '',
    joinDate: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/sign-in')
      return
    }

    // Get user data from Firebase Auth
    const name = user.displayName || ''
    const email = user.email || ''
    const avatar = user.photoURL || avatarOptions[0]
    const joinDate = user.metadata.creationTime || new Date().toISOString()

    setUserData({
      name,
      email,
      avatar,
      joinDate: new Date(joinDate).getFullYear().toString()
    })

    // Set initial form data
    const [firstName = '', lastName = ''] = name.split(' ')
    setEditForm({ firstName, lastName })
  }, [user, router])

  const handleStartEditing = () => {
    const [firstName = '', lastName = ''] = userData.name.split(' ')
    setEditForm({ firstName, lastName })
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    const [firstName = '', lastName = ''] = userData.name.split(' ')
    setEditForm({ firstName, lastName })
  }

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    // Create full name
    const fullName = `${editForm.firstName} ${editForm.lastName}`.trim()
    
    try {
      // Update Firebase profile
      await updateProfile(user, {
        displayName: fullName,
      })
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        name: fullName
      }))

      // Exit edit mode
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvatarChange = async (newAvatar: string) => {
    if (!user) return

    try {
      // Update Firebase profile
      await updateProfile(user, {
        photoURL: newAvatar,
      })

      // Update local state
      setUserData(prev => ({
        ...prev,
        avatar: newAvatar
      }))
    } catch (error) {
      console.error('Error updating avatar:', error)
    }
  }

  if (!user) {
    return null // or a loading state
  }

  return (
    <PageContainer>
      <div className="py-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <Button 
            variant={isEditing ? "ghost" : "outline"} 
            onClick={isEditing ? handleCancelEdit : handleStartEditing}
          >
            {isEditing ? (
              <><X className="h-4 w-4 mr-2" /> Cancel</>
            ) : (
              <><Edit2 className="h-4 w-4 mr-2" /> Edit Profile</>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-semibold">{userData.name || "Update Your Profile"}</h2>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="text-sm text-muted-foreground text-center">
                  Member since {userData.joinDate}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="md:col-span-2">
            <Tabs defaultValue="settings">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="collections">Collections</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="collections" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Collections</CardTitle>
                    <CardDescription>Manage and view your created collections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">No collections yet</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent interactions and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">No recent activity</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Update your profile information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Avatar Selection */}
                      <div className={`space-y-4 ${!isEditing && 'opacity-50 pointer-events-none'}`}>
                        <Label>Choose Avatar</Label>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                          {avatarOptions.map((avatar, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleAvatarChange(avatar)}
                              className={`relative rounded-full overflow-hidden hover:ring-2 hover:ring-primary transition-all ${
                                userData.avatar === avatar ? 'ring-2 ring-primary' : ''
                              }`}
                            >
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={avatar} />
                              </Avatar>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Profile Form */}
                      <form onSubmit={handleSaveChanges} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input 
                              id="firstName" 
                              name="firstName"
                              value={editForm.firstName}
                              onChange={handleInputChange}
                              placeholder="First Name"
                              disabled={!isEditing}
                              className={!isEditing ? 'bg-muted' : ''}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input 
                              id="lastName" 
                              name="lastName"
                              value={editForm.lastName}
                              onChange={handleInputChange}
                              placeholder="Last Name"
                              disabled={!isEditing}
                              className={!isEditing ? 'bg-muted' : ''}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              value={userData.email}
                              disabled
                              className="bg-muted cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                          </div>
                        </div>
                        {isEditing && (
                          <Button type="submit">
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                        )}
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

