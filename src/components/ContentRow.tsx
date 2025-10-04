import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import ContentCard from "./ContentCard";
import { Movie } from "@/lib/tmdb";
import { Button } from "./ui/button";

interface ContentRowProps {
  title: string;
  fetchUrl: string;
  mediaType?: "movie" | "tv";
}

const ContentRow = ({ title, fetchUrl, mediaType }: ContentRowProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: [title, fetchUrl],
    queryFn: async () => {
      const response = await fetch(fetchUrl);
      const data = await response.json();
      return data.results as Movie[];
    },
  });

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const targetScroll =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  if (isLoading) {
    return (
      <div className="mb-8 animate-fade-in">
        <h2 className="text-xl md:text-2xl font-bold mb-4 px-4">{title}</h2>
        <div className="flex gap-3 px-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-40 md:w-48 aspect-[2/3] bg-card rounded-md animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="mb-8 group/row relative animate-fade-in">
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4">{title}</h2>
      
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover/row:opacity-100 transition-opacity shadow-lg"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {/* Content */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-3 px-4 overflow-x-auto hide-scrollbar scroll-smooth"
        >
          {data.map((item) => (
            <div key={item.id} className="w-40 md:w-48 flex-shrink-0">
              <ContentCard item={item} mediaType={mediaType} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover/row:opacity-100 transition-opacity shadow-lg"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContentRow;
