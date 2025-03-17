import { useState } from 'react';
import Image from 'next/image';

const defaultImage = '/images/default-news.jpg';

const NewsCard = ({ item }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="news-card">
      {item.imageUrl && !imageError ? (
        <img 
          src={item.imageUrl}
          alt={item.title}
          onError={() => setImageError(true)}
          className="news-image"
        />
      ) : (
        <img 
          src={defaultImage}
          alt="Default"
          className="news-image"
        />
      )}
      <div className="news-content">
        <h3>{item.title}</h3>
        <p>{item.content}</p>
        <span className="category">{item.category}</span>
        <div className="news-meta">
          {item.time?.toDate ? (
            <span className="time">{item.time.toDate().toLocaleDateString()}</span>
          ) : null}
        </div>
      </div>
    </article>
  );
};

export default NewsCard; 