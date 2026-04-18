import type { LucideIcon } from "lucide-react";

type ServiceCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  delayClass?: string;
};

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  delayClass = "",
}: ServiceCardProps) {
  return (
    <article
      className={`fade-in-up group rounded-2xl border border-[#d6e7f6] bg-white p-6 shadow-[0_14px_34px_-24px_rgba(11,34,58,0.65)] transition-all duration-300 hover:-translate-y-1 hover:border-[#aacdec] hover:shadow-[0_22px_40px_-24px_rgba(11,34,58,0.72)] ${delayClass}`}
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#c8def2] bg-[#e8f2fb] text-[#0c2b4e] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#d9ecfb]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-[#102d4a]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#546d85]">{description}</p>
    </article>
  );
}
