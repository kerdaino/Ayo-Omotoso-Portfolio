// Keep source records intact, but remove internal management notes before any
// project enters server rendering, metadata or a client component's props.
const internalNote = /\b(?:assigned\s+by|self[- ]assigned|self[- ]initiated|submitted\b|boss(?:es)?\b|internal\s+approval|approved\s+by)/i;
const privateDrive = /https?:\/\/(?:drive|docs)\.google\.com\//i;

export function publicProject<T>(project: T): T {
  function clean(value: unknown): unknown {
    if (typeof value === "string") {
      return internalNote.test(value) || privateDrive.test(value) ? null : value;
    }
    if (Array.isArray(value)) return value.map(clean).filter((item) => item != null);
    if (value && typeof value === "object") {
      const object = value as Record<string, unknown>;
      // Remove whole notes/links rather than leaving empty Portable Text spans.
      if (typeof object.text === "string" && internalNote.test(object.text)) return null;
      if (typeof object.url === "string" && privateDrive.test(object.url)) return null;
      return Object.fromEntries(Object.entries(object).map(([key, item]) => [key, clean(item)]));
    }
    return value;
  }
  return clean(project) as T;
}
