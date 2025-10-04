import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Film, Tv, Heart, Bookmark, Menu, X, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { tmdbApi, Movie, getImageUrl, TMDB_IMAGE_SIZES } from "@/lib/tmdb";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayTimer);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setSearching(true);
    try {
      const response = await fetch(tmdbApi.search(query, "multi"));
      const data = await response.json();
      setSearchResults(data.results?.slice(0, 5) || []);
      setShowResults(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const navLinks = [
    { path: "/", label: "Home", icon: Film },
    { path: "/movies", label: "Movies", icon: Film },
    { path: "/tv", label: "TV Shows", icon: Tv },
    { path: "/favorites", label: "Favorites", icon: Heart },
    { path: "/watchlist", label: "Watchlist", icon: Bookmark },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchOpen(false);
      setShowResults(false);
    }
  };

  const handleResultClick = (item: Movie) => {
    const mediaType = item.media_type || (item.title ? "movie" : "tv");
    navigate(`/${mediaType}/${item.id}`);
    setSearchQuery("");
    setSearchOpen(false);
    setShowResults(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary rounded px-2 py-1">
              <Film className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
              StreamFlix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={isActive(link.path) ? "secondary" : "ghost"}
                  className="gap-2"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Search & Mobile Menu */}
          <div className="flex items-center gap-2">
            {!searchOpen ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="hover:bg-secondary"
              >
                <Search className="h-5 w-5" />
              </Button>
            ) : (
              <div ref={searchRef} className="relative">
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search movies, TV shows..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48 md:w-64 pr-8"
                      autoFocus
                    />
                    {searching && (
                      <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                      setShowResults(false);
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </form>

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 w-80 md:w-96 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-fade-in z-50">
                    {searchResults.map((item) => {
                      const title = item.title || item.name || "Unknown";
                      const mediaType = item.media_type || (item.title ? "movie" : "tv");
                      const year = item.release_date || item.first_air_date;
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleResultClick(item)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-secondary transition-colors text-left"
                        >
                          <img
                            src={getImageUrl(item.poster_path, TMDB_IMAGE_SIZES.poster.small)}
                            alt={title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{title}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="capitalize">{mediaType}</span>
                              {year && <span>• {new Date(year).getFullYear()}</span>}
                              {item.vote_average > 0 && (
                                <span>• ⭐ {item.vote_average.toFixed(1)}</span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                    <button
                      onClick={handleSearch}
                      className="w-full p-3 text-center text-sm text-primary hover:bg-secondary transition-colors border-t border-border"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive(link.path) ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
