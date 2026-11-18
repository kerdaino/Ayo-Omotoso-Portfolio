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
  portrait?: boolean;
};
function VideoItem({ video }: { video: VideoEntry }) {
  const [playing, setPlaying] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const playback = publicPlayback(video.playbackUrl);
  if (!playback) return null;
  const poster = video.poster ?? (
    playback.kind === "embed" && new URL(playback.src).hostname === "www.youtube-nocookie.com"
      ? `https://i.ytimg.com/vi/${new URL(playback.src).pathname.split("/").pop()}/hqdefault.jpg`
      : null
  );
  return (
    <article className={video.portrait ? "video-gallery__portrait" : undefined}>
      <h3>{video.title}</h3>
      {playing ? (
        playback.kind === "file" ? (
          <video
            ref={(element) => element?.focus()}
            tabIndex={0}
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
            key={attempt}
            ref={(element) => element?.focus()}
            tabIndex={0}
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
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt={video.posterAlt || `${video.title} video thumbnail`}
              loading="lazy"
            />
          ) : null}
          <span>▶ Play {video.title}</span>
        </button>
      )}
      {video.caption ? <p>{video.caption}</p> : null}
      {playing && playback.kind === "embed" ? (
        <p className="video-gallery__recovery">
          Player not responding?{" "}
          <button type="button" onClick={() => setAttempt((value) => value + 1)} aria-label={`Reload ${video.title} player`}>
            Reload player
          </button>{" "}
          or watch at source below.
        </p>
      ) : null}
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
    <section id="video-work" className="video-gallery" aria-label="Video deliverables" tabIndex={-1}>
      <h2>Video work</h2>
      <div className="video-gallery__grid">
        {supported.map((video) => (
          <VideoItem key={video.key} video={video} />
        ))}
      </div>
    </section>
  );
}
