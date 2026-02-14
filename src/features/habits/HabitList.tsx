import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { getDailyTaskIds, getDailyTarget } from "@/utils/challengeRules";
import type { HabitId } from "@/types";
import { format } from "date-fns";
import { Check } from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";

const LABELS: Record<HabitId, string> = {
  apply_2_jobs: "Aplicar para 2 vagas",
  linkedin_comment: "Comentar em 1 post (LinkedIn)",
  linkedin_likes: "Curtir 2 posts (LinkedIn)",
  follow_recruiter: "Seguir 1 tech recruiter",
  english_study: "Estudo de inglês (30 min)",
  mock_interview: "Mock Interview (1/semana)",
  module_prospeccao: "Módulo Prospecção (1/mês)",
  module_processo: "Módulo Processo Seletivo (1/mês)",
  module_networking: "Módulos Networking (1/mês)",
  record_interview: "Gravar 1 entrevista (1/mês)",
  feedback_after_3: "Coletar feedback (após 3 entrevistas)",
  cv_versions: "4 versões do CV",
  spreadsheet_updated: "Planilha da maratona atualizada",
};

export function HabitList() {
  const profile = useStore((s) => s.profile);
  const selectedDate = useStore((s) => s.selectedDate);
  const setSelectedDate = useStore((s) => s.setSelectedDate);
  const resetDraftForDate = useStore((s) => s.resetDraftForDate);
  const habitCompletionsDraft = useStore((s) => s.habitCompletionsDraft);
  const setHabitCompletion = useStore((s) => s.setHabitCompletion);
  const saveDay = useStore((s) => s.saveDay);

  useEffect(() => {
    resetDraftForDate(selectedDate);
  }, [selectedDate, resetDraftForDate]);

  if (!profile) return null;

  const dailyIds = getDailyTaskIds(profile.englishLevel);
  const today = format(new Date(), "yyyy-MM-dd");

  const handleToggle = (habitId: HabitId) => {
    const target = getDailyTarget(habitId);
    const current =
      habitCompletionsDraft.find((h) => h.habitId === habitId)?.value ?? 0;
    const isCompleted = current >= target;
    setHabitCompletion(habitId, isCompleted ? 0 : target);
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Rastreador</h2>
          <p className="text-sm text-neutral-500">Consistência é a chave.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            placeholder="Escolher data"
            className="min-w-[200px]"
          />
          <button
            type="button"
            onClick={() => setSelectedDate(today)}
            className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
          >
            Hoje
          </button>
        </div>
      </div>
      <ul className="space-y-2">
        {dailyIds.map((habitId) => {
          const target = getDailyTarget(habitId);
          const current =
            habitCompletionsDraft.find((h) => h.habitId === habitId)?.value ??
            0;
          const checked = current >= target;
          const unit = habitId === "english_study" ? " min" : "";
          return (
            <li key={habitId}>
              <button
                type="button"
                onClick={() => handleToggle(habitId)}
                className={`flex w-full items-center gap-4 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                  checked
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                    checked
                      ? "border-white bg-white text-neutral-900"
                      : "border-neutral-300 bg-transparent"
                  }`}
                >
                  {checked ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : null}
                </span>
                <span className="font-medium">{LABELS[habitId]}</span>
                <span className="ml-auto text-sm opacity-80">
                  {target}
                  {unit}/dia
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {selectedDate === today && (
        <button
          type="button"
          onClick={saveDay}
          className="mt-4 w-full rounded-xl bg-neutral-900 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Salvar dia
        </button>
      )}
    </div>
  );
}
