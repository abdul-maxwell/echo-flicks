import { useQuery } from "@tanstack/react-query";
import { Play, Info, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Movie, MovieDetails, getImageUrl, TMDB_IMAGE_SIZES, tmdbApi } from "@/lib/tmdb";
import { Button } from "./ui/button";

interface HeroProps {
  fetchUrl: string;
  mediaType?: "movie" | "tv";
}

const Hero = ({ fetchUrl, mediaType = "movie" }: HeroProps) => {
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch hero item
  const { data: heroItem, isLoading } = useQuery({
    queryKey: ["hero", fetchUrl],
    queryFn: async () => {
      const response = await fetch(fetchUrl);
      const data = await response.json();
      return data.results[0] as Movie;
    },
  });

  // Fetch detailed data with trailer
  const { data: detailedData } = useQuery({
    queryKey: ["hero-details", heroItem?.id, mediaType],
    queryFn: async () => {
      if (!heroItem?.id) return null;
      const detailUrl = tmdbApi.getDetails(mediaType, heroItem.id);
      const response = await fetch(detailUrl);
      return await response.json() as MovieDetails;
    },
    enabled: !!heroItem?.id,
  });

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Extract trailer and start autoplay timer
  useEffect(() => {
    if (detailedData?.videos?.results && !isMobile) {
      const trailer = detailedData.videos.results.find(
        (video: any) => video.type === "Trailer" && video.site === "YouTube"
      );
      
      if (trailer) {
        setTrailerKey(trailer.key);
        
        // Delay before showing trailer (Netflix-style)
        const timer = setTimeout(() => {
          setShowTrailer(true);
        }, 3500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [detailedData, isMobile]);


  if (isLoading || !heroItem) {
    return (
      <div className="relative h-[70vh] md:h-[85vh] bg-card animate-pulse" />
    );
  }

  const title = heroItem.title || heroItem.name || "Untitled";
  const year = (heroItem.release_date || heroItem.first_air_date || "").split("-")[0];

  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          showTrailer && trailerKey ? "opacity-0" : "opacity-100"
        }`}
      >
        <img
          src={getImageUrl(heroItem.backdrop_path, TMDB_IMAGE_SIZES.backdrop.original)}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Background Trailer Video */}
      {showTrailer && trailerKey && (
        <div className="absolute inset-0 animate-fade-in">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${trailerKey}&enablejsapi=1`}
            className="w-full h-full object-cover scale-125"
            style={{ border: 0, pointerEvents: "none" }}
            allow="autoplay; encrypted-media"
            title="Background Trailer"
          />
        </div>
      )}

      {/* Gradients for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent z-10" />

      {/* Content */}
      <div className="relative h-full flex items-end md:items-center px-4 md:px-8 lg:px-16 pb-20 md:pb-32 z-10">
        <div className="max-w-2xl animate-slide-up">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
            {title}
          </h1>
          
          <div className="flex items-center gap-4 mb-4 text-sm">
            {heroItem.vote_average > 0 && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-semibold">{heroItem.vote_average.toFixed(1)}</span>
              </div>
            )}
            {year && (
              <span className="text-muted-foreground font-medium">{year}</span>
            )}
            {showTrailer && trailerKey && (
              <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary border border-primary/30">
                Playing Trailer
              </span>
            )}
          </div>

          {heroItem.overview && (
            <p className="text-sm md:text-base mb-6 line-clamp-3 text-foreground/90">
              {heroItem.overview}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Link to={`/${mediaType}/${heroItem.id}`}>
              <Button size="lg" className="gap-2 font-semibold">
                <Play className="h-5 w-5 fill-current" />
                Watch Now
              </Button>
            </Link>
            <Link to={`/${mediaType}/${heroItem.id}`}>
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
