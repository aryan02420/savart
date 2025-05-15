"use client";

/**
 * @see https://github.com/Balastrong/shadcn-autocomplete-demo/blob/main/src/components/autocomplete.tsx
 */

import { Command as CommandPrimitive } from "cmdk";
import { useMemo, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Input } from "./ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";

type Props<T extends string> = {
  onSelect: (id: T) => void;
  searchText: string;
  onSearchTextChange: (id: string) => void;
  items: { id: T; name: string }[];
  isLoading?: boolean;
  emptyMessage?: string;
  placeholder?: string;
};

export function Autocomplete<T extends string>({
  onSelect,
  searchText,
  onSearchTextChange,
  items,
  isLoading,
  emptyMessage = "No items.",
  placeholder = "Search...",
}: Props<T>) {
  const [open, setOpen] = useState(false);

  const reset = () => {
    onSearchTextChange("");
  };

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      !e.relatedTarget?.hasAttribute("cmdk-list")
    ) {
      reset();
    }
  };

  const onSelectItem = (inputValue: string) => {
    if (inputValue) onSelect(inputValue as T);
    setOpen(false);
  };

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <PopoverAnchor asChild>
            <CommandPrimitive.Input
              asChild
              value={searchText}
              onValueChange={onSearchTextChange}
              onKeyDown={(e) => setOpen(e.key !== "Escape")}
              onMouseDown={() => setOpen((open) => !!searchText || !open)}
              onFocus={() => setOpen(true)}
              onBlur={onInputBlur}
            >
              <Input placeholder={placeholder} className="min-w-96" />
            </CommandPrimitive.Input>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault();
              }
            }}
            className="w-[--radix-popover-trigger-width] p-0"
          >
            <CommandList>
              {isLoading && (
                <>
                  <CommandPrimitive.Loading className="min-w-96 px-2 py-1.5 text-sm">
                    <Skeleton className="h-[2em] w-full" />
                  </CommandPrimitive.Loading>
                  <CommandPrimitive.Loading className="min-w-96 px-2 py-1.5 text-sm">
                    <Skeleton className="h-[2em] w-full" />
                  </CommandPrimitive.Loading>
                  <CommandPrimitive.Loading className="min-w-96 px-2 py-1.5 text-sm">
                    <Skeleton className="h-[2em] w-full" />
                  </CommandPrimitive.Loading>
                  <CommandPrimitive.Loading className="min-w-96 px-2 py-1.5 text-sm">
                    <Skeleton className="h-[2em] w-full" />
                  </CommandPrimitive.Loading>
                </>
              )}
              {items.length > 0 && !isLoading ? (
                <CommandGroup>
                  {items.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.id}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={onSelectItem}
                      className="min-w-96"
                    >
                      {option.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {!isLoading ? (
                <CommandEmpty className="min-w-96">{emptyMessage}</CommandEmpty>
              ) : null}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}