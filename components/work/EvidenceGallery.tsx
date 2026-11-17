"use client";

import { useEffect, useId, useRef, useState } from "react";

export type EvidenceImage = {
  key: string;
  src: string;
  enlargedSrc: string;
  alt: string;
  caption?: string | null;
  width: number;
  height: number;
};
export function EvidenceGallery({
  title,
  description,
  images,
}: {
  title: string;
  description?: string | null;
  images: EvidenceImage[];
}) {
  const [index, setIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const dialogTitleId = useId();
  const isOpen = index !== null;
  useEffect(() => {
    if (!isOpen) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element?.showModal();
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);
  if (!images.length) return null;
  const current = index === null ? null : images[index];
  const change = (step: number) => {
    setZoomed(false);
    setIndex((value) =>
      value === null ? null : (value + step + images.length) % images.length,
    );
  };
  return (
    <section className="evidence-gallery" aria-labelledby={titleId}>
      <h2 id={titleId}>{title}</h2>
      {description ? (
        <p className="evidence-gallery__intro">{description}</p>
      ) : null}
      <div className="evidence-gallery__grid">
        {images.map((image, itemIndex) => (
          <figure key={image.key}>
            <button
              type="button"
              className="evidence-gallery__open"
              onClick={() => {
                setZoomed(false);
                setIndex(itemIndex);
              }}
              aria-label={`Enlarge ${image.caption || image.alt}`}
              aria-haspopup="dialog"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
              />
              <span className="evidence-gallery__hint">
                Enlarge image <span aria-hidden="true">↗</span>
              </span>
            </button>
            {image.caption ? <figcaption>{image.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="evidence-lightbox"
        aria-labelledby={dialogTitleId}
        onClose={() => setIndex(null)}
        onCancel={() => setIndex(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            const controls = event.currentTarget.querySelectorAll<HTMLElement>(
              'button:not([disabled]), [href], [tabindex="0"]',
            );
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
            return;
          }
          if (zoomed) return;
          if (event.key === "ArrowRight") {
            event.preventDefault();
            change(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            change(-1);
          }
        }}
      >
        {current ? (
          <>
            <div className="evidence-lightbox__controls">
              <strong id={dialogTitleId}>
                {title}{" "}
                <span aria-live="polite">
                  {(index ?? 0) + 1} / {images.length}
                </span>
              </strong>
              <div>
                {images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => change(-1)}
                      aria-label="Previous image"
                    >
                      ← Previous
                    </button>{" "}
                    <button
                      type="button"
                      onClick={() => change(1)}
                      aria-label="Next image"
                    >
                      Next →
                    </button>{" "}
                  </>
                ) : null}
                <button
                  type="button"
                  aria-pressed={zoomed}
                  onClick={() => {
                    const next = !zoomed;
                    setZoomed(next);
                    requestAnimationFrame(() => {
                      const element = viewport.current;
                      element?.focus();
                      element?.scrollTo({
                        left: next
                          ? Math.max(
                              0,
                              (element.scrollWidth - element.clientWidth) / 2,
                            )
                          : 0,
                        top: 0,
                      });
                    });
                  }}
                >
                  {zoomed ? "Fit image" : "Zoom in"}
                </button>{" "}
                <button
                  type="button"
                  onClick={() => dialog.current?.close()}
                  autoFocus
                >
                  Close
                </button>
              </div>
            </div>
            <div
              className="evidence-lightbox__viewport"
              ref={viewport}
              tabIndex={0}
              aria-label={
                zoomed ? "Zoomed image; scroll to explore" : "Enlarged image"
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="evidence-lightbox__image"
                src={current.enlargedSrc}
                alt={current.alt}
                width={current.width}
                height={current.height}
                style={
                  zoomed
                    ? {
                        width: Math.max(current.width, 1400),
                        maxWidth: "none",
                        height: "auto",
                      }
                    : undefined
                }
              />
            </div>
            <p className="evidence-lightbox__caption">
              {current.caption || current.alt}
            </p>
          </>
        ) : null}
      </dialog>
    </section>
  );
}
