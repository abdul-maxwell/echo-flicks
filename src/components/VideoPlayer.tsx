import { useEffect, useRef, useState } from "react";
import { X, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { saveWatchProgress } from "@/lib/storage";
import { toast } from "sonner";

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Sync video element with playing state
  useEffect(() => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.play().catch(() => {
          toast.error("Failed to play video");
          setPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [playing]);

  // Sync video element with volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = muted;
    }
  }, [volume, muted]);

  // Update time and duration
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => setPlaying(false);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
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
          handleFullscreen();
          break;
        case "Escape":
          if (isFullscreen) {
            handleFullscreen();
          } else {
            onClose();
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onClose, isFullscreen, duration]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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
      containerRef.current?.requestFullscreen();
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(duration, videoRef.current.currentTime + seconds)
      );
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
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex flex-col"
      onMouseMove={handleMouseMove}
    >
      {/* Video Container */}
      <div className="flex-1 relative bg-black flex items-center justify-center">
        {/* HTML5 Video Player */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          poster={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          onClick={() => setPlaying(!playing)}
        >
          {/* IMPORTANT: Replace this YouTube trailer URL with actual video source */}
          <source src={`https://www.youtube.com/watch?v=${videoId}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Demo Notice */}
        <div className="absolute top-4 left-4 bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
          <p className="font-semibold">⚠️ Demo Mode: Video source needed</p>
          <p className="text-xs mt-1">Replace video src with your streaming URL</p>
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
              <span className="text-sm tabular-nums min-w-[3rem]">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                className="flex-1"
                onValueChange={handleSeek}
              />
              <span className="text-sm tabular-nums min-w-[3rem]">{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlaying(!playing);
                  }}
                  className="hover:bg-white/20"
                >
                  {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    skip(-10);
                  }}
                  className="hover:bg-white/20"
                  title="Rewind 10s"
                >
                  <span className="text-xs font-bold">-10</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    skip(10);
                  }}
                  className="hover:bg-white/20"
                  title="Forward 10s"
                >
                  <span className="text-xs font-bold">+10</span>
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleFullscreen();
                }}
                className="hover:bg-white/20"
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
