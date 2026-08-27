"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";

type MobileNavigationProps = {
  email?: string | null;
};

function PendingNavigationItem({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="site-nav__link site-nav__link--pending"
      aria-disabled="true"
      title="This destination will be published in a later phase."
    >
      {children}
      <span className="sr-only"> — not yet published</span>
    </span>
  );
}

export function MobileNavigation({ email }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Escape" || !isOpen) {
      return;
    }

    event.preventDefault();
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <div className="mobile-nav" onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        className="mobile-nav__button"
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-primary-navigation"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{isOpen ? "Close" : "Menu"}</span>
        <span className="mobile-nav__icon" aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      {isOpen ? (
        <nav
          id="mobile-primary-navigation"
          className="mobile-nav__panel"
          aria-label="Mobile primary navigation"
        >
          <ul className="mobile-nav__list">
            <li>
              <Link
                className="site-nav__link"
                href="/#selected-work"
                onClick={() => setIsOpen(false)}
              >
                Selected Work
              </Link>
            </li>
            <li>
              <Link
                className="site-nav__link"
                href="/#about"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                className="site-nav__link"
                href="/resume"
                onClick={() => setIsOpen(false)}
              >
                Resume
              </Link>
            </li>
            <li>
              {email ? (
                <a
                  className="site-nav__link site-nav__link--contact"
                  href={`mailto:${email}`}
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </a>
              ) : (
                <PendingNavigationItem>Contact</PendingNavigationItem>
              )}
            </li>
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
