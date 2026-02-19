import { useRef, useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarPopover } from "./CalendarPopover";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
  className?: string;
  showFormatted?: boolean;
}

export function DatePicker({
  value,
  onChange,
  min,
  max,
  placeholder = "Escolher data",
  className = "",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const formatted = value
    ? (() => {
        try {
          return format(parseISO(value), "d 'de' MMM. yyyy", { locale: ptBR });
        } catch {
          return value;
        }
      })()
    : "";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
        className={`
          flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl
          border-2 border-neutral-200 bg-white transition-colors
          hover:border-neutral-300 hover:bg-neutral-50/50
          focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:ring-offset-2
          ${open ? "border-neutral-900 ring-2 ring-neutral-900/20" : ""}
        `}
      >
        <div className="flex shrink-0 items-center justify-center bg-neutral-100 px-3 py-2.5 text-neutral-500">
          <Calendar className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="min-h-[44px] flex-1 py-2.5 pr-4">
          <span
            className={
              value ? "text-neutral-900 font-medium" : "text-neutral-400"
            }
          >
            {formatted || placeholder}
          </span>
        </div>
      </div>

      {open && (
        <CalendarPopover
          value={value}
          onChange={(dateStr) => {
            onChange(dateStr);
          }}
          onClose={() => setOpen(false)}
          min={min}
          max={max}
        />
      )}
    </div>
  );
}
