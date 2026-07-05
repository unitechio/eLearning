import React from 'react';
import { cn } from '@/shared/lib';
import { FALLBACK_IMAGE, buildImageURL, buildSrcSet } from '@/shared/lib/assets';

type OptimizedImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'loading'> & {
  src?: string | null;
  widthHint?: number;
  priority?: boolean;
  aspectClassName?: string;
  imageClassName?: string;
};

export function OptimizedImage({
  src,
  alt,
  widthHint = 640,
  priority = false,
  aspectClassName = 'aspect-[1.55]',
  imageClassName,
  className,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px',
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const resolvedSrc = failed ? FALLBACK_IMAGE : buildImageURL(src, { width: widthHint });

  return (
    <span className={cn('optimized-media block overflow-hidden bg-slate-100', aspectClassName, className)} data-component="OptimizedImage">
      {!loaded ? <span className="optimized-media__placeholder" aria-hidden="true" /> : null}
      <img
        {...props}
        alt={alt}
        className={cn('h-full w-full object-cover opacity-0 transition duration-300', loaded && 'opacity-100', imageClassName)}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        loading={priority ? 'eager' : 'lazy'}
        onError={() => setFailed(true)}
        onLoad={(event) => {
          setLoaded(true);
          props.onLoad?.(event);
        }}
        sizes={sizes}
        src={resolvedSrc}
        srcSet={failed ? undefined : buildSrcSet(src)}
      />
    </span>
  );
}
