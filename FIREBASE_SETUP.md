# Firebase Setup Guide for OmniSphere

This guide will help you connect your OmniSphere application to Firebase and resolve the database fetching issues.

## 🔥 Issues Fixed

✅ **CSS Styling** - Tailwind CSS is now properly compiled and working  
✅ **Firebase Configuration** - Real Firebase SDK instead of mock implementation  
✅ **Firestore Rules** - Updated to allow access to articles and posts  
✅ **API Routes** - Now fetch real data from Firebase instead of mock data  

## 📋 Prerequisites

1. **Firebase Account**: Create a free account at [Firebase Console](https://console.firebase.google.com)
2. **Node.js**: Version 16 or higher

## 🚀 Setup Instructions

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "omnisphere-news")
4. Disable Google Analytics (optional for this setup)
5. Click "Create project"

### Step 2: Set up Firestore Database

1. In your Firebase project, go to **Firestore Database**
2. Click "Create database"
3. Start in **Test mode** (we'll apply custom rules later)
4. Choose a region close to your users
5. Click "Done"

### Step 3: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click **Web app** icon (`</>`)
4. Register your app with a nickname (e.g., "OmniSphere Web")
5. Copy the Firebase configuration object

### Step 4: Configure Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values with your Firebase config:

```env
# Firebase Configuration - Replace with your actual values
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com  
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-actual-app-id
```

### Step 5: Apply Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** → **Rules**
2. Replace the existing rules with the content from `firestore.rules` in your project
3. Click **Publish**

The rules allow:
- ✅ Public read access to articles and posts  
- ✅ Public read access to categories and trends
- ✅ Authenticated write access with rate limiting
- ✅ Admin-only delete permissions

### Step 6: Seed Sample Data (Optional)

To populate your database with sample articles:

```bash
npm run seed
```

This will add 4 sample articles to both `articles` and `posts` collections.

### Step 7: Test the Application

1. Build and start your application:
```bash
npm run build
npm start
```

2. Visit `http://localhost:3000`
3. Check the browser console for any Firebase connection issues
4. Verify articles are loading from Firebase (not just mock data)

## 🔍 Troubleshooting

### Issue: "Firebase not connecting"
- ✅ Check your `.env.local` has correct Firebase credentials
- ✅ Ensure Firestore is enabled in Firebase Console
- ✅ Verify your Firebase project is active

### Issue: "Permission denied" errors
- ✅ Apply the `firestore.rules` from your project to Firebase Console
- ✅ Make sure rules are published (not just saved as draft)

### Issue: "No articles showing"
- ✅ Run `npm run seed` to add sample data
- ✅ Check Firestore Console to verify data exists
- ✅ Check browser network tab for API call errors

### Issue: "Module not found" errors
- ✅ Run `npm install` to ensure Firebase SDK is installed
- ✅ Restart your development server after installing

## 📊 Database Structure

Your Firestore database will have these collections:

```
📁 articles/
  📄 {articleId}
    - title: string
    - content: string  
    - author: object
    - category: string
    - createdAt: timestamp
    - published: boolean

📁 posts/
  📄 {postId}  
    - (same structure as articles)

📁 categories/
  📄 {categoryId}
    - name: string
    - description: string
```

## 🔧 API Endpoints

- `GET /api/posts` - Fetches articles from Firebase
- `GET /api/posts?limit=10` - Fetches limited number of articles

## 🎯 Next Steps

1. **Add Authentication**: Implement user login/signup
2. **Admin Panel**: Create interface for managing articles  
3. **Real-time Updates**: Add live article updates
4. **Search Functionality**: Implement article search
5. **Comments System**: Add user comments on articles

## 📞 Support

If you're still experiencing issues:

1. Check the browser console for error messages
2. Verify your Firebase project settings
3. Ensure your `.env.local` file is not committed to git
4. Make sure Firestore rules are properly applied

---

**Status**: ✅ Firebase integration is now ready!
Your OmniSphere application can now fetch real articles from Firebase Firestore.