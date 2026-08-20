import type { HTMLAttributes, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  size?: "content" | "wide";
} & HTMLAttributes<HTMLDivElement>;

export function Container({
  children,
  className = "",
  size = "wide",
  ...props
}: ContainerProps) {
  const classes = ["container", `container--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
