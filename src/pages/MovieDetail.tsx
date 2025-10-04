import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { MovieDetails, tmdbApi, getImageUrl, TMDB_IMAGE_SIZES } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { Play, Plus, Heart, Star, Clock } from "lucide-react";
import ContentRow from "@/components/ContentRow";
import VideoPlayer from "@/components/VideoPlayer";
import {
  addToFavorites,
  removeFromFavorites,
  isInFavorites,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
} from "@/lib/storage";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [playing, setPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const response = await fetch(tmdbApi.getDetails("movie", parseInt(id!)));
      return (await response.json()) as MovieDetails;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (movie) {
      setIsFavorite(isInFavorites(movie.id, "movie"));
      setInWatchlist(isInWatchlist(movie.id, "movie"));
    }
  }, [movie]);

  const handleToggleFavorite = () => {
    if (!movie) return;
    if (isFavorite) {
      removeFromFavorites(movie.id, "movie");
    } else {
      addToFavorites({
        id: movie.id,
        mediaType: "movie",
        title: movie.title,
        posterPath: movie.poster_path,
        addedAt: new Date(),
      });
    }
    setIsFavorite(!isFavorite);
  };

  const handleToggleWatchlist = () => {
    if (!movie) return;
    if (inWatchlist) {
      removeFromWatchlist(movie.id, "movie");
    } else {
      addToWatchlist({
        id: movie.id,
        mediaType: "movie",
        title: movie.title,
        posterPath: movie.poster_path,
        addedAt: new Date(),
      });
    }
    setInWatchlist(!inWatchlist);
  };

  if (isLoading || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 animate-pulse">
          <div className="h-[70vh] bg-card" />
        </div>
      </div>
    );
  }

  const trailer = movie.videos?.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "";

  if (playing && trailer) {
    return (
      <VideoPlayer
        title={movie.title}
        videoId={trailer.key}
        mediaType="movie"
        itemId={movie.id.toString()}
        onClose={() => setPlaying(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={getImageUrl(movie.backdrop_path, TMDB_IMAGE_SIZES.backdrop.original)}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
          </div>

          <div className="relative h-full flex items-end px-4 md:px-8 lg:px-16 pb-12">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm md:text-base">
                {movie.vote_average > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                  </div>
                )}
                {movie.release_date && (
                  <span className="text-muted-foreground font-medium">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                )}
                {runtime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{runtime}</span>
                  </div>
                )}
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-secondary rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {movie.overview && (
                <p className="text-base md:text-lg mb-8 line-clamp-3 text-foreground/90">
                  {movie.overview}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="gap-2 font-semibold"
                  onClick={() => setPlaying(true)}
                >
                  <Play className="h-5 w-5 fill-current" />
                  Watch Now
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2"
                  onClick={handleToggleFavorite}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2"
                  onClick={handleToggleWatchlist}
                >
                  <Plus className="h-5 w-5" />
                  {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Cast */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <div className="py-8 px-4 md:px-8 lg:px-16">
            <h2 className="text-2xl font-bold mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              {movie.credits.cast.slice(0, 10).map((actor) => (
                <div key={actor.id} className="flex-shrink-0 w-32 text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-card mb-2">
                    <img
                      src={getImageUrl(actor.profile_path, TMDB_IMAGE_SIZES.profile.medium)}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <p className="font-semibold text-sm truncate">{actor.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {movie.similar?.results && movie.similar.results.length > 0 && (
          <div className="py-8">
            <ContentRow
              title="More Like This"
              fetchUrl={tmdbApi.getDetails("movie", movie.id)}
              mediaType="movie"
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default MovieDetail;
