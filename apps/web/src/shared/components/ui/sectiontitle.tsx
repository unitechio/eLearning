import type { ReactNode } from "react";

type HeadingLevel = "h2" | "h3";

interface SectionTitleProps {
  children: ReactNode;
  /** Render as h2 (default, page sections) or h3 (nested sections) */
  as?: HeadingLevel;
  className?: string;
}

export function SectionTitle({
  children,
  as: Tag = "h2",
  className = "",
}: SectionTitleProps) {
  return (
    <Tag
      className={`font-headline text-xl font-extrabold text-on-surface mb-4 ${className}`}
    >
      {children}
    </Tag>
  );
}
