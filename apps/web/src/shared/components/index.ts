// ─── Layout ───────────────────────────────────────────────────────────────────
export { default as SideNav }     from "./layout/side-nav";
export { default as TopNav }      from "./layout/top-nav";
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
export { Textarea }                            from "./ui/textarea";
export { Label }                               from "./ui/label";
export { Switch }                              from "./ui/switch";
export { Checkbox }                            from "./ui/checkbox";
export { RadioGroup, RadioGroupItem }          from "./ui/radio-group";
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
}                                              from "./ui/dialog";
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}                                              from "./ui/alert-dialog";
export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
}                                              from "./ui/select";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
}                                              from "./ui/dropdown-menu";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
}                                              from "./ui/table";
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./ui/tooltip";
export { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
export { ScrollArea, ScrollBar }               from "./ui/scroll-area";
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}                                              from "./ui/sheet";
export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
}                                              from "./ui/command";
export { Toaster }                             from "./ui/sonner";
export { Alert, AlertTitle, AlertDescription } from "./ui/alert";
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}                                              from "./ui/breadcrumb";
export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}                                              from "./ui/pagination";
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible";
export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}                                              from "./ui/form";

// ─── UI Composed ──────────────────────────────────────────────────────────────
export { CTABanner }       from "./marketing/ctabanner";
export { FilterSidebar }   from "./marketing/filtersidebar";
export { HeroBanner }      from "./marketing/herobanner";
export { SectionTitle }    from "./marketing/sectiontitle";
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
