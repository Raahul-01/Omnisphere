import random
from flask import Flask, request, jsonify
from flask_cors import CORS
import schedule
import time
import logging
from datetime import datetime, timedelta, timezone
import os
import requests
from pytrends.request import TrendReq
from dotenv import load_dotenv
from fuzzywuzzy import fuzz
import firebase_admin
from firebase_admin import credentials, firestore
# Add this import
from dateutil import parser
import json
import asyncio
import aiohttp
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import google.generativeai as genai
# Add this for Vercel
from waitress import serve

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Add this for Vercel
from waitress import serve

# Configuration
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
WORLD_NEWS_API_KEY = os.getenv("WORLD_NEWS_API_KEY")
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")  # Move this to environment variable
GOOGLE_CSE_ID = os.getenv("GOOGLE_CSE_ID")
# Update API URL to use relative path instead of localhost
PYTHON_API_URL = ""  # This will be relative to wherever the app is deployed

# Add a health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

# PASTE YOUR FUNCTION HERE
# For example:
# @app.route('/api/your-endpoint', methods=['POST'])
# def your_function():
#     Your code goes here...

# Configuration
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
WORLD_NEWS_API_KEY = os.getenv("WORLD_NEWS_API_KEY")
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")
GOOGLE_API_KEY = "AIzaSyDAy04td-Ex9MzTuRuCV0U0j_mcZvcVDLc"  # Your Google Custom Search API Key
GOOGLE_CSE_ID = os.getenv("GOOGLE_CSE_ID")  # Your Custom Search Engine ID
PYTHON_API_URL = os.getenv("PYTHON_API_URL", "http://localhost:5000")
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
NEWS_API_URL = "https://newsapi.org/v2/everything"
WORLD_NEWS_API_URL = "https://api.worldnewsapi.com/search-news"
SERPAPI_KEY = "8896cdea629dcc3663aa3c065c3e06fd3326ea69afe9cbb020dcd45dec439048"
SERPAPI_URL = "https://serpapi.com/search"
MAX_TRENDS = 20
MAX_ARTICLES = 20
RETRY_ATTEMPTS = 3
SAVE_DIR = "generated_content"
REGION = "india"
TIMEOUT = 30
MAX_FILE_AGE_HOURS = 12
SIMILARITY_THRESHOLD = 80

# Firebase setup
try:
    cred = credentials.Certificate("firebase-credentials.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("✅ Firebase Admin initialized successfully")
except ValueError as e:
    if "already exists" in str(e):
        print("ℹ️ Firebase app already initialized, using existing app")
        db = firestore.client()
    else:
        raise e

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("content_generator.log"),
        logging.StreamHandler()
    ]
)

# Configure retry strategy
retry_strategy = Retry(
    total=3,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["HEAD", "GET", "POST"]  # Updated from method_whitelist
)

adapter = HTTPAdapter(max_retries=retry_strategy)
session = requests.Session()
session.mount("https://", adapter)
session.mount("http://", adapter)

async def fetch_trends():
    """Fetch trending topics"""
    try:
        response = session.get(f"{PYTHON_API_URL}/api/trends", timeout=30)
        response.raise_for_status()
        return response.json().get('trends', [])
    except Exception as e:
        logging.error(f"Error fetching trends: {str(e)}")
        return []

def validate_environment():
    """Check required environment variables and directories"""
    if not all([GEMINI_API_KEY, DEEPSEEK_API_KEY, NEWS_API_KEY, WORLD_NEWS_API_KEY, GOOGLE_API_KEY, GOOGLE_CSE_ID]):
        raise ValueError("Missing API keys or CSE ID in environment variables")
    
    os.makedirs(SAVE_DIR, exist_ok=True)
    return True

recent_topics = {}

def clean_old_files():
    """Delete files in SAVE_DIR older than MAX_FILE_AGE_HOURS."""
    pass  # Disabled content deletion

def clean_old_topics():
    """Remove topics older than 24 hours from recent_topics."""
    pass  # Disabled content deletion

# Add these constants at the top with other constants
NEWS_API_KEYS = [
    os.getenv("NEWS_API_KEY"),
    os.getenv("NEWS_API_KEY_2", ""),  # Add backup API keys
    os.getenv("NEWS_API_KEY_3", ""),
]
TOPIC_FRESHNESS_HOURS = 6  # Reduced from 48 to 6 hours
MAX_RETRIES_ON_RATE_LIMIT = 5
RATE_LIMIT_DELAY = 10  # seconds

def is_topic_recent(topic):
    """Check if a topic has been processed recently with updated time window"""
    if topic in recent_topics:
        current_time = datetime.now(timezone.utc)
        last_processed = recent_topics[topic].replace(tzinfo=timezone.utc)
        time_since_last_processed = current_time - last_processed
        
        # Only consider topics processed in the last 2 hours as recent
        if time_since_last_processed <= timedelta(hours=2):
            # Double check with news to ensure we're not missing updates
            news_articles = fetch_news(topic)
            if not news_articles:
                return True
            # If there are new articles, process the topic again
            return False
    return False

def is_topic_similar(topic, existing_topics):
    """Check if a topic is similar to any existing topic using fuzzy matching."""
    for existing_topic in existing_topics:
        similarity = fuzz.ratio(topic.lower(), existing_topic.lower())
        if similarity >= SIMILARITY_THRESHOLD:
            return True
    return False

def check_existing_content(topic, save_dir=SAVE_DIR):
    """
    Check if content with a similar topic already exists in Firebase
    """
    try:
        # Query Firebase for existing content
        docs = db.collection("generated_content")\
                .where("trending_topics", "==", topic)\
                .limit(1)\
                .get()
        
        if not docs:
            return False

        # Check if the existing content is from the last 2 hours
        for doc in docs:
            content_time = parser.parse(doc.to_dict().get('time', ''))
            current_time = datetime.now(timezone.utc)
            if (current_time - content_time) <= timedelta(hours=2):
                return True
            return False
    except Exception as e:
        logging.error(f"Error checking existing content: {str(e)}")
        return False  # If there's an error, allow processing

# Add this near the top with other constants
FALLBACK_REGIONS = [
    'united_states',
    'worldwide',
    'india',
    'united_kingdom',
    'canada',
    'australia',
    'germany',
    'france',
    'japan',
    'brazil',
    'china',
    'singapore'
]

# Add new constants
SKIP_THRESHOLD = 10  # Maximum number of skipped topics before trying another region
MIN_TOPICS_REQUIRED = 3  # Minimum number of new topics needed

# Constants for trend sources
TREND_SOURCES = {
    "reddit": ["technology", "worldnews", "science", "business", "politics"],
    "news_sites": [
        "https://www.reuters.com/trending",
        "https://www.bbc.com/news",
        "https://www.theguardian.com/most-read"
    ],
    "tech_sites": [
        "https://techcrunch.com",
        "https://www.theverge.com",
        "https://www.wired.com"
    ]
}

class TrendingSystem:
    def __init__(self):
        self.pytrends = TrendReq(hl='en-US', tz=360)
        self.cache = {}
        self.cache_time = {}

    async def setup(self):
        await self.init_aiohttp_session()

    async def get_google_trends(self):
        try:
            # Get real-time trending searches
            trending_searches_df = self.pytrends.trending_searches()
            realtime_trends = trending_searches_df[0].tolist()[:10]

            # Get daily trends with more context
            daily_trends = self.pytrends.today_searches()
            
            # Get related queries for each trend
            enriched_trends = []
            for trend in realtime_trends:
                self.pytrends.build_payload([trend], timeframe='now 1-d')
                related_queries = self.pytrends.related_queries()
                
                enriched_trends.append({
                    'topic': trend,
                    'related_queries': related_queries[trend]['top'].values.tolist() if related_queries[trend] and 'top' in related_queries[trend] else [],
                    'type': 'trending',
                    'score': 100
                })

            return enriched_trends
        except Exception as e:
            logging.error(f"Error fetching Google Trends: {e}")
            return []

    async def get_trending_topics(self):
        all_trends = []
        
        # Fetch trends from multiple sources concurrently
        tasks = [
            self.get_google_trends(),
            self.get_reddit_trends(),
            self.get_news_site_trends(),
            self.get_tech_trends()
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for result in results:
            if isinstance(result, list):
                all_trends.extend(result)

        # Process and score trends
        processed_trends = self.process_trends(all_trends)
        
        # Store in cache with timestamp
        self.cache['trends'] = processed_trends
        self.cache_time['trends'] = datetime.now()

        return processed_trends

    def process_trends(self, all_trends):
        trend_scores = {}
        
        for trend in all_trends:
            topic = trend['topic'].lower()
            
            if topic not in trend_scores:
                trend_scores[topic] = {
                    'topic': trend['topic'],
                    'score': 0,
                    'sources': set(),
                    'related_queries': set(),
                    'categories': set()
                }
            
            # Update score based on source
            source_scores = {
                'google': 100,
                'reddit': 80,
                'news': 70,
                'tech': 60
            }
            
            trend_scores[topic]['score'] += source_scores.get(trend.get('source', 'other'), 50)
            trend_scores[topic]['sources'].add(trend.get('source', 'other'))
            
            # Add related queries if available
            if 'related_queries' in trend:
                trend_scores[topic]['related_queries'].update(trend['related_queries'])
            
            # Add categories if available
            if 'category' in trend:
                trend_scores[topic]['categories'].add(trend['category'])

        # Convert to list and sort by score
        processed_trends = []
        for topic, data in trend_scores.items():
            processed_trends.append({
                'topic': data['topic'],
                'score': data['score'],
                'sources': list(data['sources']),
                'related_queries': list(data['related_queries']),
                'categories': list(data['categories']),
                'seo_keywords': self.generate_seo_keywords(data)
            })
        
        return sorted(processed_trends, key=lambda x: x['score'], reverse=True)

    def generate_seo_keywords(self, trend_data):
        keywords = set()
        
        # Add main topic
        keywords.add(trend_data['topic'])
        
        # Add related queries
        keywords.update(trend_data['related_queries'])
        
        # Add category-based keywords
        for category in trend_data['categories']:
            keywords.add(f"{category} {trend_data['topic']}")
            keywords.add(f"{trend_data['topic']} {category}")
        
        return list(keywords)

# Initialize trending system
trending_system = TrendingSystem()

@app.route('/api/trends', methods=['GET'])
async def get_trends():
    """API endpoint to get trending topics"""
    try:
        trends = await trending_system.get_trending_topics()
        return jsonify({
            "success": True,
            "trends": trends
        })
    except Exception as e:
        logging.error(f"Error fetching trends: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Failed to fetch trends"
        }), 500

def fetch_serpapi_news(query, attempt=1):
    """Fetch news articles using Google News SerpAPI"""
    try:
        params = {
            "engine": "google_news",
            "q": query,
            "api_key": SERPAPI_KEY,
            "num": MAX_ARTICLES
        }
        response = requests.get(SERPAPI_URL, params=params, timeout=TIMEOUT)
        response.raise_for_status()
        data = response.json()
        
        articles = []
        for article in data.get("news_results", []):
            articles.append({
                "source": {"name": article.get("source", {}).get("title", "Unknown Source")},
                "title": article.get("title", ""),
                "description": article.get("snippet", ""),
                "publishedAt": article.get("date", "")
            })
        return articles
    except Exception as e:
        if attempt <= RETRY_ATTEMPTS:
            logging.warning(f"Attempt {attempt} failed. Retrying...")
            time.sleep(2 ** attempt)
            return fetch_serpapi_news(query, attempt + 1)
        logging.error(f"SerpAPI request failed after {RETRY_ATTEMPTS} attempts: {str(e)}")
        return []

def fetch_world_news(query):
    """Fetch news articles using World News API."""
    try:
        params = {
            "api-key": WORLD_NEWS_API_KEY,
            "text": query,
            "language": "en",
            "number": MAX_ARTICLES
        }
        response = requests.get(WORLD_NEWS_API_URL, params=params, timeout=TIMEOUT)
        response.raise_for_status()
        data = response.json()
        articles = []
        for article in data.get("news", []):
            articles.append({
                "source": {"name": article.get("source", {}).get("name", "World News")},
                "title": article.get("title", ""),
                "description": article.get("text", "")[:200],
                "publishedAt": article.get("publish_date", "")
            })
        return articles
    except Exception as e:
        logging.error(f"World News API error: {str(e)}")
        return []

def fetch_news(query, attempt=1, api_key_index=0):
    """Fetch news articles with API key rotation and improved rate limit handling"""
    try:
        # Rotate through API keys
        current_api_key = NEWS_API_KEYS[api_key_index % len(NEWS_API_KEYS)]
        if not current_api_key:
            return fetch_serpapi_news(query)

        params = {
            "apiKey": current_api_key,
            "q": query,
            "from": (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d"),
            "sortBy": "publishedAt",
            "pageSize": MAX_ARTICLES,
            "language": "en"
        }
        
        try:
            response = requests.get(NEWS_API_URL, params=params, timeout=TIMEOUT)
            if response.status_code == 429:  # Rate limit hit
                if api_key_index + 1 < len(NEWS_API_KEYS):
                    return fetch_news(query, attempt, api_key_index + 1)
                elif attempt <= MAX_RETRIES_ON_RATE_LIMIT:
                    time.sleep(RATE_LIMIT_DELAY * attempt)
                    return fetch_news(query, attempt + 1, 0)
                else:
                    return fetch_serpapi_news(query)
            
            response.raise_for_status()
            data = response.json()
            articles = data.get("articles", []) if data.get("status") == "ok" else []
            
            if not articles:
                articles = fetch_world_news(query) or []
            
            serpapi_articles = fetch_serpapi_news(query) or []
            articles.extend(serpapi_articles)
            
            return articles[:MAX_ARTICLES]
            
        except requests.exceptions.RequestException as e:
            if attempt <= RETRY_ATTEMPTS:
                time.sleep(2 ** attempt)
                return fetch_news(query, attempt + 1, api_key_index)
            logging.error(f"News API error: {str(e)}")
            return fetch_serpapi_news(query) or []
            
    except Exception as e:
        logging.error(f"News fetching error: {str(e)}")
        return fetch_serpapi_news(query) or []

def fetch_google_image(topic):
    """Fetch an image using Google Custom Search API."""
    try:
        params = {
            "key": GOOGLE_API_KEY,
            "cx": GOOGLE_CSE_ID.strip(),  # Ensure no trailing spaces or periods
            "q": topic,
            "searchType": "image",
            "num": 1,  # Fetch only the most relevant image
            "safe": "active"  # Safe search filter
        }
        response = requests.get("https://www.googleapis.com/customsearch/v1", params=params, timeout=TIMEOUT)
        response.raise_for_status()
        data = response.json()
        if data.get('items'):
            return data['items'][0]['link']  # Return the URL of the first image
        return None
    except Exception as e:
        logging.error(f"Google Custom Search API error: {str(e)}")
        return None

def analyze_topic(topic):
    """Analyze topic to determine category and content type."""
    try:
        # Default values
        default_category = "General"
        default_content_type = "article"

        # Use Gemini API for analysis
        prompt = f"""Analyze this topic: "{topic}"
        
        Determine:
        1. Category (choose one): Technology, Business, Science, Entertainment, Sports, Politics, Health, Travel, Education
        2. Content Type (choose one): article, news, analysis, guide, review
        
        Format: Return only category and content type separated by comma (e.g., "Technology,article")"""

        result = generate_with_gemini(topic, [], "", "")
        if not result:
            return default_category, default_content_type

        # Parse result
        parts = result.strip().split(',')
        if len(parts) != 2:
            return default_category, default_content_type

        category, content_type = parts
        category = category.strip()
        content_type = content_type.strip().lower()

        # Validate category
        valid_categories = {
            "Technology", "Business", "Science", "Entertainment", 
            "Sports", "Politics", "Health", "Travel", "Education"
        }
        if category not in valid_categories:
            category = default_category

        # Validate content type
        valid_types = {"article", "news", "analysis", "guide", "review"}
        if content_type not in valid_types:
            content_type = default_content_type

        return category, content_type

    except Exception as e:
        logging.error(f"Error analyzing topic: {str(e)}")
        return "General", "article"

def generate_with_gemini(topic, news_articles, category, content_type):
    try:
        # Configure the Gemini API
        genai.configure(api_key=GEMINI_API_KEY)
        
        # Create a model instance using the latest pro model
        model = genai.GenerativeModel('gemini-1.5-pro-latest')
        
        # Prepare the prompt
        prompt = f'''
        Topic: {topic}
        Category: {category}
        Content Type: {content_type}
        
        News Articles for Reference:
        {news_articles}
        
        Please generate a comprehensive article that:
        1. Has an engaging headline
        2. Provides in-depth analysis
        3. Includes relevant quotes and statistics
        4. Maintains journalistic integrity
        5. Is well-structured with clear sections
        6. Ends with a conclusion
        
        Format the article using markdown with ## for section headers.
        '''
        
        # Generate content
        response = model.generate_content(prompt)
        
        if response and hasattr(response, 'text'):
            return {
                'success': True,
                'content': response.text,
                'error': None
            }
        else:
            raise Exception("No content generated")
            
    except Exception as e:
        logging.error(f"Error in generate_with_gemini: {str(e)}")
        return {
            'success': False,
            'content': None,
            'error': str(e)
        }

def generate_with_deepseek(topic, news_articles, category, content_type):
    """Generate content using DeepSeek API"""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
    }

    news_context = "\n".join([
        f"**Source: {article['source']['name']}**\n"
        f"**Title: {article['title']}**\n"
        f"**Description: {article['description']}**\n"
        f"**Published At: {article['publishedAt']}**\n"
        for article in news_articles
    ])

    payload = {
        "model": "deepseek-chat",
        "messages": [{
            "role": "user",
            "content": (
                f"Write a detailed article about {topic}.\n"
                f"Category: {category}\n"
                f"Content Type: {content_type}\n"
                f"News Context:\n{news_context}\n"
                "Use professional tone and markdown formatting."
            )
        }],
        "stream": False
    }

    try:
        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=TIMEOUT)
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        logging.error(f"DeepSeek content generation failed: {str(e)}")
        return None

def generate_engaging_title(topic, news_articles):
    """Generate an attention-grabbing title using Gemini API"""
    headers = {"Content-Type": "application/json"}
    
    # Extract key information from news articles
    news_context = "\n".join([
        f"Title: {article['title']}\n"
        f"Description: {article['description']}\n"
        for article in news_articles[:3]  # Use top 3 articles for context
    ])

    payload = {
        "contents": [{
            "parts": [{
                "text": (
                    f"Create an attention-grabbing, viral-worthy headline for this topic that will make people want to click and read.\n"
                    f"Topic: {topic}\n"
                    f"News Context:\n{news_context}\n\n"
                    "Requirements:\n"
                    "1. Make it dramatic and engaging but not clickbait\n"
                    "2. Include numbers or specific details if relevant\n"
                    "3. Use powerful words that evoke emotion\n"
                    "4. Keep it under 100 characters\n"
                    "5. Make it sound urgent and important\n"
                    "6. Don't use misleading information\n"
                    "Output format: Just return the headline text only"
                )
            }]
        }],
        "generationConfig": {
            "temperature": 0.8,
            "maxOutputTokens": 100,
            "topP": 0.9
        }
    }

    try:
        response = requests.post(GEMINI_API_URL, headers=headers, json=payload, timeout=TIMEOUT)
        response.raise_for_status()
        title = response.json()['candidates'][0]['content']['parts'][0]['text'].strip()
        return title
    except Exception as e:
        logging.error(f"Failed to generate engaging title: {str(e)}")
        return topic  # Fallback to original topic if generation fails

def store_content_in_firebase(topic, content, category, content_type, image_url):
    """Store generated content in Firebase Firestore."""
    try:
        news_articles = fetch_news(topic)
        engaging_title = generate_engaging_title(topic, news_articles)
        
        sanitized_topic = "".join(c if c.isalnum() or c in " -_" else "_" for c in topic)[:50]
        doc_id = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{sanitized_topic}"
        
        current_time = datetime.now(timezone.utc)
        
        doc_ref = db.collection("generated_content").document(doc_id)
        doc_ref.set({
            "user": "Anonymous",
            "time": current_time.isoformat(),  # Use proper ISO format
            "original_headline": topic,
            "engaging_headline": engaging_title,
            "category": category,
            "content_type": content_type,
            "content": content,
            "image_url": image_url,
            "trending_topics": topic,
            "features": {
                "home": True,
                "breaking_news": True,
                "articles": True,
                "Jobs": False,
                "trending_news": True,
                "categories": True,
                "best_of_week": False,
                "history": False,
                "bookmarks": False
            }
        })
        logging.info(f"Successfully stored content in Firebase for topic: {topic}")
        logging.info(f"Generated engaging headline: {engaging_title}")
        return True
    except Exception as e:
        logging.error(f"Failed to store content in Firebase: {str(e)}")
        return False

def delete_old_related_content(topic):
    """
    Delete existing content if a similar topic is trending again after 24 hours.
    """
    return False  # Disabled content deletion

# Add new constants for API priorities
API_SOURCES = ['news_api', 'world_news', 'serpapi']
HEADLINE_STYLES = [
    "Breaking News: {topic}",
    "Just In: {topic}",
    "Exclusive: {topic}",
    "Latest Update: {topic}",
    "Developing Story: {topic}"
]

def fetch_news_cascade(query):
    """Fetch news using multiple APIs in cascade"""
    all_articles = []
    
    # Try News API first
    try:
        news_api_articles = fetch_news(query)
        if news_api_articles:
            logging.info(f"Successfully fetched {len(news_api_articles)} articles from News API")
            all_articles.extend(news_api_articles)
    except Exception as e:
        logging.warning(f"News API failed: {str(e)}")

    # Try World News API if needed
    if len(all_articles) < MAX_ARTICLES:
        try:
            world_params = {
                "api-key": WORLD_NEWS_API_KEY,
                "text": query,
                "language": "en",
                "number": MAX_ARTICLES - len(all_articles)
            }
            world_response = requests.get(WORLD_NEWS_API_URL, params=world_params, timeout=TIMEOUT)
            if world_response.status_code == 200:
                world_articles = world_response.json().get("news", [])
                logging.info(f"Successfully fetched {len(world_articles)} articles from World News API")
                all_articles.extend([{
                    "source": {"name": article.get("source", {}).get("name", "World News")},
                    "title": article.get("title", ""),
                    "description": article.get("text", "")[:200],
                    "publishedAt": article.get("publish_date", "")
                } for article in world_articles])
        except Exception as e:
            logging.warning(f"World News API failed: {str(e)}")

    # Finally try SerpAPI
    if len(all_articles) < MAX_ARTICLES:
        try:
            serp_articles = fetch_serpapi_news(query)
            if serp_articles:
                logging.info(f"Successfully fetched {len(serp_articles)} articles from SerpAPI")
                all_articles.extend(serp_articles)
        except Exception as e:
            logging.warning(f"SerpAPI failed: {str(e)}")

    return all_articles[:MAX_ARTICLES]

def generate_viral_headline(topic, news_articles):
    """Generate viral-worthy headlines using Gemini API with improved prompting"""
    headers = {"Content-Type": "application/json"}
    
    news_context = "\n".join([
        f"Title: {article['title']}\n"
        f"Description: {article['description']}\n"
        for article in news_articles[:3]
    ])

    payload = {
        "contents": [{
            "parts": [{
                "text": (
                    f"Generate 3 extremely compelling news headlines for this trending topic.\n"
                    f"Topic: {topic}\n"
                    f"News Context:\n{news_context}\n\n"
                    "Requirements:\n"
                    "1. Use news media style (CNN, BBC, Reuters)\n"
                    "2. Include specific numbers, facts or quotes if available\n"
                    "3. Create urgency and importance\n"
                    "4. Maximum 100 characters\n"
                    "5. Must be factual and accurate\n"
                    "6. Use power words like 'Breaking', 'Exclusive', 'Revealed'\n"
                    "7. Make it impossible to ignore\n\n"
                    "Format: Return only the 3 headlines separated by newlines\n"
                )
            }]
        }],
        "generationConfig": {
            "temperature": 0.8,
            "maxOutputTokens": 200,
            "topP": 0.9
        }
    }

    try:
        response = requests.post(GEMINI_API_URL, headers=headers, json=payload, timeout=TIMEOUT)
        response.raise_for_status()
        headlines = response.json()['candidates'][0]['content']['parts'][0]['text'].strip().split('\n')
        # Return the best headline based on length and impact
        return max(headlines, key=lambda x: len(x) if len(x) <= 100 else 0)
    except Exception as e:
        logging.error(f"Failed to generate viral headline: {str(e)}")
        # Fallback to template-based headline
        return random.choice(HEADLINE_STYLES).format(topic=topic)

# Add new constants for better rate limiting and API management
SERPAPI_KEYS = [
    "8896cdea629dcc3663aa3c065c3e06fd3326ea69afe9cbb020dcd45dec439048",
    # Add your additional SerpAPI keys here
]
API_COOLDOWN = 60  # seconds to wait between API calls
FORCE_PROCESS_THRESHOLD = 5  # Process topic if no content generated for this many consecutive topics

# Add this new function for API rate limiting
def with_rate_limit(func):
    """Decorator to implement rate limiting for API calls"""
    last_call_time = {}
    
    def wrapper(*args, **kwargs):
        current_time = time.time()
        if func.__name__ in last_call_time:
            elapsed = current_time - last_call_time[func.__name__]
            if elapsed < API_COOLDOWN:
                time.sleep(API_COOLDOWN - elapsed)
        
        last_call_time[func.__name__] = time.time()
        return func(*args, **kwargs)
    return wrapper

# Add rate limit tracking
rate_limit_tracking = {
    'serpapi': {'last_call': 0, 'calls': 0, 'reset_time': 0}
}

def check_rate_limit(api_name):
    current_time = time.time()
    tracking = rate_limit_tracking[api_name]
    
    # Reset counters if an hour has passed
    if current_time - tracking['reset_time'] > 3600:
        tracking.update({'calls': 0, 'reset_time': current_time})
    
    # Check if we're within limits
    if tracking['calls'] >= 100:  # 100 calls per hour limit
        return False
        
    # Update tracking
    tracking['calls'] += 1
    tracking['last_call'] = current_time
    return True

@with_rate_limit
def fetch_serpapi_news(query, attempt=1, key_index=0):
    """Fetch news articles using Google News SerpAPI with multiple keys"""
    if key_index >= len(SERPAPI_KEYS):
        logging.error("All SerpAPI keys exhausted")
        time.sleep(API_COOLDOWN)
        return fetch_serpapi_news(query, attempt, 0)
        
    try:
        if not check_rate_limit('serpapi'):
            logging.warning("SerpAPI rate limit hit, waiting...")
            time.sleep(API_COOLDOWN)
            return fetch_serpapi_news(query, attempt, key_index)
    except Exception as e:
        logging.error(f"Rate limit check failed: {str(e)}")
        return None

    # Move this block inside the function with proper indentation
    params = {
        "engine": "google_news",
        "q": query,
        "api_key": SERPAPI_KEYS[key_index],
        "num": MAX_ARTICLES
    }
    response = requests.get(SERPAPI_URL, params=params, timeout=TIMEOUT)
    
    if response.status_code == 429:  # Rate limit hit
        logging.warning(f"Rate limit hit for key {key_index}, trying next key")
        time.sleep(2)
        return fetch_serpapi_news(query, attempt, key_index + 1)
            
    response.raise_for_status()
    data = response.json()
    
    articles = []
    for article in data.get("news_results", []):
        articles.append({
            "source": {"name": article.get("source", {}).get("title", "Unknown Source")},
            "title": article.get("title", ""),
            "description": article.get("snippet", ""),
            "publishedAt": article.get("date", "")
        })
    return articles

# Modify main function to be less aggressive with skipping
skipped_count = 0  # Initialize the skipped_count variable globally

async def main():
    """Main execution flow"""
    global skipped_count
    try:
        validate_environment()
        trends = await fetch_trends()
        if not trends:
            logging.warning("No trending topics found")
            return
            
        for idx, topic in enumerate(trends, 1):
            try:
                logging.info(f"Processing {idx}/{len(trends)}: {topic}")
                
                if topic.lower() in ["today", "now", "news"]:
                    continue

                force_process = skipped_count >= FORCE_PROCESS_THRESHOLD
                
                if not force_process and is_topic_recent(topic):
                    logging.info(f"Skipping recent topic: {topic}")
                    skipped_count += 1
                    continue

                if not force_process and check_existing_content(topic):
                    logging.info(f"Content exists for topic: {topic}")
                    skipped_count += 1
                    continue

                # Reset skip counter when we process a topic
                skipped_count = 0
                
                # Use cascading news fetch with rate limiting
                news_articles = fetch_news_cascade(topic)
                if not news_articles:
                    logging.warning(f"No news found for topic: {topic}")
                    continue

                # Get category and content type
                category_result = analyze_topic(topic)
                if not category_result:
                    logging.warning(f"Failed to analyze topic: {topic}")
                    continue
                
                category, content_type = category_result
                
                # Generate content with Gemini
                gemini_result = generate_with_gemini(topic, news_articles, category, content_type)
                
                if gemini_result['success'] and gemini_result['content']:
                    # Get image and store content
                    image_url = fetch_google_image(topic)
                    store_content_in_firebase(
                        topic, 
                        gemini_result['content'],
                        category,
                        content_type,
                        image_url
                    )
                    logging.info(f"Successfully generated content for topic: {topic}")
                else:
                    # If Gemini fails, try DeepSeek
                    logging.warning(f"Gemini failed ({gemini_result.get('error')}). Trying DeepSeek...")
                    content = generate_with_deepseek(topic, news_articles, category, content_type)
                    
                    if content:
                        image_url = fetch_google_image(topic)
                        store_content_in_firebase(
                            topic,
                            content,
                            category,
                            content_type,
                            image_url
                        )
                        logging.info(f"Successfully generated content with DeepSeek for topic: {topic}")
                    else:
                        logging.error(f"Failed to generate content for topic: {topic}")
                
                time.sleep(1.5)
            
            except Exception as e:
                logging.error(f"Error processing topic {topic}: {str(e)}")
                skipped_count += 1
                continue

    except Exception as e:
        logging.error(f"Critical failure: {str(e)}")
        raise

# Add new constants for region cycling
REGION_CYCLE = [
    'india',
    'united_states',
    'united_kingdom',
    'canada',
    'australia',
    'germany',
    'france',
    'japan',
    'brazil',
    'china',
    'singapore'
]
current_region_index = 0

# Add function to manage region rotation
def get_next_region():
    """Get the next region in the cycle"""
    global current_region_index
    region = REGION_CYCLE[current_region_index]
    current_region_index = (current_region_index + 1) % len(REGION_CYCLE)
    return region

# Modify job function to handle async main
async def job():
    """Job to be run every 30 minutes with rotating regions"""
    try:
        global REGION
        REGION = get_next_region()
        logging.info(f"Starting content generation for region: {REGION}")
        await main()
        logging.info(f"Completed content generation cycle for {REGION}")
    except Exception as e:
        logging.error(f"Error in scheduled job for {REGION}: {str(e)}")

def run_job():
    """Wrapper to run the async job in the event loop"""
    asyncio.run(job())

# Update the main scheduling section
if __name__ == "__main__":
    if os.getenv('VERCEL_ENV'):
        # Running on Vercel
        app.debug = False
    else:
        # Running locally
        serve(app, host='0.0.0.0', port=5000)
        
    # Start the content generation service
    try:
        run_job()
    except Exception as e:
        logging.error(f"Failed to start content generation: {str(e)}")

# Add more SERPAPI keys and adjust rate limiting
SERPAPI_KEYS = [
    "8896cdea629dcc3663aa3c065c3e06fd3326ea69afe9cbb020dcd45dec439048",
    # Add your additional SerpAPI keys here if available
]
SERPAPI_RATE_LIMIT = {
    'calls_per_key': 100,  # Maximum calls per key per hour
    'window_seconds': 3600,  # 1 hour window
    'min_delay': 2,  # Minimum delay between calls
    'backoff_factor': 1.5,  # Exponential backoff factor
    'max_retries': 3  # Maximum number of retries per request
}

# Add key usage tracking
serpapi_usage = {key: {'calls': 0, 'last_reset': time.time(), 'last_call': 0} for key in SERPAPI_KEYS}

def get_available_serpapi_key():
    """Get the next available SERPAPI key with capacity"""
    current_time = time.time()
    
    for key in SERPAPI_KEYS:
        # Reset usage counter if window has passed
        if current_time - serpapi_usage[key]['last_reset'] > SERPAPI_RATE_LIMIT['window_seconds']:
            serpapi_usage[key] = {'calls': 0, 'last_reset': current_time, 'last_call': 0}
        
        # Check if key has remaining capacity
        if serpapi_usage[key]['calls'] < SERPAPI_RATE_LIMIT['calls_per_key']:
            # Ensure minimum delay between calls
            time_since_last_call = current_time - serpapi_usage[key]['last_call']
            if time_since_last_call < SERPAPI_RATE_LIMIT['min_delay']:
                time.sleep(SERPAPI_RATE_LIMIT['min_delay'] - time_since_last_call)
            
            return key
    
    return None

def update_serpapi_usage(key):
    """Update usage tracking for a SERPAPI key"""
    current_time = time.time()
    serpapi_usage[key]['calls'] += 1
    serpapi_usage[key]['last_call'] = current_time

# Modified fetch_serpapi_news function with better rate limiting
def fetch_serpapi_news(query, attempt=1):
    """Fetch news articles using Google News SerpAPI with improved rate limiting"""
    key = get_available_serpapi_key()
    if not key:
        logging.warning("All SerpAPI keys exhausted, falling back to alternative news source")
        return fetch_alternative_news(query)
    
    try:
        params = {
            "engine": "google_news",
            "q": query,
            "api_key": key,
            "num": MAX_ARTICLES
        }
        
        response = requests.get(SERPAPI_URL, params=params, timeout=TIMEOUT)
        
        if response.status_code == 429:  # Rate limit hit
            logging.warning(f"Rate limit hit for key: {key[:8]}...")
            if attempt <= SERPAPI_RATE_LIMIT['max_retries']:
                wait_time = SERPAPI_RATE_LIMIT['min_delay'] * (SERPAPI_RATE_LIMIT['backoff_factor'] ** attempt)
                time.sleep(wait_time)
                return fetch_serpapi_news(query, attempt + 1)
            return fetch_alternative_news(query)
            
        response.raise_for_status()
        update_serpapi_usage(key)
        
        data = response.json()
        articles = []
        for article in data.get("news_results", []):
            articles.append({
                "source": {"name": article.get("source", {}).get("title", "Unknown Source")},
                "title": article.get("title", ""),
                "description": article.get("snippet", ""),
                "publishedAt": article.get("date", "")
            })
        return articles
        
    except Exception as e:
        logging.error(f"SerpAPI request failed: {str(e)}")
        return fetch_alternative_news(query)

def fetch_alternative_news(query):
    """Fallback method when SerpAPI is unavailable"""
    try:
        # Try World News API first
        world_news = fetch_world_news(query)
        if world_news:
            return world_news
            
        # If World News fails, try regular News API
        return fetch_news(query)
    except Exception as e:
        logging.error(f"Alternative news sources failed: {str(e)}")
        return []

# Modify fetch_news_cascade to handle SerpAPI unavailability
def fetch_news_cascade(query):
    """Fetch news using multiple APIs in cascade with improved fallback"""
    all_articles = []
    
    # Try News API first
    news_api_articles = fetch_news(query)
    if news_api_articles:
        all_articles.extend(news_api_articles)
    
    # Only try SerpAPI if we need more articles
    if len(all_articles) < MAX_ARTICLES:
        serp_articles = fetch_serpapi_news(query)
        if serp_articles:
            all_articles.extend(serp_articles)
    
    # Finally try World News API if needed
    if len(all_articles) < MAX_ARTICLES:
        world_articles = fetch_world_news(query)
        if world_articles:
            all_articles.extend(world_articles)
    
    return all_articles[:MAX_ARTICLES]

@app.route('/api/articles', methods=['GET'])
def get_articles():
    category = request.args.get('category', '')

    try:
        # Query Firestore for articles in the specified category
        articles_ref = db.collection("articles")
        query = articles_ref.where("categoryName", "==", category.lower())
        docs = query.get()

        articles = []
        for doc in docs:
            data = doc.to_dict()
            articles.append({
                'id': doc.id,
                'title': data.get('title', ''),
                'excerpt': data.get('content', data.get('excerpt', ''))[:200] + '...' if data.get('content') or data.get('excerpt') else '',
                'category': data.get('categoryName', data.get('categoryId', '')),
                'timestamp': data.get('createdAt', data.get('updatedAt', ''))
            })

        return jsonify({'articles': articles})
    except Exception as e:
        print(f"Error fetching articles: {str(e)}")
        return jsonify({'articles': []})

@app.route('/api/generate', methods=['POST'])
async def generate_test_content():
    try:
        data = request.get_json()
        topic = data.get('topic', 'technology')
        
        # Initialize Gemini
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-pro')
        
        # Create a prompt
        prompt = f"""Write a comprehensive article about {topic}. 
        Include latest trends, analysis, and insights.
        Format the content in markdown.
        Make it engaging and informative."""
        
        # Generate content
        response = model.generate_content(prompt)
        
        return jsonify({
            "success": True,
            "content": response.text,
            "topic": topic
        })
    except Exception as e:
        logging.error(f"Error generating content: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/test', methods=['GET'])
def test_endpoint():
    return jsonify({"status": "ok", "message": "Server is running"})

if __name__ == "__main__":
    print("🚀 Starting OmniSphere Python Backend...")
    print("📊 Server will run on http://localhost:5000")
    print("🔥 Firebase project: omnisphere-db8a7")
    print("⚡ Ready to generate content!")

    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)