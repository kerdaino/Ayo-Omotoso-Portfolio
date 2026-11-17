"use client";

import { useState } from "react";
import { publicPlayback } from "@/lib/video";
export type VideoEntry = {
  key: string;
  title: string;
  playbackUrl: string;
  poster?: string | null;
  posterAlt?: string | null;
  caption?: string | null;
};
function VideoItem({ video }: { video: VideoEntry }) {
  const [playing, setPlaying] = useState(false);
  const playback = publicPlayback(video.playbackUrl);
  if (!playback) return null;
  return (
    <article>
      <h3>{video.title}</h3>
      {playing ? (
        playback.kind === "file" ? (
          <video
            src={playback.src}
            poster={video.poster ?? undefined}
            controls
            autoPlay
            playsInline
            preload="metadata"
            aria-label={video.title}
          />
        ) : (
          <iframe
            src={playback.src}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )
      ) : (
        <button
          className="video-gallery__play"
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${video.title}`}
        >
          {video.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.poster}
              alt={video.posterAlt || ""}
              loading="lazy"
            />
          ) : null}
          <span>▶ Play {video.title}</span>
        </button>
      )}
      {video.caption ? <p>{video.caption}</p> : null}
      <a href={video.playbackUrl} target="_blank" rel="noopener noreferrer">
        Watch {video.title} at source <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}
export function VideoGallery({ videos }: { videos: VideoEntry[] }) {
  const supported = videos.filter((video) => publicPlayback(video.playbackUrl));
  if (!supported.length) return null;
  return (
    <section className="video-gallery" aria-label="Video deliverables">
      <h2>Video work</h2>
      <div className="video-gallery__grid">
        {supported.map((video) => (
          <VideoItem key={video.key} video={video} />
        ))}
      </div>
    </section>
  );
}
