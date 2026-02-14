import { getDayNumber } from "@/utils/challengeRules";
import { format } from "date-fns";
import { useStore } from "@/store/useStore";
import { phrases } from "@/utils/phrases";

export function PhrasesDaily() {
  const profile = useStore((s) => s.profile);

  if (!profile) return null;

  const today = format(new Date(), "yyyy-MM-dd");
  const dayNumber = getDayNumber(profile.challengeStartDate, today);
  const phrase = phrases[dayNumber - 1];

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-neutral-900">Frase do dia</h2>
      <p className="mt-2 italic text-neutral-600">
        &ldquo;{phrase.quote}&rdquo;
        <span className="not-italic"> — {phrase.author}</span>
      </p>
    </div>
  );
}
