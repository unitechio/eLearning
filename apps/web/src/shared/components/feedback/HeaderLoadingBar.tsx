import { cn } from '@/shared/lib';

export function HeaderLoadingBar({ loading, className }: { loading?: boolean; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('header-loading-bar pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden', loading ? 'opacity-100' : 'opacity-0', className)}
      data-component="HeaderLoadingBar"
    >
      <div className="header-loading-bar__indicator" />
    </div>
  );
}
