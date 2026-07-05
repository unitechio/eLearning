import React from 'react';
import { cn } from '@/shared/lib';
import { OptimizedImage } from './OptimizedImage';

type OptimizedVideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  src: string;
  poster?: string;
  aspectClassName?: string;
  priority?: boolean;
};

export function OptimizedVideo({ src, poster, aspectClassName = 'aspect-video', priority = false, className, ...props }: OptimizedVideoProps) {
  const [ready, setReady] = React.useState(false);

  return (
    <div className={cn('optimized-media relative overflow-hidden bg-slate-100', aspectClassName, className)} data-component="OptimizedVideo">
      {!ready && poster ? <OptimizedImage alt="" aspectClassName="absolute inset-0" src={poster} widthHint={960} priority={priority} /> : null}
      {!ready && !poster ? <span className="optimized-media__placeholder" aria-hidden="true" /> : null}
      <video
        {...props}
        className={cn('h-full w-full object-cover transition duration-300', ready ? 'opacity-100' : 'opacity-0')}
        controls={props.controls ?? true}
        onCanPlay={(event) => {
          setReady(true);
          props.onCanPlay?.(event);
        }}
        playsInline
        poster={poster}
        preload={priority ? 'metadata' : 'none'}
        src={src}
      />
    </div>
  );
}
