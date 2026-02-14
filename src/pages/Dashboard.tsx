import { Heatmap } from "@/components/dashboard/Heatmap";
import { DailyScoreCard } from "@/components/dashboard/DailyScoreCard";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { HabitList } from "@/features/habits/HabitList";
import { useStore } from "@/store/useStore";
import { PhrasesDaily } from "@/components/dashboard/Phrases";

export function Dashboard() {
  const profile = useStore((s) => s.profile);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Olá, {profile?.name ?? "usuário"}
        </h1>
        <p className="mt-1 text-neutral-500">Faça o hoje valer a pena.</p>
      </div>

      <StatsCards />
      <DailyScoreCard />
      <Heatmap />
      <HabitList />

      <PhrasesDaily />
    </div>
  );
}
