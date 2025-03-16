from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import firebase_admin
from firebase_admin import credentials, firestore
import logging

# Initialize Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase-credentials.json")
    firebase_admin.initialize_app(cred)
db = firestore.client()

def get_articles(limit=10):
    try:
        # Query Firestore for articles
        articles_ref = db.collection('generated_content')
        query = articles_ref.order_by('time', direction=firestore.Query.DESCENDING).limit(limit)
        docs = query.get()
        
        articles = []
        for doc in docs:
            data = doc.to_dict()
            articles.append({
                'id': doc.id,
                'title': data.get('original_headline', ''),
                'content': data.get('content', ''),
                'category': data.get('category', ''),
                'image_url': data.get('image_url', ''),
                'time': data.get('time', ''),
                'user': data.get('user', 'Anonymous'),
                'features': data.get('features', {})
            })
            
        return {"articles": articles}
        
    except Exception as e:
        return {"error": str(e)}

def handler(event, context):
    """Vercel serverless function handler"""
    try:
        # Get limit from query parameters if provided
        limit = 10
        if event.get('queryStringParameters'):
            limit = int(event['queryStringParameters'].get('limit', 10))
            
        result = get_articles(limit)
        
        return {
            "statusCode": 200,
            "body": json.dumps(result),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET, OPTIONS"
            }
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        } 