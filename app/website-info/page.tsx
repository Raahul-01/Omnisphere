import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Users, Target, Rocket, BarChart, Mail, Copyright } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/page-container"

export const metadata: Metadata = {
  title: "About OminiSphere",
  description: "Learn more about OminiSphere - your comprehensive platform for news and content.",
}

export default function WebsiteInfo() {
  return (
    <PageContainer>
      <div className="py-4 space-y-6">
        <h1 className="text-2xl font-bold">About OminiSphere</h1>
        
          {/* Mission Statement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-6 w-6" />
                Our Mission
              </CardTitle>
              <CardDescription>
              Empowering users with knowledge and insights
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert">
              <p className="text-lg leading-relaxed">
              OminiSphere is a digital platform that seamlessly integrates global news coverage with comprehensive content. Our mission is to empower users by providing accurate, timely information while connecting them to meaningful insights.
              </p>
            </CardContent>
          </Card>

        {/* Content Creation Process - New Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-6 w-6" />
              Our Content Creation
            </CardTitle>
            <CardDescription>
              How we generate and curate content
            </CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <p className="text-lg leading-relaxed">
              OminiSphere utilizes advanced AI technology to generate and curate content. Our system:
            </p>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 h-5 w-5 text-primary">•</div>
                <div>
                  <span className="font-semibold">Content Generation:</span>
                  <p className="text-muted-foreground">
                    Uses advanced language models to create initial drafts of articles and content
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-5 w-5 text-primary">•</div>
                <div>
                  <span className="font-semibold">Quality Assurance:</span>
                  <p className="text-muted-foreground">
                    Implements multiple validation steps to ensure accuracy and relevance
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-5 w-5 text-primary">•</div>
                <div>
                  <span className="font-semibold">Topic Selection:</span>
                  <p className="text-muted-foreground">
                    Analyzes trending topics and user interests to determine content focus
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-5 w-5 text-primary">•</div>
                <div>
                  <span className="font-semibold">Content Categories:</span>
                  <p className="text-muted-foreground">
                    Automatically categorizes content into relevant sections for easy navigation
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-5 w-5 text-primary">•</div>
                <div>
                  <span className="font-semibold">Regular Updates:</span>
                  <p className="text-muted-foreground">
                    Continuously generates fresh content to keep our platform current and engaging
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 mt-1 text-primary" />
                    <div>
                    <h3 className="font-semibold">Global Coverage</h3>
                    <p className="text-muted-foreground">Real-time news and in-depth analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 mt-1 text-primary" />
                    <div>
                    <h3 className="font-semibold">Community</h3>
                    <p className="text-muted-foreground">Connect with other readers and share insights</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BarChart className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h3 className="font-semibold">Trending Topics</h3>
                    <p className="text-muted-foreground">Stay updated with what's popular</p>
                  </div>
                  </div>
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h3 className="font-semibold">Personalized Experience</h3>
                    <p className="text-muted-foreground">Content tailored to your interests</p>
                  </div>
                </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Copyright */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-6 w-6" />
              Contact & Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                {/* Contact */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Contact Us
                    </h3>
                    <p className="text-muted-foreground">
                    For any inquiries or support:
                    </p>
                    <a 
                    href="mailto:support@ominisphere.com"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      rahulmessi7485@gmail.com
                    </a>
                  </div>

                  {/* Copyright */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                    <Copyright className="h-4 w-4" /> Copyright
                    </h3>
                  <div className="text-muted-foreground">
                    <p>© {new Date().getFullYear()} OminiSphere</p>
                    <p className="text-sm">All Rights Reserved</p>
                  </div>
                </div>
                </div>

                {/* Contact Button */}
                <div className="flex justify-center pt-2">
                    <Button variant="outline" className="gap-2">
                      <Mail className="h-4 w-4" />
                  Contact Support
                    </Button>
              </div>
              </div>
            </CardContent>
          </Card>
      </div>
    </PageContainer>
  )
} 