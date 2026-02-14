import { useMemo } from "react";
import { format, parseISO, addWeeks, startOfWeek, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useStore } from "@/store/useStore";

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function getLevelColor(level: number): string {
  switch (level) {
    case 4:
      return "bg-emerald-600";
    case 3:
      return "bg-emerald-500";
    case 2:
      return "bg-emerald-400";
    case 1:
      return "bg-emerald-200";
    default:
      return "bg-neutral-100";
  }
}

export function Heatmap() {
  const profile = useStore((s) => s.profile);
  const progressByDate = useStore((s) => s.progressByDate);
  const getHeatmapData = useStore((s) => s.getHeatmapData);

  const { dataByDate } = useMemo(() => {
    if (!profile) return { dataByDate: {} as Record<string, number> };
    const data = getHeatmapData(profile.challengeStartDate);
    const dataByDate: Record<string, number> = {};
    data.forEach((d) => {
      dataByDate[d.date] = d.level;
    });
    return { dataByDate };
  }, [profile, progressByDate, getHeatmapData]);

  const grid = useMemo(() => {
    if (!profile)
      return { rows: [] as number[][], monthLabels: [] as string[] };
    const start = parseISO(profile.challengeStartDate);
    const weekStart = startOfWeek(start, { weekStartsOn: 0 });
    const monthLabels: string[] = [];
    const rows: number[][] = Array(7)
      .fill(null)
      .map(() => []);
    const totalWeeks = 19;
    for (let w = 0; w < totalWeeks; w++) {
      const weekBegin = addWeeks(weekStart, w);
      if (w === 0 || format(weekBegin, "d") <= "7") {
        const m = format(weekBegin, "MMM", { locale: ptBR });
        if (!monthLabels.includes(m)) monthLabels.push(m);
      }
      for (let d = 0; d < 7; d++) {
        const cellDate = addDays(weekBegin, d);
        const key = format(cellDate, "yyyy-MM-dd");
        const level = dataByDate[key] ?? 0;
        rows[d].push(level);
      }
    }
    return { rows, monthLabels };
  }, [profile, dataByDate]);

  if (!profile) return null;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-neutral-900">
        Seu Progresso
      </h2>
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          <div className="flex flex-col gap-[2px] pr-2 text-xs text-neutral-500">
            {WEEKDAY_LABELS.map((l) => (
              <div key={l} className="flex h-4 items-center">
                {l}
              </div>
            ))}
          </div>
          <div className="flex gap-0.5">
            {grid.rows[0]?.map((_, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-0.5">
                {grid.rows.map((row, rowIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`h-4 w-4 rounded-sm ${getLevelColor(row[colIndex] ?? 0)}`}
                    title={`Col ${colIndex} Dia ${rowIndex}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
          <span>Menos</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <div key={l} className={`h-4 w-4 rounded-sm ${getLevelColor(l)}`} />
          ))}
          <span>Mais</span>
        </div>
      </div>
    </div>
  );
}
