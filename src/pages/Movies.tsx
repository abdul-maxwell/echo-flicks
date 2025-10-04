import Navbar from "@/components/Navbar";
import ContentRow from "@/components/ContentRow";
import { tmdbApi } from "@/lib/tmdb";

const Movies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Movies</h1>
          
          <div className="space-y-8">
            <ContentRow
              title="Now Playing"
              fetchUrl={tmdbApi.getNowPlaying()}
              mediaType="movie"
            />
            
            <ContentRow
              title="Upcoming"
              fetchUrl={tmdbApi.getUpcoming()}
              mediaType="movie"
            />
            
            <ContentRow
              title="Popular"
              fetchUrl={tmdbApi.getPopular("movie")}
              mediaType="movie"
            />
            
            <ContentRow
              title="Top Rated"
              fetchUrl={tmdbApi.getTopRated("movie")}
              mediaType="movie"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Movies;
