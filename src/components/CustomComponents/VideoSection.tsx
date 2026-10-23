"use client";
import { useState } from "react";
import Image from "next/image";

interface VideoSectionProps {
  videourl?: string;
}

const DEFAULT_VIDEO_ID = "wZB5PwmPw90";

function getYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function VideoSection({ videourl }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = getYoutubeVideoId(videourl || "") || DEFAULT_VIDEO_ID;
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`;
  const youtubeVideoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const thumbnailUrl = `https://i3.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <>
      {isPlaying ? (
        /* ── Live YouTube embed ── */
        <iframe
          src={youtubeEmbedUrl}
          title="Her Kadam Campaign Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        /* ── Custom player shell (thumbnail state) ── */
        <div className="video-player-shell" aria-label="Her Kadam Campaign Video preview">

          {/* Dark video body with play button */}
          <div className="video-player-body">
            <Image
              src={thumbnailUrl}
              alt="Her Kadam Campaign Video Thumbnail"
              className="video-thumbnail"
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              priority={false}
            />
            <button
              type="button"
              className="video-play-button"
              onClick={() => setIsPlaying(true)}
              aria-label="Play Her Kadam Campaign Video"
            />
          </div>

          {/* Visually hidden accessible YouTube link */}
          <a
            className="video-open-link"
            href={youtubeVideoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open on YouTube
          </a>
        </div>
      )}
    </>
  );
}
