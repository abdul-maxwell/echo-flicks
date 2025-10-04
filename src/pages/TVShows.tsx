import Navbar from "@/components/Navbar";
import ContentRow from "@/components/ContentRow";
import { tmdbApi } from "@/lib/tmdb";

const TVShows = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">TV Shows</h1>
          
          <div className="space-y-8">
            <ContentRow
              title="Airing Today"
              fetchUrl={tmdbApi.getAiringToday()}
              mediaType="tv"
            />
            
            <ContentRow
              title="On The Air"
              fetchUrl={tmdbApi.getOnTheAir()}
              mediaType="tv"
            />
            
            <ContentRow
              title="Popular"
              fetchUrl={tmdbApi.getPopular("tv")}
              mediaType="tv"
            />
            
            <ContentRow
              title="Top Rated"
              fetchUrl={tmdbApi.getTopRated("tv")}
              mediaType="tv"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TVShows;
