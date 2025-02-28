import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchNewsByCategory } from '../utils/fetchNews';
import dynamic from 'next/dynamic';

// Disable SSR for the CategoryFeed component
const CategoryFeed = dynamic(
  () => import('../../components/category-feed'),
  { ssr: false }
);

export default function CategoryNews() {
  const router = useRouter();
  const { category } = router.query;
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) return;

    const loadCategoryNews = async () => {
      try {
        setLoading(true);
        const categoryNews = await fetchNewsByCategory(category);
        setNews(categoryNews);
      } catch (err) {
        setError(err.message);
        console.error('Error loading category news:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryNews();
  }, [category]);

  if (!category) return null;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="category-news-page">
      <h1>{category} News</h1>
      <div className="news-grid">
        {news.map(item => (
          <article key={item.id} className="news-card">
            <h3>{item.title}</h3>
            <p>{item.content}</p>
            <span className="category">{item.category}</span>
          </article>
        ))}
      </div>
      <CategoryFeed category="breaking_news" />
    </div>
  );
} 