import { Radar, ShieldCheck, Sparkles, Star } from "lucide-react";
import { CompanyReputation } from "@/services/api/reputation.service";

type Props = {
  reputation: CompanyReputation | null;
};

const BAR_WIDTH_CLASSES = [
  "w-0",
  "w-[5%]",
  "w-[10%]",
  "w-[15%]",
  "w-[20%]",
  "w-[25%]",
  "w-[30%]",
  "w-[35%]",
  "w-[40%]",
  "w-[45%]",
  "w-[50%]",
  "w-[55%]",
  "w-[60%]",
  "w-[65%]",
  "w-[70%]",
  "w-[75%]",
  "w-[80%]",
  "w-[85%]",
  "w-[90%]",
  "w-[95%]",
  "w-full",
] as const;

const getBarWidthClass = (score: number) => {
  const ratio = Math.max(0, Math.min(1, score / 5));
  const step = Math.round(ratio * (BAR_WIDTH_CLASSES.length - 1));
  return BAR_WIDTH_CLASSES[step];
};

const aspectRows = (reputation: CompanyReputation) => [
  { label: "Work-Life Balance", value: reputation.aspectScores.workLifeBalance },
  { label: "Company Culture", value: reputation.aspectScores.companyCulture },
  { label: "Career Growth", value: reputation.aspectScores.careerGrowth },
  { label: "Salary & Benefits", value: reputation.aspectScores.salaryBenefits },
];

export default function ReputationScoreCard({ reputation }: Props) {
  if (!reputation) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Reputation Score
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Aspect-based reputation is currently unavailable.
        </p>
      </section>
    );
  }

  const stable = reputation.status.isStable;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#dbe7ff] bg-linear-to-br from-[#f7faff] via-white to-[#f2f8ff] shadow-[0_14px_30px_-20px_rgba(12,38,89,0.5)]">
      <div className="h-1 w-full bg-linear-to-r from-[#1451a5] via-[#1f7bb8] to-[#36a86f]" />
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1451a5]">
              Anonymous Reputation Core
            </p>
            <h3 className="mt-2 text-xl font-black text-slate-900">
              Aspect-Based Reputation Score
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
            {stable ? <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> : <Radar className="h-3.5 w-3.5 text-amber-600" />}
            {stable ? "Stable Signal" : "Emerging Signal"}
          </span>
        </div>

        <div className="mt-5 flex items-end gap-3">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-[#0f2f66] px-4 py-3 text-white shadow-lg">
            <Star className="h-5 w-5 fill-amber-300 text-amber-300" />
            <p className="text-2xl font-black">{reputation.reputationScore.toFixed(1)}</p>
            <p className="text-sm text-blue-200">/5</p>
          </div>
          <p className="text-sm text-slate-500">
            Calculated from anonymous employee review sentiment.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {aspectRows(reputation).map((aspect) => (
            <div key={aspect.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{aspect.label}</span>
                <span className="font-semibold text-slate-900">{aspect.value.toFixed(1)}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200">
                <div
                  className={`h-2 rounded-full bg-linear-to-r from-[#1451a5] via-[#1f7bb8] to-[#36a86f] ${getBarWidthClass(aspect.value)}`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-white/80 px-4 py-3">
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-[#1f7bb8]" />
            Reputation Signal
          </p>
          <p className="mt-1 text-sm text-slate-600">{reputation.message}</p>
        </div>
      </div>
    </section>
  );
}
