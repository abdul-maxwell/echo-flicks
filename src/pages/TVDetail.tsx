import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { MovieDetails, tmdbApi, getImageUrl, TMDB_IMAGE_SIZES, Episode } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { Play, Plus, Heart, Star } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import {
  addToFavorites,
  removeFromFavorites,
  isInFavorites,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
} from "@/lib/storage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TVDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [playing, setPlaying] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  const { data: show, isLoading } = useQuery({
    queryKey: ["tv", id],
    queryFn: async () => {
      const response = await fetch(tmdbApi.getDetails("tv", parseInt(id!)));
      return (await response.json()) as MovieDetails;
    },
    enabled: !!id,
  });

  const { data: seasonData } = useQuery({
    queryKey: ["season", id, selectedSeason],
    queryFn: async () => {
      const response = await fetch(tmdbApi.getSeasonDetails(parseInt(id!), selectedSeason));
      const data = await response.json();
      return data as { episodes: Episode[] };
    },
    enabled: !!id && !!selectedSeason,
  });

  useEffect(() => {
    if (show) {
      setIsFavorite(isInFavorites(show.id, "tv"));
      setInWatchlist(isInWatchlist(show.id, "tv"));
    }
  }, [show]);

  const handleToggleFavorite = () => {
    if (!show) return;
    if (isFavorite) {
      removeFromFavorites(show.id, "tv");
    } else {
      addToFavorites({
        id: show.id,
        mediaType: "tv",
        title: show.name || "",
        posterPath: show.poster_path,
        addedAt: new Date(),
      });
    }
    setIsFavorite(!isFavorite);
  };

  const handleToggleWatchlist = () => {
    if (!show) return;
    if (inWatchlist) {
      removeFromWatchlist(show.id, "tv");
    } else {
      addToWatchlist({
        id: show.id,
        mediaType: "tv",
        title: show.name || "",
        posterPath: show.poster_path,
        addedAt: new Date(),
      });
    }
    setInWatchlist(!inWatchlist);
  };

  if (isLoading || !show) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 animate-pulse">
          <div className="h-[70vh] bg-card" />
        </div>
      </div>
    );
  }

  const trailer = show.videos?.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  if (playing && trailer) {
    return (
      <VideoPlayer
        title={`${show.name} - S${selectedSeason}E${selectedEpisode}`}
        videoId={trailer.key}
        mediaType="tv"
        itemId={show.id.toString()}
        seasonNumber={selectedSeason}
        episodeNumber={selectedEpisode}
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
              src={getImageUrl(show.backdrop_path, TMDB_IMAGE_SIZES.backdrop.original)}
              alt={show.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
          </div>

          <div className="relative h-full flex items-end px-4 md:px-8 lg:px-16 pb-12">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{show.name}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm md:text-base">
                {show.vote_average > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{show.vote_average.toFixed(1)}</span>
                  </div>
                )}
                {show.first_air_date && (
                  <span className="text-muted-foreground font-medium">
                    {new Date(show.first_air_date).getFullYear()}
                  </span>
                )}
                {show.number_of_seasons && (
                  <span className="text-muted-foreground">
                    {show.number_of_seasons} Season{show.number_of_seasons > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {show.genres && show.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {show.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-secondary rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {show.overview && (
                <p className="text-base md:text-lg mb-8 line-clamp-3 text-foreground/90">
                  {show.overview}
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

        {/* Episodes */}
        {show.seasons && show.seasons.length > 0 && (
          <div className="py-8 px-4 md:px-8 lg:px-16">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold">Episodes</h2>
              <Select
                value={selectedSeason.toString()}
                onValueChange={(value) => {
                  setSelectedSeason(parseInt(value));
                  setSelectedEpisode(1);
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  {show.seasons
                    .filter((s) => s.season_number > 0)
                    .map((season) => (
                      <SelectItem key={season.id} value={season.season_number.toString()}>
                        Season {season.season_number}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {seasonData?.episodes?.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => {
                    setSelectedEpisode(episode.episode_number);
                    setPlaying(true);
                  }}
                  className="flex gap-4 p-4 bg-card rounded-lg hover:bg-secondary transition-colors text-left"
                >
                  <div className="w-40 flex-shrink-0 aspect-video rounded overflow-hidden bg-muted">
                    {episode.still_path && (
                      <img
                        src={getImageUrl(episode.still_path, TMDB_IMAGE_SIZES.backdrop.small)}
                        alt={episode.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">
                        Episode {episode.episode_number}
                      </span>
                      {episode.runtime && (
                        <span className="text-sm text-muted-foreground">• {episode.runtime}m</span>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{episode.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {episode.overview}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cast */}
        {show.credits?.cast && show.credits.cast.length > 0 && (
          <div className="py-8 px-4 md:px-8 lg:px-16">
            <h2 className="text-2xl font-bold mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              {show.credits.cast.slice(0, 10).map((actor) => (
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
      </main>
    </div>
  );
};

export default TVDetail;
