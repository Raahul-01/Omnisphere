import { NextResponse } from 'next/server';

// Mock data for posts (enhanced with more realistic data)
const mockPosts = [
  {
    id: '1',
    title: 'AI Revolution: New Breakthrough Changes Everything',
    content: 'Artificial intelligence reaches new milestone with latest development. Scientists have announced a revolutionary breakthrough in machine learning that could transform industries worldwide.',
    author: {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah@omnisphere.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
    },
    category: 'Technology',
    categories: [{ id: 'tech', name: 'Technology' }],
    image: '/placeholder.jpg',
    featured: true,
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Global Climate Summit Reaches Historic Agreement',
    content: 'World leaders unite for unprecedented climate action plan. The agreement includes binding commitments from major economies to reduce carbon emissions by 50% within the next decade.',
    author: {
      id: '2', 
      name: 'Michael Chen',
      email: 'michael@omnisphere.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael'
    },
    category: 'World',
    categories: [{ id: 'world', name: 'World' }],
    image: '/placeholder.jpg',
    featured: false,
    published: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    title: 'Stock Market Hits Record High Following Tech Boom',
    content: 'Technology sector drives unprecedented market growth as investors flock to innovative companies. The surge is attributed to breakthrough developments in AI and renewable energy.',
    author: {
      id: '3',
      name: 'Emma Rodriguez', 
      email: 'emma@omnisphere.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma'
    },
    category: 'Business',
    categories: [{ id: 'business', name: 'Business' }],
    image: '/placeholder.jpg',
    featured: false,
    published: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: '4',
    title: 'Breakthrough in Quantum Computing Achieved',
    content: 'Scientists successfully demonstrate practical quantum computer applications. This development could revolutionize encryption, drug discovery, and financial modeling.',
    author: {
      id: '4',
      name: 'Prof. David Kim',
      email: 'david@omnisphere.com', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david'
    },
    category: 'Science',
    categories: [{ id: 'science', name: 'Science' }],
    image: '/placeholder.jpg',
    featured: true,
    published: true,
    createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    updatedAt: new Date(Date.now() - 10800000).toISOString()
  },
  {
    id: '5',
    title: 'Space Exploration Reaches New Frontier',
    content: 'Historic mission to Mars achieves unprecedented success. The team has gathered crucial data that will inform future space exploration missions.',
    author: {
      id: '5',
      name: 'Dr. Amanda Foster',
      email: 'amanda@omnisphere.com', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amanda'
    },
    category: 'Science',
    categories: [{ id: 'science', name: 'Science' }],
    image: '/placeholder.jpg',
    featured: false,
    published: true,
    createdAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    updatedAt: new Date(Date.now() - 14400000).toISOString()
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limitNumber = limitParam ? parseInt(limitParam) : 20;

    console.log(`📰 Posts API: Serving ${Math.min(limitNumber, mockPosts.length)} articles`);
    
    // Apply limit to mock data
    const limitedPosts = mockPosts.slice(0, limitNumber);
    
    return NextResponse.json({
      posts: limitedPosts,
      total: mockPosts.length,
      message: 'Using sample data - configure Firebase in .env.local to load real articles'
    });
    
  } catch (error) {
    console.error('Error in posts API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
} 