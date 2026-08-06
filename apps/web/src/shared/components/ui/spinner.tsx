import React from "react";
import { cn } from "@/shared/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
}

export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-[2px]",
    lg: "h-8 w-8 border-[3px]",
  };

  return (
    <span
      className={cn(
        "inline-block animate-spin rounded-full border-solid border-current border-t-transparent text-primary shrink-0",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
