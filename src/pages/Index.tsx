import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ContentRow from "@/components/ContentRow";
import { tmdbApi } from "@/lib/tmdb";
import { getWatchProgress } from "@/lib/storage";
import { useEffect, useState } from "react";
import ContentCard from "@/components/ContentCard";
import { Movie } from "@/lib/tmdb";

const Index = () => {
  const [continueWatching, setContinueWatching] = useState<any[]>([]);

  useEffect(() => {
    const progress = getWatchProgress();
    setContinueWatching(progress.slice(0, 10));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <Hero fetchUrl={tmdbApi.getTrending("movie", "day")} mediaType="movie" />

        {/* Content Rows */}
        <div className="py-8 space-y-8">
          {continueWatching.length > 0 && (
            <div className="mb-8 animate-fade-in">
              <h2 className="text-xl md:text-2xl font-bold mb-4 px-4">
                Continue Watching
              </h2>
              <div className="flex gap-3 px-4 overflow-x-auto hide-scrollbar">
                {continueWatching.map((item) => {
                  const movie: Movie = {
                    id: parseInt(item.id),
                    title: item.title,
                    poster_path: item.posterPath,
                    backdrop_path: null,
                    overview: "",
                    vote_average: 0,
                    genre_ids: [],
                    media_type: item.mediaType,
                  };
                  return (
                    <div key={`${item.id}-${item.seasonNumber}-${item.episodeNumber}`} className="w-40 md:w-48 flex-shrink-0 relative">
                      <ContentCard item={movie} mediaType={item.mediaType} />
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(item.timestamp / item.duration) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <ContentRow
            title="Trending Movies"
            fetchUrl={tmdbApi.getTrending("movie", "day")}
            mediaType="movie"
          />
          
          <ContentRow
            title="Popular Movies"
            fetchUrl={tmdbApi.getPopular("movie")}
            mediaType="movie"
          />
          
          <ContentRow
            title="Top Rated Movies"
            fetchUrl={tmdbApi.getTopRated("movie")}
            mediaType="movie"
          />
          
          <ContentRow
            title="Trending TV Shows"
            fetchUrl={tmdbApi.getTrending("tv", "day")}
            mediaType="tv"
          />
          
          <ContentRow
            title="Popular TV Shows"
            fetchUrl={tmdbApi.getPopular("tv")}
            mediaType="tv"
          />
          
          <ContentRow
            title="Top Rated TV Shows"
            fetchUrl={tmdbApi.getTopRated("tv")}
            mediaType="tv"
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
