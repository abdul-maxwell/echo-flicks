import { X } from "lucide-react";
import { Button } from "./ui/button";

interface VideoPlayerProps {
  title: string;
  videoId: string; // Not used anymore, keeping for backward compatibility
  mediaType: "movie" | "tv";
  itemId: string; // TMDB ID
  seasonNumber?: number;
  episodeNumber?: number;
  onClose: () => void;
}

const VideoPlayer = ({
  title,
  mediaType,
  itemId,
  seasonNumber,
  episodeNumber,
  onClose,
}: VideoPlayerProps) => {
  // Build the streaming URL based on media type
  const getStreamingUrl = () => {
    let url = `https://multiembed.mov/directstream.php?video_id=${itemId}&tmdb=1`;
    
    if (mediaType === "tv" && seasonNumber && episodeNumber) {
      url += `&s=${seasonNumber}&e=${episodeNumber}`;
    }
    
    return url;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header with Title and Close Button */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-10">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-white/20 text-white"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Streaming Video Iframe */}
      <iframe
        src={getStreamingUrl()}
        className="w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title={title}
      />
    </div>
  );
};

export default VideoPlayer;
