import { useEffect, useState } from 'react';
import { fetchBreakingNews, fetchTrendingNews, fetchNewsByCategory } from '../utils/fetchNews';

const NewsSection = () => {
  const [breakingNews, setBreakingNews] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [categoryNews, setCategoryNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const [breaking, trending, finance] = await Promise.all([
          fetchBreakingNews(),
          fetchTrendingNews(),
          fetchNewsByCategory('Finance')
        ]);
        
        setBreakingNews(breaking);
        setTrendingNews(trending);
        setCategoryNews(finance);
      } catch (err) {
        setError(err.message);
        console.error('Error loading news:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="news-container">
      <section className="breaking-news">
        <h2>Breaking News</h2>
        {breakingNews.map(news => (
          <article key={news.id}>
            <h3>{news.title}</h3>
            <p>{news.content}</p>
            <span>{news.category}</span>
          </article>
        ))}
      </section>

      <section className="trending-news">
        <h2>Trending News</h2>
        {trendingNews.map(news => (
          <article key={news.id}>
            <h3>{news.title}</h3>
            <p>{news.content}</p>
            <span>{news.category}</span>
          </article>
        ))}
      </section>

      <section className="category-news">
        <h2>Finance News</h2>
        {categoryNews.map(news => (
          <article key={news.id}>
            <h3>{news.title}</h3>
            <p>{news.content}</p>
            <span>{news.category}</span>
          </article>
        ))}
      </section>
    </div>
  );
};

export default NewsSection; 