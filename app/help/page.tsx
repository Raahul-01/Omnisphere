import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  HelpCircle, 
  Book, 
  Mail, 
  Shield, 
  Settings, 
  User, 
  FileQuestion,
  Newspaper,
  Briefcase,
  Bell,
  Search,
  Bookmark,
  ThumbsUp,
  Lock,
  KeyRound,
  AlertTriangle,
  Smartphone,
  Globe,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/page-container"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Help & Information | Omnisphere",
  description: "Get help and learn more about using Omnisphere. Find answers to common questions, user guides, and support information.",
}

const faqs = [
  {
    question: "How do I create an account?",
    answer: "Click the 'Sign Up' button in the sidebar, enter your email and create a password. Verify your email to activate your account."
  },
  {
    question: "How do I save articles for later?",
    answer: "Click the bookmark icon on any article to save it to your bookmarks. Access saved articles from the 'Bookmarks' section in the sidebar."
  },
  {
    question: "Can I customize my news feed?",
    answer: "Yes! Select your interests in the Categories section and follow specific topics to personalize your feed."
  },
  {
    question: "How do I apply for jobs?",
    answer: "Browse the Jobs/Careers section, find a position that interests you, and follow the application instructions provided in the job listing."
  },
  {
    question: "How do I get notifications?",
    answer: "Enable notifications in your profile settings to receive alerts about breaking news, job matches, and updates in your areas of interest."
  }
]

export default function Help() {
  return (
    <PageContainer>
      <div className="py-4 space-y-6">
        <h1 className="text-2xl font-bold">Help & Information</h1>
        
          <Card>
            <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I create an account?</AccordionTrigger>
                <AccordionContent>
                  Click the Sign Up button in the sidebar and follow the registration process.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How do I save articles?</AccordionTrigger>
                <AccordionContent>
                  Click the bookmark icon on any article to save it to your library.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>How do I update my profile?</AccordionTrigger>
                <AccordionContent>
                  Go to your profile page and click the Edit Profile button to make changes.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
              If you need additional assistance, please contact our support team.
            </p>
            </CardContent>
          </Card>
      </div>
    </PageContainer>
  )
}

