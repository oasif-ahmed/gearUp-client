
"use client";

import { useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GearSearchBarProps {
  defaultValue?: string;
}

export default function GearSearchBar({
  defaultValue = "",
}: GearSearchBarProps) {
  const [isOpen, setIsOpen] = useState(!!defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <form method="GET" className="flex items-center justify-end gap-2">
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "w-64 sm:w-80 opacity-100" : "w-0 opacity-0"
        }`}
      >
        <Input
          ref={inputRef}
          name="search"
          defaultValue={defaultValue}
          placeholder="Search gear items..."
          className="h-10 rounded-none border-border bg-background text-xs font-mono text-foreground focus-visible:ring-ring"
          tabIndex={isOpen ? 0 : -1}
        />
      </div>

      {isOpen && (
        <Button
          type="submit"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-none bg-primary text-primary-foreground hover:opacity-90"
          aria-label="Submit search"
        >
          <Search className="h-4 w-4" />
        </Button>
      )}

      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={handleToggle}
        className="h-10 w-10 shrink-0 rounded-none border-border bg-background text-foreground"
        aria-label={isOpen ? "Close search" : "Open search"}
      >
        {isOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
