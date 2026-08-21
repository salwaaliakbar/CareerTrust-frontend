"use client";

import { useState } from "react";
import { PlayCircle, X } from "lucide-react";
import DemoVideoModal from "./DemoVideoModal";

export default function DemoAnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <div className="relative z-50 overflow-hidden bg-linear-to-r from-[#0C2B4E] via-[#123560] to-[#1A4779]">
        {/* soft ambient glow drifting behind the text — draws the eye without a harsh blink */}
        <div className="pulse-slow pointer-events-none absolute -top-8 left-1/4 h-24 w-24 rounded-full bg-[#8ad2ff]/25 blur-3xl" />
        <div className="pulse-slow animation-delay-700 pointer-events-none absolute -top-8 right-1/4 h-24 w-24 rounded-full bg-[#f4c56a]/20 blur-3xl" />

        <div className="relative mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
          <button
            onClick={() => setVideoOpen(true)}
            className="group flex flex-1 items-center justify-center gap-2 text-center sm:justify-start"
          >
            <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8ad2ff]/50" />
              <PlayCircle className="relative h-4 w-4 text-[#8ad2ff] transition-transform group-hover:scale-110" />
            </span>
            <span className="text-xs font-medium text-white/95 sm:text-sm">
              <span className="font-semibold text-[#8ad2ff]">AI/ML features are disabled in this deployment</span>
              <span className="hidden sm:inline"> — free-tier hosting doesn&apos;t support the model size. Full demonstration here.</span>
            </span>
            <span className="glow-pulse ml-1 shrink-0 rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white transition-colors group-hover:bg-white/20">
              View Demo
            </span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="relative shrink-0 rounded-full p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <DemoVideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </>
  );
}
