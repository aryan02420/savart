"use client";

/**
 * @see https://github.com/Balastrong/shadcn-autocomplete-demo/blob/main/src/components/autocomplete.tsx
 */

import { Command as CommandPrimitive } from "cmdk";
import { useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandLoading,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Input } from "./ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "./ui/popover";


type Props<T extends string> = {
  onSelect: (id: T) => void;
  searchText: string;
  onSearchTextChange: (id: string) => void;
  items: { id: T; name: string }[];
  isLoading?: boolean;
  emptyMessage?: string;
  placeholder?: string;
  error?: string;
};

export function Autocomplete<T extends string>({
  onSelect,
  searchText,
  onSearchTextChange,
  items,
  isLoading,
  emptyMessage = "No items.",
  placeholder = "Search...",
  error,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      <Popover open={open} onOpenChange={setOpen}>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <Command shouldFilter={false} className="w-full max-w-96" ref={containerRef}>
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
              <Input placeholder={placeholder} className="w-full" />
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
            className="w-[var(--radix-popover-trigger-width)] p-0"
          >
            <CommandList>
              <CommandGroup>
                {isLoading && (
                  <>
                    <CommandLoading />
                    <CommandLoading />
                    <CommandLoading />
                    <CommandLoading />
                  </>
                )}
                {items.length > 0 && !isLoading ? (
                    items.map((option) => (
                      <CommandItem
                        key={option.id}
                        value={option.id}
                        onMouseDown={(e) => e.preventDefault()}
                        onSelect={onSelectItem}
                      >
                        {option.name}
                      </CommandItem>
                    ))
                ) : null}
                {!isLoading ? (
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                ) : null}
              </CommandGroup>
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
  );
}