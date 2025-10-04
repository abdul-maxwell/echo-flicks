import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ContentCard from "@/components/ContentCard";
import { getFavorites, FavoriteItem } from "@/lib/storage";
import { Movie } from "@/lib/tmdb";
import { Heart } from "lucide-react";

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="h-8 w-8 text-primary fill-current" />
            <h1 className="text-3xl md:text-4xl font-bold">My Favorites</h1>
          </div>
          
          {favorites.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
              <p className="text-muted-foreground">
                Start adding your favorite movies and TV shows!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {favorites.map((item) => {
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

export default Favorites;
