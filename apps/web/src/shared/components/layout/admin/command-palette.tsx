import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/shared/components/ui/command";
import { adminNavGroups } from "@/shared/config/admin-nav";
import { useUiStore } from "@/shared/stores/use-ui-store";

export function CommandPalette() {
  const navigate = useNavigate();
  const open = useUiStore((s) => s.commandPaletteOpen);
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const handleSelect = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Jump to a page…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        {adminNavGroups.map((group) => (
          <CommandGroup key={group.label} heading={group.label}>
            {group.items.map((item) => (
              <CommandItem
                key={item.path}
                value={`${item.title} ${item.path}`}
                onSelect={() => handleSelect(item.path)}
                className="flex items-center gap-2.5"
              >
                <item.icon className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">
                    {item.title}
                </span>
                {item.soon && (
                  <span className="ml-auto rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                    Soon
                  </span>                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
        <CommandSeparator />
      </CommandList>
    </CommandDialog>
  );
}
