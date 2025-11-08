"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function DropdownMenu({
  login,
  signup,
}: {
  login: string;
  signup: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="md:hidden" ref={ref}>
      <button
        aria-controls="mobile-menu"
        aria-label="Toggle menu"
        onClick={() => setOpen((s) => !s)}
        className="p-2 rounded-md hover:bg-gray-100"
      >
        {open ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      <div
        id="mobile-menu"
        className={
          "absolute right-4 mt-2 w-56 bg-white border rounded shadow-lg z-50 transition-all " +
          (open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none")
        }
      >
        <ul className="menu p-3">
          <li>
            <Link href="/jobs" onClick={() => setOpen(false)}>
              Find Jobs
            </Link>
          </li>
          <li>
            <Link href="/companies" onClick={() => setOpen(false)}>
              Companies
            </Link>
          </li>
          <li>
            <Link href="#features" onClick={() => setOpen(false)}>
              Features
            </Link>
          </li>
          <li>
            <Link href="#about" onClick={() => setOpen(false)}>
              About
            </Link>
          </li>
          <li className="mt-2">
            <Link
              href={login}
              className="w-full px-3 py-2 border border-blue-600 text-blue-600 rounded-md text-sm block text-center"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          </li>
          <li className="mt-2">
            <Link
              href={signup}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-md text-sm block text-center"
              onClick={() => setOpen(false)}
            >
              Get Started
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
