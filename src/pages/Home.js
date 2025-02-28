import { useEffect, useState } from 'react';
import { fetchBreakingNews, fetchTrendingNews, fetchNewsByCategory, fetchAllNews } from '../utils/fetchNews';
import NewsCard from '../components/NewsCard';
import { testFirestoreConnection } from '../utils/testFirestore';

const Home = () => {
  const [news, setNews] = useState({
    breaking: [],
    trending: [],
    finance: [],
    allNews: [] // New state for all news
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHomeNews = async () => {
      try {
        // Test Firestore connection first
        const isConnected = await testFirestoreConnection();
        if (!isConnected) {
          throw new Error('Failed to connect to Firestore');
        }

        console.log('Starting to load home news...'); // This should appear in console
        setLoading(true);
        
        const [breaking, trending, finance, all] = await Promise.all([
          fetchBreakingNews(5).catch(err => {
            console.error('Breaking News Error:', err);
            return [];
          }),
          fetchTrendingNews(5).catch(err => {
            console.error('Trending News Error:', err);
            return [];
          }),
          fetchNewsByCategory('Finance', 5).catch(err => {
            console.error('Finance News Error:', err);
            return [];
          }),
          fetchAllNews(15).catch(err => {
            console.error('All News Error:', err);
            return [];
          })
        ]);

        console.log('Fetched News Data:', {
          breaking: breaking.length,
          trending: trending.length,
          finance: finance.length,
          all: all.length
        });

        setNews({
          breaking,
          trending,
          finance,
          allNews: all
        });
      } catch (err) {
        console.error('Home Component Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadHomeNews();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // If no specific categories have data, show all news
  if (news.breaking.length === 0 && news.trending.length === 0 && news.finance.length === 0) {
    return (
      <div className="home-container">
        <section>
          <h2>Latest News</h2>
          <div className="news-grid">
            {news.allNews.map(item => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="home-container">
      {news.breaking.length > 0 && (
        <section>
          <h2>Breaking News</h2>
          <div className="news-grid">
            {news.breaking.map(item => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {news.trending.length > 0 && (
        <section>
          <h2>Trending Now</h2>
          <div className="news-grid">
            {news.trending.map(item => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {news.finance.length > 0 && (
        <section>
          <h2>Finance Updates</h2>
          <div className="news-grid">
            {news.finance.map(item => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home; 