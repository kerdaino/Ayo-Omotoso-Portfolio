import type { ReactNode } from "react";

type ActionLinkProps = {
  children: ReactNode;
  href?: string | null;
  variant?: "primary" | "secondary";
};

export function ActionLink({
  children,
  href,
  variant = "primary",
}: ActionLinkProps) {
  const className = `action-link action-link--${variant}`;

  if (!href) {
    return (
      <span
        className={`${className} action-link--pending`}
        aria-disabled="true"
        title="This destination will be published in a later phase."
      >
        {children}
        <span aria-hidden="true">↗</span>
        <span className="sr-only"> — not yet published</span>
      </span>
    );
  }

  return (
    <a className={className} href={href}>
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
