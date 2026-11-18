"use client";

import { useEffect, useId, useRef, useState } from "react";

export type ChoiceOption = { value: string; text: string };

// One choice inside the home page's search sentence: a rounded pill that opens a small,
// quiet menu. The picked value is sent with the form through a hidden input.
export default function SentenceChoice({
  name,
  label,
  placeholder,
  options,
}: {
  name: string;
  label: string;
  placeholder: string;
  options: ChoiceOption[];
}) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [alignRight, setAlignRight] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  // The first entry clears the choice, so the parent can go back to "any".
  const all: ChoiceOption[] = [{ value: "", text: placeholder }, ...options];
  const current = all.find((o) => o.value === value) ?? all[0];
  const picked = value !== "";

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    listRef.current?.focus();
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  const openMenu = () => {
    // Open towards the left when the pill sits near the right edge of the screen.
    const rect = buttonRef.current?.getBoundingClientRect();
    setAlignRight(!!rect && rect.left + 240 > window.innerWidth);
    setActive(Math.max(0, all.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const choose = (option: ChoiceOption) => {
    setValue(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onListKey = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(all.length - 1, i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(all[active]);
    } else if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
      if (event.key === "Escape") buttonRef.current?.focus();
    }
  };

  return (
    <span ref={rootRef} className="relative inline-flex">
      <input type="hidden" name={name} value={value} />
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${label}: ${current.text}`}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openMenu();
          }
        }}
        className={`inline-flex items-center gap-3 rounded-full border px-5 py-1.5 font-display text-[0.86em] leading-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 focus-visible:ring-offset-2 ${
          picked
            ? "border-leaf bg-leaf text-white"
            : "border-leaf/15 bg-leaf-soft text-leaf hover:border-leaf/40"
        }`}
      >
        <span className="pt-[0.08em]">{current.text}</span>
        <svg
          viewBox="0 0 12 8"
          aria-hidden="true"
          className={`h-2 w-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${listId}-${active}`}
          onKeyDown={onListKey}
          className={`absolute top-full z-30 mt-2 max-h-80 min-w-[13rem] overflow-auto rounded-xl border border-line bg-white py-2 font-body text-[0.95rem] leading-normal text-ink shadow-[0_12px_32px_-12px_rgba(15,42,34,0.25)] focus:outline-none ${
            alignRight ? "right-0" : "left-0"
          }`}
        >
          {all.map((option, index) => {
            const selected = option.value === value;
            return (
              <li
                key={option.value || "any"}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(option)}
                className={`flex cursor-pointer items-center justify-between gap-6 px-4 py-2.5 ${
                  index === active ? "bg-leaf-soft/70" : ""
                } ${index === 0 ? "text-granite" : ""} ${selected ? "font-semibold text-leaf" : ""}`}
              >
                <span className="whitespace-nowrap">{option.text}</span>
                {selected && (
                  <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-brass">
                    <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </span>
  );
}
