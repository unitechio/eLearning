import React from 'react';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';

interface AvatarStackProps {
  readonly avatars: readonly string[];
  readonly max?: number;
}

/**
 * Renders a stacked list of user avatars with a "+N" label for overflow items.
 *
 * @example
 * <AvatarStack avatars={['MT', 'LM', 'LA', 'JB']} max={3} />
 */
export function AvatarStack({ avatars, max = 3 }: AvatarStackProps) {
  const visibleAvatars = avatars.slice(0, max);
  const extraCount = avatars.length - max;

  return (
    <div 
      className="flex -space-x-1.5 overflow-hidden" 
      role="group" 
      aria-label={`${avatars.length} members involved`}
    >
      {visibleAvatars.map((initials, index) => (
        <Avatar 
          key={`${initials}-${index}`} 
          className="h-[18px] w-[18px] border border-card shrink-0 select-none"
        >
          <AvatarFallback 
            className="text-[8px] bg-muted text-muted-foreground font-extrabold flex items-center justify-center h-full w-full"
            aria-label={`Member ${initials}`}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
      ))}
      {extraCount > 0 && (
        <span 
          className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-muted border border-card text-[8px] font-bold text-muted-foreground shrink-0 select-none"
          aria-label={`${extraCount} more members`}
        >
          +{extraCount}
        </span>
      )}
    </div>
  );
}
