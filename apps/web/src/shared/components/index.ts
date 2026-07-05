// ─── Layout ───────────────────────────────────────────────────────────────────
export { default as SideNav }     from "./layout/side-nav";
export { default as TopNav }      from "./layout/top-nav";
export { default as AppSidebar }  from "./layout/side-bar";
export { default as HeaderNav }   from "./layout/main/header-nav";
export { default as FooterNav }   from "./layout/main/footer-nav";
export { PublicHeader }           from "./layout/main/PublicHeader";

// ─── UI Primitives ────────────────────────────────────────────────────────────
export { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
export { Badge, badgeVariants }                from "./ui/badge";
export { Button, buttonVariants }              from "./ui/button";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
}                                              from "./ui/card";
export { Input }                               from "./ui/input";
export { Progress }                            from "./ui/progress";
export { Separator }                           from "./ui/separator";
export { Skeleton }                            from "./ui/skeleton";

// ─── UI Composed ──────────────────────────────────────────────────────────────
export { CTABanner }       from "./ui/ctabanner";
export { FilterSidebar }   from "./ui/filtersidebar";
export { HeroBanner }      from "./ui/herobanner";
export { SectionTitle }    from "./ui/sectiontitle";
export {
  StatCard,
  StreakBadge,
  LevelBadge,
  EmptyState,
  TabBar,
}                          from "./ui/statcard";

// ─── Molecules ────────────────────────────────────────────────────────────────
export { AudioPlayer, SPEEDS } from "./molecules/AudioPlayer";
export { TestCard, type TestCardData } from "./molecules/TestCard";

// ─── Organisms ────────────────────────────────────────────────────────────────
export { QuestionNumberGrid, QuestionDrawer } from "./organisms/QuestionGrid";
export { PracticeFilterSidebar, type PracticeFilterSidebarProps, type FilterOption } from "./organisms/PracticeFilterSidebar";
export { ConsultationSection } from "./organisms/ConsultationSection";

// ─── Feedback / Loading ───────────────────────────────────────────────────────
export * from "./feedback";

// ─── Media ────────────────────────────────────────────────────────────────────
export * from "./media";
