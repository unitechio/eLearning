import { Button } from "@/shared/components/ui/button";

interface CTABannerProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  emoji?: string;
}

export function CTABanner({
  title = "Gia hạn miễn phí!",
  description = "Tài khoản của bạn đã hết hạn sử dụng. Hãy gia hạn ngay để tiếp tục việc học nhé!",
  ctaLabel = "Gia hạn miễn phí",
  onCtaClick,
  emoji = "📚",
}: CTABannerProps) {
  return (
    <aside
      aria-label="Thông báo nâng cấp tài khoản"
      className="bg-surface-container-low border border-outline-variant rounded-2xl p-8 flex items-center justify-between mt-12 mx-4 md:mx-0"
    >
      <div>
        <h3 className="font-headline text-xl font-extrabold text-on-surface">
          {title}
        </h3>
        <p className="text-on-surface-variant text-sm mt-1">{description}</p>
        <Button className="mt-3" onClick={onCtaClick}>
          {ctaLabel}
        </Button>
      </div>
      <span className="text-6xl hidden md:block" aria-hidden="true">
        {emoji}
      </span>
    </aside>
  );
}
