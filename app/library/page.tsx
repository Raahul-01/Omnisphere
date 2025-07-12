"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { History, Bookmark } from "lucide-react"
import { ArticleFeed } from "@/components/article-feed"
import { db, auth } from "@/lib/firebase"
import { collection, query, orderBy, getDocs, doc, getDoc } from "firebase/firestore"
import { onAuthStateChanged, User } from "firebase/auth"


interface Article {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  timestamp: string;
  image: string;
  tags: string[];
}

export default function LibraryPage() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [historyArticles, setHistoryArticles] = useState<Article[]>([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState("history");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchUserLibrary() {
      if (!user) {
        setHistoryArticles([]);
        setBookmarkedArticles([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch history
        const historyRef = collection(db, 'users', user.uid, 'history');
        const historyQuery = query(historyRef, orderBy('viewedAt', 'desc'));
        const historySnapshot = await getDocs(historyQuery);
        
        const historyDocs = await Promise.all(
          historySnapshot.docs.map(async (historyDoc) => {
            const articleRef = doc(db, 'articles', (historyDoc.data() as any).articleId);
            const articleSnap = await getDoc(articleRef);
            const articleData = articleSnap.data();
            if (!articleData) return null;
            
            return {
              id: articleSnap.id,
              title: (articleData as any).original_headline || (articleData as any).headline || "",
              content: (articleData as any).content || "",
              author: {
                name: (articleData as any).user || "Anonymous",
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent((articleData as any).user || 'Anonymous')}&background=random&size=128`
              },
              category: (articleData as any).category || "General",
              timestamp: (articleData as any).time || new Date().toISOString(),
              image: (articleData as any).image_url || "/placeholder.jpg",
              tags: Array.isArray((articleData as any).tags) ? (articleData as any).tags : [],
            };
          })
        );

        // Fetch bookmarks
        const bookmarksRef = collection(db, 'users', user.uid, 'bookmarks');
        const bookmarksQuery = query(bookmarksRef, orderBy('savedAt', 'desc'));
        const bookmarksSnapshot = await getDocs(bookmarksQuery);
        
        const bookmarkDocs = await Promise.all(
          bookmarksSnapshot.docs.map(async (bookmarkDoc) => {
            const articleRef = doc(db, 'articles', (bookmarkDoc.data() as any).articleId);
            const articleSnap = await getDoc(articleRef);
            const articleData = articleSnap.data();
            if (!articleData) return null;
            
            return {
              id: articleSnap.id,
              title: (articleData as any).original_headline || (articleData as any).headline || "",
              content: (articleData as any).content || "",
              author: {
                name: (articleData as any).user || "Anonymous",
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent((articleData as any).user || 'Anonymous')}&background=random&size=128`
              },
              category: (articleData as any).category || "General",
              timestamp: (articleData as any).time || new Date().toISOString(),
              image: (articleData as any).image_url || "/placeholder.jpg",
              tags: Array.isArray((articleData as any).tags) ? (articleData as any).tags : [],
            };
          })
        );

        setHistoryArticles(historyDocs.filter(Boolean) as Article[]);
        setBookmarkedArticles(bookmarkDocs.filter(Boolean) as Article[]);
      } catch (error) {
        console.error('Error fetching library:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserLibrary();
  }, [user]);

  if (!user) {
    return (
      <div className="px-4 py-4">
        <div className="max-w-[1200px] mx-auto text-center py-8">
          <h2 className="text-2xl font-bold mb-2">Sign in Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your history and bookmarks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="max-w-[1200px] mx-auto">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Library</h1>
            <TabsList>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                Bookmarks
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="history">
            {loading ? (
              <div className="text-center py-12">Loading history...</div>
            ) : historyArticles.length > 0 ? (
              <ArticleFeed articles={historyArticles} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No reading history yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookmarks">
            {loading ? (
              <div className="text-center py-12">Loading bookmarks...</div>
            ) : bookmarkedArticles.length > 0 ? (
              <ArticleFeed articles={bookmarkedArticles} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No bookmarks yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 