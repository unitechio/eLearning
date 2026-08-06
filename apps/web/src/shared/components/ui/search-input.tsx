import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "./input"
import { cn } from "@/shared/lib"

export interface SearchInputProps extends React.ComponentProps<typeof Input> {}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <Search 
          className="absolute left-3 h-4 w-4 text-muted-foreground/60 pointer-events-none" 
          aria-hidden="true" 
        />
        <Input
          type="search"
          ref={ref}
          className={cn("pl-9 pr-3 h-9 text-xs rounded-lg bg-muted/20 border-input placeholder:text-muted-foreground/50 font-medium focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0", className)}
          {...props}
        />
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"
