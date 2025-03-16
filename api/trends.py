from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from datetime import datetime, timedelta, timezone
import os
import firebase_admin
from firebase_admin import credentials, firestore
import logging
from pytrends.request import TrendReq
import asyncio
import aiohttp

# Initialize Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase-credentials.json")
    firebase_admin.initialize_app(cred)
db = firestore.client()

async def fetch_trends():
    """Fetch actual trending news headlines from multiple categories"""
    try:
        # Try Google Trends first
        pytrends = TrendReq()
        trending_searches = await asyncio.to_thread(pytrends.trending_searches, pn='US')
        
        if not trending_searches.empty:
            trends = trending_searches.tolist()
            return {"trends": trends[:10]}  # Return top 10 trends
            
        return {"trends": [], "error": "No trends found"}
        
    except Exception as e:
        return {"error": str(e)}

def handler(event, context):
    """Vercel serverless function handler"""
    try:
        # Run the async function
        trends = asyncio.run(fetch_trends())
        
        return {
            "statusCode": 200,
            "body": json.dumps(trends),
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