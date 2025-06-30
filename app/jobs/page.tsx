import { Metadata } from "next"
import { JobsFeed } from "@/components/jobs-feed"

export const metadata: Metadata = {
  title: "Job Opportunities",
  description: "Find your next career opportunity",
}

// Mock job articles data
const mockJobArticles = [
  {
    id: '1',
    title: 'Software Engineer - Full Stack',
    content: 'Join our dynamic team as a full-stack developer. Work with modern technologies and build scalable applications.',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '$120,000 - $150,000',
    author: {
      name: 'HR Team',
      avatar: 'https://ui-avatars.com/api/?name=HR&background=random&size=128'
    },
    category: 'Technology',
    timestamp: new Date().toISOString(),
    image: '/placeholder.jpg',
    tags: ['React', 'Node.js', 'TypeScript'],
    job_type: 'Full-time',
    experience_level: 'Mid-level'
  },
  {
    id: '2',
    title: 'Product Manager',
    content: 'Lead product development initiatives and work closely with engineering teams to deliver innovative solutions.',
    company: 'InnovateLab',
    location: 'New York, NY',
    salary: '$110,000 - $140,000',
    author: {
      name: 'Recruitment',
      avatar: 'https://ui-avatars.com/api/?name=Recruitment&background=random&size=128'
    },
    category: 'Product',
    timestamp: new Date().toISOString(),
    image: '/placeholder.jpg',
    tags: ['Product Management', 'Strategy', 'Analytics'],
    job_type: 'Full-time',
    experience_level: 'Senior'
  }
];

export default async function JobsPage() {
  return <JobsFeed articles={mockJobArticles} />
} 