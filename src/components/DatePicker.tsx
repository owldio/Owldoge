"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
const EN_MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

const toIso = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const formatDisplay = (iso: string): string => {
  const date = new Date(`${iso}T00:00:00`);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}年${mm}月${dd}日（週${WEEKDAYS[date.getDay()]}）`;
};

interface DatePickerProps {
  /** ISO yyyy-mm-dd, or "" when unset. */
  value: string;
  onChange: (iso: string) => void;
  name?: string;
  required?: boolean;
}

/**
 * DatePicker — a programme-styled calendar popover replacing the native
 * date input (whose popup cannot be themed). Future dates only; the value
 * stays an ISO string so form state and submission are unchanged. A
 * visually-hidden native input carries the `required` constraint.
 */
export default function DatePicker({ value, onChange, name, required }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = value ? new Date(`${value}T00:00:00`) : null;

  const [viewYear, setViewYear] = useState(() => (selected ?? today).getFullYear());
  const [viewMonth, setViewMonth] = useState(() => (selected ?? today).getMonth());

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const togglePicker = () => {
    if (!isOpen) {
      const base = selected ?? today;
      setViewYear(base.getFullYear());
      setViewMonth(base.getMonth());
    }
    setIsOpen((prev) => !prev);
  };

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const firstOffset = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={togglePicker}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 border border-hairline-strong bg-night-raised/40 px-4 py-3 text-left text-base font-light transition-colors duration-300 hover:border-copper/60 focus:border-copper focus:outline-none"
      >
        <span className={value ? "text-parchment" : "text-parchment-faint"}>
          {value ? formatDisplay(value) : "選擇日期"}
        </span>
        <CalendarDays className="h-4 w-4 shrink-0 text-copper" />
      </button>

      {/* Carries the required constraint for native form validation. */}
      <input
        type="date"
        name={name}
        value={value}
        required={required}
        onChange={() => {}}
        tabIndex={-1}
        aria-hidden
        className="sr-only pointer-events-none absolute bottom-0 left-0"
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="選擇演出日期"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-[300px] border border-hairline bg-night-deep p-5 shadow-[0_18px_50px_rgba(0,0,0,0.55)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={goPrevMonth}
                disabled={!canGoPrev}
                aria-label="上個月"
                className="flex h-8 w-8 items-center justify-center border border-transparent text-parchment-dim transition-colors duration-200 hover:border-hairline hover:text-copper-bright disabled:cursor-not-allowed disabled:text-parchment-faint/40 disabled:hover:border-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-center">
                <div className="font-serif text-base font-light tracking-[0.08em] text-parchment">
                  {viewYear} 年 {viewMonth + 1} 月
                </div>
                <div className="mt-0.5 font-mono text-[9px] tracking-[0.35em] text-copper">
                  {EN_MONTHS[viewMonth]}
                </div>
              </div>
              <button
                type="button"
                onClick={goNextMonth}
                aria-label="下個月"
                className="flex h-8 w-8 items-center justify-center border border-transparent text-parchment-dim transition-colors duration-200 hover:border-hairline hover:text-copper-bright"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-2 grid grid-cols-7">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="flex h-8 items-center justify-center font-mono text-[10px] tracking-[0.2em] text-parchment-faint"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {Array.from({ length: firstOffset }).map((_, index) => (
                <span key={`blank-${index}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const date = new Date(viewYear, viewMonth, day);
                const iso = toIso(date);
                const isPast = date < today;
                const isSelected = iso === value;
                const isToday = iso === toIso(today);
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={isPast}
                    onClick={() => {
                      onChange(iso);
                      setIsOpen(false);
                    }}
                    className={`flex h-9 items-center justify-center text-sm font-light transition-colors duration-200 ${
                      isSelected
                        ? "bg-copper text-night"
                        : isPast
                          ? "cursor-not-allowed text-parchment-faint/40"
                          : "text-parchment hover:bg-night-raised hover:text-copper-bright"
                    } ${isToday && !isSelected ? "border border-copper/50" : ""}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
