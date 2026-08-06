import React from 'react';
import { cn } from '@/shared/lib/utils';

export const AdminCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <article
    ref={ref as any}
    className={cn(
      "rounded-xl border border-border/80 bg-card text-card-foreground shadow-sm overflow-hidden",
      className
    )}
    {...props}
  />
));
AdminCard.displayName = "AdminCard";

export const AdminCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <header
    ref={ref as any}
    className={cn("flex flex-col space-y-1 px-5 pt-5 pb-4", className)}
    {...props}
  />
));
AdminCardHeader.displayName = "AdminCardHeader";

export const AdminCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-sm font-bold leading-none tracking-tight text-foreground", className)}
    {...props}
  />
));
AdminCardTitle.displayName = "AdminCardTitle";

export const AdminCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-muted-foreground leading-relaxed mt-0.5", className)}
    {...props}
  />
));
AdminCardDescription.displayName = "AdminCardDescription";

export const AdminCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-5 pb-5", className)}
    {...props}
  />
));
AdminCardContent.displayName = "AdminCardContent";

export const AdminCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <footer
    ref={ref as any}
    className={cn("flex items-center px-5 py-3 border-t border-border/60 bg-muted/20", className)}
    {...props}
  />
));
AdminCardFooter.displayName = "AdminCardFooter";
