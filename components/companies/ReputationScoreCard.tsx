import { Radar, ShieldCheck, Sparkles, Star } from "lucide-react";
import { CompanyReputation } from "@/services/api/reputation.service";

type Props = {
  reputation: CompanyReputation | null;
  variant?: "default" | "employer";
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

export default function ReputationScoreCard({
  reputation,
  variant = "default",
}: Props) {
  const isEmployer = variant === "employer";

  if (!reputation) {
    return (
      <section
        className={`rounded-2xl border p-5 shadow-sm ${
          isEmployer
            ? "border-blue-100 bg-linear-to-br from-white via-slate-50 to-blue-50"
            : "border-slate-200 bg-white"
        }`}
      >
        <p
          className={`text-sm font-semibold uppercase tracking-[0.2em] ${
            isEmployer ? "text-blue-700" : "text-slate-400"
          }`}
        >
          {isEmployer ? "Company Reputation" : "Reputation Score"}
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Aspect-based reputation is currently unavailable.
        </p>
      </section>
    );
  }

  const stable = reputation.status.isStable;

  return (
    <section className={`overflow-hidden rounded-2xl border bg-linear-to-br transition-all duration-300 ${
      isEmployer 
        ? "border-blue-200/90 from-[#f7faff] via-white to-[#eef6ff] ring-1 ring-blue-100 shadow-[0_24px_55px_-28px_rgba(30,64,175,0.55),0_10px_24px_-18px_rgba(15,23,42,0.45)] hover:shadow-[0_30px_70px_-30px_rgba(30,64,175,0.58),0_14px_28px_-20px_rgba(15,23,42,0.45)]"
        : "border-[#dbe7ff] from-[#f7faff] via-white to-[#f2f8ff] shadow-[0_14px_30px_-20px_rgba(12,38,89,0.5)]"
    }`}>
      <div className="h-1 w-full bg-linear-to-r from-[#1451a5] via-[#1f7bb8] to-[#36a86f]" />
      {isEmployer && (
        <div className="pointer-events-none h-12 w-full bg-linear-to-b from-blue-200/20 to-transparent" />
      )}
      <div className={`${isEmployer ? "p-4 sm:p-5" : "p-5 sm:p-6"}`}>
        <div className={`flex flex-wrap items-start justify-between gap-2 ${isEmployer ? "mb-3" : "mb-1"}`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1451a5]">
              {isEmployer
                ? "Workforce Sentiment"
                : "Anonymous Reputation Core"}
            </p>
            <h3 className={`mt-1 font-black text-slate-900 ${isEmployer ? "text-lg" : "text-xl"}`}>
              {isEmployer
                ? "Sentiment Overview"
                : "Aspect-Based Reputation Score"}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 whitespace-nowrap shadow-sm">
            {stable ? <ShieldCheck className="h-3 w-3 text-emerald-600" /> : <Radar className="h-3 w-3 text-amber-600" />}
            <span className="hidden sm:inline">{stable ? "Stable" : "Emerging"}</span>
          </span>
        </div>

        <div className={`flex items-end gap-2 ${isEmployer ? "mt-3" : "mt-5"}`}>
          <div className="inline-flex items-center gap-1.5 rounded-2xl border border-blue-800/50 bg-[#0f2f66] px-3 py-2 text-white shadow-[0_10px_24px_-12px_rgba(15,47,102,0.75)]">
            <Star className={`fill-amber-300 text-amber-300 ${isEmployer ? "h-4 w-4" : "h-5 w-5"}`} />
            <p className={`font-black ${isEmployer ? "text-xl" : "text-2xl"}`}>{reputation.reputationScore.toFixed(1)}</p>
            <p className={`text-blue-200 ${isEmployer ? "text-xs" : "text-sm"}`}>/5</p>
          </div>
          {!isEmployer && (
            <p className="text-sm text-slate-500">
              Calculated from anonymous reviews.
            </p>
          )}
        </div>

        {isEmployer && (
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            <div className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 shadow-[0_6px_16px_-12px_rgba(15,23,42,0.35)]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-tight">
                Reviews
              </p>
              <p className="text-sm font-bold text-slate-900">
                {reputation.status.totalAnonymousReviews}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 shadow-[0_6px_16px_-12px_rgba(15,23,42,0.35)]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-tight">
                Quality
              </p>
              <p className="text-xs font-bold text-slate-900 capitalize">
                {reputation.status.label.replace("-", " ")}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 shadow-[0_6px_16px_-12px_rgba(15,23,42,0.35)]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-tight">
                Min Stable
              </p>
              <p className="text-sm font-bold text-slate-900">
                {reputation.status.minimumReviewsForStableScore}
              </p>
            </div>
          </div>
        )}

        <div className={`${isEmployer ? "mt-2 space-y-2" : "mt-5 space-y-3"}`}>
          {aspectRows(reputation).map((aspect) => (
            <div key={aspect.label}>
              <div className={`mb-0.5 flex items-center justify-between ${isEmployer ? "text-xs" : "text-sm"}`}>
                <span className={`font-medium text-slate-700 ${isEmployer ? "line-clamp-1" : ""}`}>{aspect.label}</span>
                <span className="font-semibold text-slate-900 whitespace-nowrap ml-1">{aspect.value.toFixed(1)}</span>
              </div>
              <div className={`rounded-full bg-slate-200 ${isEmployer ? "h-1.5" : "h-2"}`}>
                <div
                  className={`rounded-full bg-linear-to-r from-[#1451a5] via-[#1f7bb8] to-[#36a86f] ${isEmployer ? "h-1.5" : "h-2"} ${getBarWidthClass(aspect.value)}`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className={`${isEmployer ? "mt-2 rounded-lg border border-slate-200 bg-white/85 px-3 py-2 shadow-[0_8px_18px_-14px_rgba(15,23,42,0.4)]" : "mt-5 rounded-xl border border-slate-200 bg-white/80 px-4 py-3"}`}>
          <p className={`inline-flex items-center gap-1 font-semibold uppercase tracking-wide text-slate-500 ${isEmployer ? "text-[10px]" : "text-xs tracking-[0.16em]"}`}>
            <Sparkles className={`text-[#1f7bb8] ${isEmployer ? "h-3 w-3" : "h-3.5 w-3.5"}`} />
            {isEmployer ? "Sentiment" : "Reputation Signal"}
          </p>
          <p className={`${isEmployer ? "mt-0.5 text-xs text-slate-600" : "mt-1 text-sm text-slate-600"}`}>{reputation.message}</p>
        </div>
      </div>
    </section>
  );
}
