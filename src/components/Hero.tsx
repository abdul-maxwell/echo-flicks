import { useQuery } from "@tanstack/react-query";
import { Play, Info, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Movie, getImageUrl, TMDB_IMAGE_SIZES } from "@/lib/tmdb";
import { Button } from "./ui/button";

interface HeroProps {
  fetchUrl: string;
  mediaType?: "movie" | "tv";
}

const Hero = ({ fetchUrl, mediaType = "movie" }: HeroProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["hero", fetchUrl],
    queryFn: async () => {
      const response = await fetch(fetchUrl);
      const data = await response.json();
      return data.results[0] as Movie;
    },
  });

  if (isLoading || !data) {
    return (
      <div className="relative h-[70vh] md:h-[85vh] bg-card animate-pulse" />
    );
  }

  const title = data.title || data.name || "Untitled";
  const year = (data.release_date || data.first_air_date || "").split("-")[0];

  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(data.backdrop_path, TMDB_IMAGE_SIZES.backdrop.original)}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Gradients for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end md:items-center px-4 md:px-8 lg:px-16 pb-20 md:pb-32">
        <div className="max-w-2xl animate-slide-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            {title}
          </h1>
          
          <div className="flex items-center gap-4 mb-6 text-sm md:text-base">
            {data.vote_average > 0 && (
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-semibold">{data.vote_average.toFixed(1)}</span>
              </div>
            )}
            {year && (
              <span className="text-muted-foreground font-medium">{year}</span>
            )}
          </div>

          {data.overview && (
            <p className="text-base md:text-lg mb-8 line-clamp-3 text-foreground/90">
              {data.overview}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Link to={`/${mediaType}/${data.id}`}>
              <Button size="lg" className="gap-2 font-semibold">
                <Play className="h-5 w-5 fill-current" />
                Watch Now
              </Button>
            </Link>
            <Link to={`/${mediaType}/${data.id}`}>
              <Button size="lg" variant="secondary" className="gap-2 font-semibold">
                <Info className="h-5 w-5" />
                More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
