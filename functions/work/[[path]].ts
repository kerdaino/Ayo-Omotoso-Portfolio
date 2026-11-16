// Explicit client removals. A Pages edge response prevents stale CDN assets
// from exposing retired URLs. Only these paths invoke this function; see
// public/_routes.json. Restoring a retired project requires editorial approval
// and removal of its edge route as well as changing Sanity visibility.
const retiredSlugs = new Set([
  "becoming-garvicii",
  "masicka-ruger-oxlade-location-sourcing",
  "guchi-single-covers",
  "lobby-redesign",
  "frankly-speaking-brand-partnership-deck",
]);

export function onRequest(context: {
  request: Request;
  next: () => Promise<Response>;
}) {
  const slug = new URL(context.request.url).pathname.split("/")[2];
  if (!retiredSlugs.has(slug)) return context.next();
  return new Response("Not found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
