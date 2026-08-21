"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export const DEMO_VIDEO_EMBED_URL =
  "https://drive.google.com/file/d/1OHbpxpA-Cr3Ty2lUqKvng1T5XsgXxJTV/preview";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function DemoVideoModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Product demo video"
      className="fixed inset-0 z-200 flex items-center justify-center bg-[#04101f]/85 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close demo video"
          className="absolute top-3 right-3 z-10 rounded-full bg-white/10 p-2 text-white/90 backdrop-blur-md transition-colors hover:bg-white/20"
        >
          <X size={18} />
        </button>

        <div className="aspect-video w-full">
          <iframe
            src={DEMO_VIDEO_EMBED_URL}
            title="CareerTrust product demo"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
