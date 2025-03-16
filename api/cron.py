import json
import firebase_admin
from firebase_admin import credentials, firestore
import google.generativeai as genai
import os
from datetime import datetime, timezone
import asyncio
import aiohttp
from pytrends.request import TrendReq
import requests
from bs4 import BeautifulSoup
from fuzzywuzzy import fuzz

# Initialize Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase-credentials.json")
    firebase_admin.initialize_app(cred)
db = firestore.client()

# Initialize Gemini
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Configuration
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
WORLD_NEWS_API_KEY = os.getenv("WORLD_NEWS_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_CSE_ID = os.getenv("GOOGLE_CSE_ID")
MAX_TRENDS = 20
MAX_ARTICLES = 20
SIMILARITY_THRESHOLD = 80

async def fetch_news(query, limit=5):
    """Fetch news articles from multiple sources"""
    try:
        # Try News API first
        params = {
            "apiKey": NEWS_API_KEY,
            "q": query,
            "language": "en",
            "pageSize": limit
        }
        response = requests.get("https://newsapi.org/v2/everything", params=params)
        response.raise_for_status()
        articles = response.json().get("articles", [])
        
        if articles:
            return articles[:limit]
            
        # Fallback to World News API
        params = {
            "api-key": WORLD_NEWS_API_KEY,
            "text": query,
            "language": "en",
            "number": limit
        }
        response = requests.get("https://api.worldnewsapi.com/search-news", params=params)
        response.raise_for_status()
        articles = response.json().get("news", [])
        
        return articles[:limit]
        
    except Exception as e:
        print(f"Error fetching news: {str(e)}")
        return []

async def generate_content(topic):
    try:
        # First fetch related news
        news_articles = await fetch_news(topic)
        
        # Generate content using Gemini
        model = genai.GenerativeModel('gemini-1.5-pro-latest')
        prompt = f"""Generate a comprehensive news article about: {topic}
        
        Use this context from recent news:
        {json.dumps([{'title': article.get('title', ''), 'description': article.get('description', '')} for article in news_articles])}
        
        Include:
        1. A catchy headline
        2. Detailed analysis
        3. Key points and implications
        4. Expert perspectives
        5. Related news and developments
        Make it engaging and informative."""
        
        response = await asyncio.to_thread(model.generate_content, prompt)
        content = response.text
        
        # Store in Firebase
        doc_ref = db.collection('generated_content').document()
        doc_ref.set({
            'original_headline': topic,
            'content': content,
            'time': datetime.now(timezone.utc).isoformat(),
            'features': {
                'trending': True,
                'home': True,
                'articles': True
            },
            'category': 'General',
            'image_url': news_articles[0].get('urlToImage', '') if news_articles else '',
            'user': 'AI Content Generator'
        })
        
        return True
    except Exception as e:
        print(f"Error generating content for {topic}: {str(e)}")
        return False

async def process_trends():
    try:
        # Fetch trends
        pytrends = TrendReq()
        trending_searches = await asyncio.to_thread(pytrends.trending_searches, pn='US')
        
        if not trending_searches.empty:
            trends = trending_searches.tolist()[:5]  # Process top 5 trends
            
            # Generate content for each trend
            for trend in trends:
                # Check if similar content already exists
                existing_docs = db.collection('generated_content').where('original_headline', '==', trend).limit(1).get()
                if not existing_docs:
                    await generate_content(trend)
                
            return {"success": True, "processed": len(trends)}
    except Exception as e:
        return {"error": str(e)}

def handler(event, context):
    """Vercel serverless function handler for cron job"""
    try:
        # Verify cron secret if needed
        if event.get('headers', {}).get('authorization') != f"Bearer {os.getenv('CRON_SECRET')}":
            return {
                "statusCode": 401,
                "body": json.dumps({"error": "Unauthorized"}),
                "headers": {"Content-Type": "application/json"}
            }
            
        # Run the async function
        result = asyncio.run(process_trends())
        
        return {
            "statusCode": 200,
            "body": json.dumps(result),
            "headers": {"Content-Type": "application/json"}
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {"Content-Type": "application/json"}
        } 