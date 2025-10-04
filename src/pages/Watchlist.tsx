import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ContentCard from "@/components/ContentCard";
import { getWatchlist, WatchlistItem } from "@/lib/storage";
import { Movie } from "@/lib/tmdb";
import { Bookmark } from "lucide-react";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    setWatchlist(getWatchlist());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Bookmark className="h-8 w-8 text-primary fill-current" />
            <h1 className="text-3xl md:text-4xl font-bold">My Watchlist</h1>
          </div>
          
          {watchlist.length === 0 ? (
            <div className="text-center py-20">
              <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
              <p className="text-muted-foreground">
                Add movies and TV shows you want to watch later!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {watchlist.map((item) => {
                const movie: Movie = {
                  id: item.id,
                  title: item.title,
                  poster_path: item.posterPath,
                  backdrop_path: null,
                  overview: "",
                  vote_average: 0,
                  genre_ids: [],
                  media_type: item.mediaType,
                };
                return (
                  <ContentCard
                    key={`${item.id}-${item.mediaType}`}
                    item={movie}
                    mediaType={item.mediaType}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Watchlist;
