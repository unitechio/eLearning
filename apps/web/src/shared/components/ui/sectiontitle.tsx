import type { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return <h2 className="text-xl font-extrabold text-gray-900 mb-4">{children}</h2>;
}
