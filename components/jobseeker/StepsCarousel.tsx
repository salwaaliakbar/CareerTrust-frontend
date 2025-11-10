"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const STEPS = [
  {
    id: 1,
    short: "01",
    title: "Login / Sign up",
    description:
      "Create a free CareerTrust account using email or social sign-in. Your account saves searches, tracks applications, and unlocks personalized recommendations and quick-apply features.",
    img: "/assets/images/PhoneImg.png",
  },
  {
    id: 2,
    short: "02",
    title: "Upload Resume / Create Profile",
    description:
      "Upload your CV or build a verified profile step-by-step. We extract key details (experience, education, skills) so your profile is searchable by top employers and ready for one-click applications.",
    img: "/assets/images/general1 - Copy.png",
  },
  {
    id: 3,
    short: "03",
    title: "Personalized Job Recommendation",
    description:
      "Receive tailored job recommendations powered by our AI matching engine. Matches improve as you interact — the system learns from your applications, profile, and saved preferences to surface the best opportunities.",
    img: "/assets/images/general2.png",
  },
  {
    id: 4,
    short: "04",
    title: "Quick Apply",
    description:
      "Quick Apply lets you submit to multiple roles instantly using your saved profile and resume. Track applications in one place and follow up with recommended messages to hiring teams.",
    img: "/assets/images/PhoneImg - Copy.png",
  },
  {
    id: 5,
    short: "05",
    title: "Job Alert Emails",
    description:
      "Stay informed with customizable job alerts — get emails when new roles match your skills, preferred locations, or companies you follow so you never miss opportunities.",
    img: "/assets/images/general2.png",
  },
  {
    id: 6,
    short: "06",
    title: "Employment Verification History",
    description:
      "Keep a verifiable employment history that employers can trust. Share verification badges on your profile and speed up hiring by proving past roles and responsibilities.",
    img: "/assets/images/general1 - Copy.png",
  },
];

export default function StepsCarousel({ intervalMs = 6000 }: { intervalMs?: number }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    startTimer();
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function startTimer() {
    stopTimer();
    timerRef.current = window.setTimeout(() => {
      setIndex((i) => (i + 1) % STEPS.length);
    }, intervalMs);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function goTo(i: number) {
    setIndex(i);
    startTimer();
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    stopTimer();
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) setIndex((i) => Math.min(i + 1, STEPS.length - 1));
      else setIndex((i) => Math.max(i - 1, 0));
    }
    touchStartX.current = null;
    startTimer();
  }

  return (
    <section className="py-16 px-4 bg-linear-to-b from-[#F4F4F4] via-[#0C2B4E]/8 to-white relative overflow-hidden">
        {/* subtle brand orb */}
        <div className="absolute -right-20 -top-16 w-[480px] h-[480px] rounded-full blur-3xl bg-linear-to-br from-[#0C2B4E]/12 via-[#1A3D64]/10 to-transparent pointer-events-none -z-10" />
        {/* left blue overlay stripe for stronger tint */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute left-0 top-0 w-1/3 h-full bg-linear-to-r from-[#0C2B4E]/8 via-[#1A3D64]/6 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0C2B4E]">Making your job search easier</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {"Personalized job recommendations tailored to our skills and preferences."}
          </p>
        </div>
        </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          <div className="md:flex-1">
            <div
              onMouseEnter={stopTimer}
              onMouseLeave={startTimer}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              className="relative bg-white rounded-2xl shadow-md overflow-hidden"
            >
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={`p-8 md:p-12 transition-opacity duration-700 ${i === index ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"}`}
                >
                  <div className="items-center">
                    <div>
                      <h3 className="text-2xl font-extrabold text-gray-900 mb-4">{s.title}</h3>
                      <p className="text-gray-600 mb-6">{s.description}</p>

                    </div>

                    <div className="w-full flex justify-center">
                      <div className="w-full max-w-lg h-40 md:h-50 lg:h-60 relative">
                        <Image src={s.img} alt={s.title} fill className="rounded-xl object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* pagination dots for quick jump */}
            <div className="flex items-center justify-center gap-3 mt-6">
              {STEPS.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to step ${i + 1}`}
                //   aria-pressed={i === index ? "true" : undefined}
                  className={`w-3 h-3 rounded-full ${i === index ? "bg-[#0C2B4E]" : "bg-gray-300"}`}
                />
              ))}
            </div>
          </div>

          <nav className="md:w-1/2 px-8">
            <div className="flex flex-col md:gap-4">
              {STEPS.map((s, i) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => goTo(i)}
                  className={`text-left p-4 rounded-lg mb-2 w-full flex items-center gap-4 transition shadow-sm ${
                    i === index ? "bg-white shadow-lg" : "bg-white/60"
                  }`}
                  aria-current={i === index ? "true" : undefined}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i === index ? "bg-[#0C2B4E] text-white" : "bg-sky-100 text-[#0C2B4E]"}`}>
                    {s.short}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">{s.title}</div>
                    {/* show a short preview in the nav for all items, and keep the full depth text in the detail area */}
                    <div className="text-sm text-gray-600 mt-1">
                      {i === index ? s.description : s.description.length > 70 ? `${s.description.slice(0,70).trim()}…` : s.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
}
