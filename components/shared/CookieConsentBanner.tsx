"use client";

import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "ct-cookie-consent";

export default function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = window.localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const showTimer = setTimeout(() => setVisible(true), 600);
      const mountTimer = setTimeout(() => setMounted(true), 650);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(mountTimer);
      };
    }
  }, []);

  const dismiss = () => {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setMounted(false);
    setTimeout(() => setVisible(false), 300);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className={`fixed inset-x-0 bottom-0 z-100 px-4 pb-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm sm:px-0 sm:pb-0 transition-all duration-300 ease-out ${
        mounted
          ? "translate-y-0 opacity-100"
          : "translate-y-6 opacity-0"
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-xl shadow-2xl ring-1 ring-black/5">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-600 via-indigo-500 to-purple-600" />

        <button
          onClick={dismiss}
          aria-label="Dismiss cookie banner"
          className="absolute top-3 right-3 rounded-full p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="p-5 pr-9">
          <div className="flex items-start gap-3">
            <div className="shrink-0 rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <Cookie size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                We value your privacy
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                We use cookies to enhance your browsing experience and improve
                CareerTrust. By clicking &ldquo;Accept&rdquo;, you agree to
                our use of cookies.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              onClick={dismiss}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={dismiss}
              className="rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
