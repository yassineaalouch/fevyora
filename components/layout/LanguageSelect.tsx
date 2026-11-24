"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const languages = ["Français"] as const;

export function LanguageSelect() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<(typeof languages)[number]>("Français");
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-2 text-sm text-ivory/90 transition hover:text-ivory"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        {language}
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Langue"
          className="absolute bottom-full right-0 z-10 mb-2 min-w-36 overflow-hidden rounded-xl border border-white/10 bg-[#3d0e18] py-1 shadow-lg"
        >
          {languages.map((item) => (
            <li key={item} role="option" aria-selected={item === language}>
              <button
                type="button"
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-ivory hover:bg-white/10"
                onClick={() => {
                  setLanguage(item);
                  setOpen(false);
                }}
              >
                {item}
                {item === language ? <span aria-hidden="true">✓</span> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
