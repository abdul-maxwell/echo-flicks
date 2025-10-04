import { Link } from "react-router-dom";
import { Star, Play } from "lucide-react";
import { Movie, getImageUrl, TMDB_IMAGE_SIZES } from "@/lib/tmdb";
import { Button } from "./ui/button";

interface ContentCardProps {
  item: Movie;
  mediaType?: "movie" | "tv";
}

const ContentCard = ({ item, mediaType }: ContentCardProps) => {
  const type = mediaType || item.media_type || "movie";
  const title = item.title || item.name || "Untitled";
  const year = (item.release_date || item.first_air_date || "").split("-")[0];

  return (
    <Link
      to={`/${type}/${item.id}`}
      className="group relative flex-shrink-0 transition-transform duration-300 hover:scale-105 hover:z-10"
    >
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-card shadow-card">
        <img
          src={getImageUrl(item.poster_path, TMDB_IMAGE_SIZES.poster.medium)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex items-center gap-2 mb-2">
            {item.vote_average > 0 && (
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-semibold">
                  {item.vote_average.toFixed(1)}
                </span>
              </div>
            )}
            {year && (
              <span className="text-sm text-muted-foreground">{year}</span>
            )}
          </div>
          
          <Button size="sm" className="w-full gap-2">
            <Play className="h-4 w-4" />
            Watch Now
          </Button>
        </div>
      </div>
      
      <div className="mt-2 px-1">
        <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default ContentCard;
