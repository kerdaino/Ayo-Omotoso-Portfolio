// A Drive source is never a public playback source. Parse IDs instead of embedding arbitrary URLs.
export function publicPlayback(
  value: string,
): { kind: "embed" | "file"; src: string } | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    const host = url.hostname.toLowerCase();
    if (
      ["drive.google.com", "docs.google.com", "localhost"].includes(host) ||
      /^(?:127\.|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(host)
    )
      return null;
    let id: string | null = null;
    if (["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host))
      id =
        url.searchParams.get("v") ??
        url.pathname.match(/^\/(?:shorts|embed)\/([^/]+)/)?.[1] ??
        null;
    if (host === "youtu.be") id = url.pathname.slice(1);
    if (id && /^[\w-]{11}$/.test(id))
      return {
        kind: "embed",
        src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
      };
    if (["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(host)) {
      const videoId = url.pathname.match(/\/(?:video\/)?(\d+)\/?$/)?.[1];
      if (videoId)
        return {
          kind: "embed",
          src: `https://player.vimeo.com/video/${videoId}?autoplay=1&dnt=1`,
        };
    }
    if (url.pathname.toLowerCase().endsWith(".mp4"))
      return { kind: "file", src: url.toString() };
    return null;
  } catch {
    return null;
  }
}
