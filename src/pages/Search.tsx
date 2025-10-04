import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import ContentCard from "@/components/ContentCard";
import { Movie, tmdbApi } from "@/lib/tmdb";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query) return [];
      const response = await fetch(tmdbApi.search(query, "multi"));
      const data = await response.json();
      return data.results as Movie[];
    },
    enabled: !!query,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <SearchIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Search Results</h1>
              {query && (
                <p className="text-muted-foreground mt-1">
                  Showing results for "{query}"
                </p>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] bg-card rounded-md animate-pulse"
                />
              ))}
            </div>
          ) : !data || data.length === 0 ? (
            <div className="text-center py-20">
              <SearchIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No results found</h2>
              <p className="text-muted-foreground">
                Try searching with different keywords
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {data
                .filter((item) => item.media_type === "movie" || item.media_type === "tv")
                .map((item) => (
                  <ContentCard
                    key={`${item.id}-${item.media_type}`}
                    item={item}
                    mediaType={item.media_type}
                  />
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Search;
