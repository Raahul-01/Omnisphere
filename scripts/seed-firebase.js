const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Firebase configuration (using environment variables or defaults)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdefghijklmnop"
};

// Sample articles to seed
const sampleArticles = [
  {
    title: "AI Revolution: New Breakthrough Changes Everything",
    content: "Artificial intelligence reaches new milestone with latest development. Scientists have announced a revolutionary breakthrough in machine learning that could transform industries worldwide.",
    author: {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: "sarah@omnisphere.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
    },
    category: "Technology",
    categories: [{ id: "tech", name: "Technology" }],
    image: "/placeholder.jpg",
    featured: true,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Global Climate Summit Reaches Historic Agreement",
    content: "World leaders unite for unprecedented climate action plan. The agreement includes binding commitments from major economies to reduce carbon emissions by 50% within the next decade.",
    author: {
      id: "2", 
      name: "Michael Chen",
      email: "michael@omnisphere.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael"
    },
    category: "World",
    categories: [{ id: "world", name: "World" }],
    image: "/placeholder.jpg",
    featured: false,
    published: true,
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    updatedAt: new Date(Date.now() - 3600000)
  },
  {
    title: "Stock Market Hits Record High Following Tech Boom",
    content: "Technology sector drives unprecedented market growth as investors flock to innovative companies. The surge is attributed to breakthrough developments in AI and renewable energy.",
    author: {
      id: "3",
      name: "Emma Rodriguez", 
      email: "emma@omnisphere.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma"
    },
    category: "Business",
    categories: [{ id: "business", name: "Business" }],
    image: "/placeholder.jpg",
    featured: false,
    published: true,
    createdAt: new Date(Date.now() - 7200000), // 2 hours ago
    updatedAt: new Date(Date.now() - 7200000)
  },
  {
    title: "Breakthrough in Quantum Computing Achieved",
    content: "Scientists successfully demonstrate practical quantum computer applications. This development could revolutionize encryption, drug discovery, and financial modeling.",
    author: {
      id: "4",
      name: "Prof. David Kim",
      email: "david@omnisphere.com", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david"
    },
    category: "Science",
    categories: [{ id: "science", name: "Science" }],
    image: "/placeholder.jpg",
    featured: true,
    published: true,
    createdAt: new Date(Date.now() - 10800000), // 3 hours ago
    updatedAt: new Date(Date.now() - 10800000)
  }
];

async function seedFirebase() {
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('Seeding articles...');
    
    for (const article of sampleArticles) {
      try {
        // Add to both 'articles' and 'posts' collections for compatibility
        const articlesRef = collection(db, 'articles');
        const postsRef = collection(db, 'posts');
        
        const docData = {
          ...article,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        const articleResult = await addDoc(articlesRef, docData);
        const postResult = await addDoc(postsRef, docData);
        
        console.log(`✅ Added article: "${article.title}" (Article ID: ${articleResult.id}, Post ID: ${postResult.id})`);
      } catch (error) {
        console.error(`❌ Error adding article "${article.title}":`, error);
      }
    }

    console.log('\n🎉 Firebase seeding completed!');
    console.log('You can now view your articles at:');
    console.log(`- Firestore Console: https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`);
    
  } catch (error) {
    console.error('❌ Error seeding Firebase:', error);
    console.log('\n💡 Make sure you have:');
    console.log('1. Created a Firebase project');
    console.log('2. Set up Firestore database');
    console.log('3. Updated .env.local with your Firebase credentials');
    console.log('4. Applied the firestore.rules to allow read/write access');
  }
}

// Run the seeding script
if (require.main === module) {
  seedFirebase();
}

module.exports = { seedFirebase };