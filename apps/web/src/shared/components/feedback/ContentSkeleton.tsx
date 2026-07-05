import { cn } from '@/shared/lib';

export function ContentCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className="space-y-3" data-component="ContentCardSkeleton">
      {!compact ? <div className="skeleton-shimmer aspect-[1.55] rounded-[8px]" /> : null}
      <div className={cn('skeleton-shimmer h-4 rounded', compact ? 'w-4/5' : 'w-full')} />
      <div className="skeleton-shimmer h-3 w-2/3 rounded" />
      <div className="skeleton-shimmer h-8 w-24 rounded-[8px]" />
    </div>
  );
}

export function ContentSkeletonGrid({ count = 8, compact = false }: { count?: number; compact?: boolean }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ContentCardSkeleton compact={compact} key={index} />
      ))}
    </>
  );
}
