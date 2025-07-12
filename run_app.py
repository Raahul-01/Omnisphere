#!/usr/bin/env python3
"""
Simple runner for app.py to help debug issues
"""

import sys
import os

print("🚀 Starting OmniSphere Backend...")
print("📁 Current directory:", os.getcwd())
print("🐍 Python version:", sys.version)

try:
    print("📦 Loading environment variables...")
    from dotenv import load_dotenv
    load_dotenv()
    print("✅ Environment variables loaded")
    
    print("🔥 Importing Firebase...")
    import firebase_admin
    from firebase_admin import credentials, firestore
    print("✅ Firebase imported")
    
    print("🌐 Importing Flask...")
    from flask import Flask
    from flask_cors import CORS
    print("✅ Flask imported")
    
    print("📊 Initializing Firebase...")
    cred = credentials.Certificate("firebase-credentials.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("✅ Firebase initialized")
    
    print("📱 Importing main app...")
    # Import the app module
    import app
    print("✅ App module imported successfully")
    
    print("🎯 Starting Flask server...")
    print("🌐 Server will be available at: http://localhost:5000")
    print("📊 Health check: http://localhost:5000/api/health")
    print("🔧 Test endpoint: http://localhost:5000/test")
    
    # Run the app
    if hasattr(app, 'app'):
        app.app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        print("❌ No Flask app found in app module")
        
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("💡 Make sure all dependencies are installed:")
    print("   pip install -r requirements.txt")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print(f"📍 Error type: {type(e).__name__}")
    import traceback
    print("📋 Full traceback:")
    traceback.print_exc()
