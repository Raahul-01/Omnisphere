import { NextResponse } from 'next/server';

// Mock data for posts
const mockPosts = [
  {
    id: '1',
    title: 'Welcome to Omnisphere',
    content: 'This is a sample article to demonstrate the platform.',
    createdAt: new Date().toISOString(),
    author: {
      id: '1',
      name: 'Admin',
      email: 'admin@omnisphere.com'
    },
    categories: [
      { id: '1', name: 'Technology' }
    ]
  }
];

export async function GET() {
  try {
    // Return mock posts for now
    return NextResponse.json(mockPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
} 