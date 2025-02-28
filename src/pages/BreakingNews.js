import { useEffect, useState } from 'react';
import { fetchBreakingNews } from '../utils/fetchNews';

const BreakingNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBreakingNews = async () => {
      try {
        setLoading(true);
        const breakingNews = await fetchBreakingNews();
        setNews(breakingNews);
      } catch (err) {
        setError(err.message);
        console.error('Error loading breaking news:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBreakingNews();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="breaking-news-page">
      <h1>Breaking News</h1>
      <div className="news-grid">
        {news.map(item => (
          <article key={item.id} className="news-card">
            <h3>{item.title}</h3>
            <p>{item.content}</p>
            <span className="category">{item.category}</span>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BreakingNews; 