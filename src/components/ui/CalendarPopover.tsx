import { useState, useEffect } from "react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  isAfter,
} from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarPopoverProps {
  value: string;
  onChange: (dateStr: string) => void;
  onClose: () => void;
  min?: string;
  max?: string;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function CalendarPopover({
  value,
  onChange,
  onClose,
  min,
  max,
}: CalendarPopoverProps) {
  const selectedDate = value ? parseISO(value) : null;
  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(selectedDate || new Date()),
  );

  useEffect(() => {
    if (value) setViewMonth(startOfMonth(parseISO(value)));
  }, [value]);

  const monthStart = viewMonth;
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const minDate = min ? parseISO(min) : null;
  const maxDate = max ? parseISO(max) : null;

  const goPrev = () => {
    const prev = subMonths(monthStart, 1);
    if (minDate && isBefore(prev, startOfMonth(minDate))) return;
    setViewMonth(prev);
  };
  const goNext = () => {
    const next = addMonths(monthStart, 1);
    if (maxDate && isAfter(next, endOfMonth(maxDate))) return;
    setViewMonth(next);
  };

  const handleSelect = (d: Date) => {
    const str = format(d, "yyyy-MM-dd");
    if (minDate && isBefore(d, minDate)) return;
    if (maxDate && isAfter(d, maxDate)) return;
    onChange(str);
    onClose();
  };

  return (
    <div className="absolute left-0 top-full z-50 mt-2 w-[320px] rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Mês anterior"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <span className="text-lg leading-none">‹</span>
        </button>
        <span className="text-sm font-semibold text-neutral-900 capitalize">
          {format(monthStart, "MMMM yyyy", { locale: ptBR })}
        </span>
        <button
          type="button"
          onClick={goNext}
          aria-label="Próximo mês"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <span className="text-lg leading-none">›</span>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-xs font-medium text-neutral-500">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-1.5">
            {day}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-0.5">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isSelected = selectedDate
            ? isSameDay(day, selectedDate)
            : false;
          const isTodayDate = isToday(day);
          const disabled =
            (minDate && isBefore(day, minDate)) ||
            (maxDate && isAfter(day, maxDate));

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled ?? undefined}
              onClick={() => handleSelect(day)}
              className={`
                flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-colors
                ${!isCurrentMonth ? "text-neutral-300" : "text-neutral-900"}
                ${disabled ? "cursor-not-allowed opacity-40" : "hover:bg-neutral-100"}
                ${isSelected ? "bg-neutral-900 text-white hover:bg-neutral-800" : ""}
                ${isTodayDate && !isSelected ? "bg-neutral-100 ring-2 ring-neutral-400" : ""}
              `}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
