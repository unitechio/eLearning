import { Button } from "@/shared/components/ui/button";

interface HeroBannerProps {
  title: string;
  titleAccent?: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export function HeroBanner({
  title,
  titleAccent,
  description,
  ctaLabel = "Tìm hiểu khóa học",
  onCtaClick,
}: HeroBannerProps) {
  return (
    <section className="bg-surface-container-low py-14 text-center px-4">
      <h1 className="font-headline text-3xl font-extrabold text-on-surface leading-tight">
        {title}
        {titleAccent && (
          <>
            <br />
            <span className="text-primary">{titleAccent}</span>
          </>
        )}
      </h1>
      {description && (
        <p className="mt-3 text-on-surface-variant text-sm max-w-xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
      <Button
        className="mt-6 rounded-full px-7"
        onClick={onCtaClick}
      >
        {ctaLabel}
      </Button>
    </section>
  );
}
