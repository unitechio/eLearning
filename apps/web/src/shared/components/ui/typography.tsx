import React from 'react';
import { cn } from '@/shared/lib/utils';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  readonly children: React.ReactNode;
}

export function DialogTitle({ className, children, ...props }: TypographyProps) {
  return (
    <h2
      className={cn("text-2xl font-semibold tracking-tight text-foreground select-none", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

export function DialogDescription({ className, children, ...props }: TypographyProps) {
  return (
    <p
      className={cn("text-[13px] font-normal text-muted-foreground/80 leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function SectionTitle({ className, children, ...props }: TypographyProps) {
  return (
    <h3
      className={cn("text-base font-semibold text-foreground tracking-tight select-none", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function FieldLabel({ className, children, ...props }: TypographyProps) {
  return (
    <span
      className={cn("text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground select-none", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export function InputText({ className, children, ...props }: TypographyProps) {
  return (
    <span
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export function HelperText({ className, children, ...props }: TypographyProps) {
  return (
    <p
      className={cn("text-xs font-normal text-muted-foreground/75 leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function ValidationText({ className, children, ...props }: TypographyProps) {
  return (
    <p
      className={cn("text-[13px] font-medium text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function PreviewCardTitle({ className, children, ...props }: TypographyProps) {
  return (
    <h4
      className={cn("text-[15px] font-semibold text-foreground leading-snug truncate", className)}
      {...props}
    >
      {children}
    </h4>
  );
}

export function PreviewMetadata({ className, children, ...props }: TypographyProps) {
  return (
    <span
      className={cn("text-[13px] font-normal text-muted-foreground/80 leading-none", className)}
      {...props}
    >
      {children}
    </span>
  );
}
