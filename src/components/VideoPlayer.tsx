import { useEffect, useRef, useState } from "react";
import { X, Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { saveWatchProgress } from "@/lib/storage";

interface VideoPlayerProps {
  title: string;
  videoId: string; // YouTube video ID for demo (trailer)
  mediaType: "movie" | "tv";
  itemId: string;
  seasonNumber?: number;
  episodeNumber?: number;
  onClose: () => void;
}

const VideoPlayer = ({
  title,
  videoId,
  mediaType,
  itemId,
  seasonNumber,
  episodeNumber,
  onClose,
}: VideoPlayerProps) => {
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          setPlaying((prev) => !prev);
          break;
        case "m":
          setMuted((prev) => !prev);
          break;
        case "f":
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onClose]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0
      ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      : `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Save progress periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTime > 0) {
        saveWatchProgress({
          id: itemId,
          mediaType,
          title,
          posterPath: null,
          timestamp: currentTime,
          duration: duration || 100,
          lastWatched: new Date(),
          seasonNumber,
          episodeNumber,
        });
      }
    }, 10000); // Save every 10 seconds

    return () => clearInterval(interval);
  }, [currentTime, duration, itemId, mediaType, title, seasonNumber, episodeNumber]);

  return (
    <div
      className="fixed inset-0 z-50 bg-background flex flex-col"
      onMouseMove={handleMouseMove}
    >
      {/* Video Container */}
      <div className="flex-1 relative bg-black flex items-center justify-center">
        {/* YouTube Embed (for demo purposes - showing trailer) */}
        <iframe
          ref={videoRef}
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        {/* Note: In production, you would integrate with actual video sources */}
        <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded text-sm">
          Demo: Playing Trailer
        </div>

        {/* Controls Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/70 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{title}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4">
            {/* Progress Bar */}
            <div className="flex items-center gap-2">
              <span className="text-sm tabular-nums">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                className="flex-1"
                onValueChange={(value) => setCurrentTime(value[0])}
              />
              <span className="text-sm tabular-nums">{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPlaying(!playing)}
                  className="hover:bg-white/20"
                >
                  {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/20"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/20"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-2 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMuted(!muted)}
                    className="hover:bg-white/20"
                  >
                    {muted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                  <Slider
                    value={[muted ? 0 : volume * 100]}
                    max={100}
                    step={1}
                    className="w-24"
                    onValueChange={(value) => {
                      setVolume(value[0] / 100);
                      setMuted(false);
                    }}
                  />
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleFullscreen}
                className="hover:bg-white/20"
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
