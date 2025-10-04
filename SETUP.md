# StreamFlix Setup Guide

## Getting Started with TMDB API

Your streaming app is ready! To make it fully functional, you need to add your TMDB API key.

### Step 1: Get Your TMDB API Key

1. Go to [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create a free account or sign in
3. Go to Settings → API
4. Request an API key (choose "Developer" option)
5. Fill out the form (you can use "Personal" for the application type)
6. Copy your API key (v3 auth)

### Step 2: Add Your API Key

1. Open `src/lib/tmdb.ts`
2. Replace `"YOUR_TMDB_API_KEY"` with your actual API key:

```typescript
const TMDB_API_KEY = "your_actual_api_key_here";
```

### Step 3: Test Your App

Once you've added your API key, the app will be able to:
- Browse trending movies and TV shows
- Search for content
- View detailed information
- Add to favorites and watchlist
- Track watch progress (saved locally)

## Features Implemented

✅ **Browse Content**
- Home page with trending, popular, and top-rated content
- Separate pages for Movies and TV Shows
- Search functionality

✅ **Detail Pages**
- Full movie/TV show information
- Cast and crew
- Trailers (embedded YouTube player)
- Similar content recommendations

✅ **User Features (No Account Required)**
- Add to Favorites
- Add to Watchlist
- Continue Watching (progress tracking)
- All data stored in browser's localStorage

✅ **Video Player**
- Custom video player interface
- Progress tracking
- Keyboard shortcuts (Space/K = play/pause, M = mute, F = fullscreen)

✅ **Responsive Design**
- Mobile, tablet, and desktop optimized
- Touch-friendly controls
- Modern Netflix/Showmax-inspired UI

## Important Note About Streaming

TMDB is a **metadata API** - it provides information about movies and TV shows but **not the actual video streams**.

For the demo, the app plays **trailers** from YouTube. To implement actual movie/TV show streaming, you would need to:

1. Partner with content providers or licensing companies
2. Use a video streaming service (like Cloudflare Stream, Mux, etc.)
3. Integrate with legal streaming sources
4. Implement proper DRM and content protection

The current implementation shows how the UI and user experience would work!

## Technologies Used

- **React** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **TanStack Query** for data fetching
- **React Router** for navigation
- **Outfit Font** (similar to Futura PT)

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── ContentCard.tsx
│   ├── ContentRow.tsx
│   └── VideoPlayer.tsx
├── pages/              # Page components
│   ├── Index.tsx
│   ├── Movies.tsx
│   ├── TVShows.tsx
│   ├── MovieDetail.tsx
│   ├── TVDetail.tsx
│   ├── Favorites.tsx
│   ├── Watchlist.tsx
│   └── Search.tsx
├── lib/                # Utilities and helpers
│   ├── tmdb.ts        # TMDB API configuration
│   └── storage.ts     # localStorage helpers
└── index.css          # Design system & global styles
```

## Next Steps

1. Add your TMDB API key
2. Customize the design further
3. Add more features (ratings, reviews, etc.)
4. Consider backend integration for user accounts
5. Implement actual video streaming sources

Enjoy your streaming app! 🎬🍿
