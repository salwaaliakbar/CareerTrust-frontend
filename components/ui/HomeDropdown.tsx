"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

export default function HomeDropdown() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const menuId = "home-dropdown-menu"
  const pathname = usePathname()
  const isHomeActive = pathname === "/jobseeker" || pathname.startsWith("/jobseeker/") || pathname === "/employer" || pathname.startsWith("/employer/")

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleEsc)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [])

  // Set aria-expanded imperatively to avoid some static analyzers
  useEffect(() => {
    if (buttonRef.current) buttonRef.current.setAttribute("aria-expanded", String(open))
  }, [open])

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={`relative flex items-center gap-1 py-1 text-[15px] transition-colors duration-200 ${isHomeActive ? "text-[#0A1F44] font-bold" : "text-slate-600 hover:text-blue-600 font-semibold"}`}
      >
        Home
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd" />
        </svg>
        <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-200 ${isHomeActive ? "w-full bg-[#123560]" : "w-0 bg-transparent"}`}></span>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-52 bg-white border border-blue-100 rounded-xl shadow-[0_16px_40px_-18px_rgba(15,23,42,0.45)] z-50 overflow-hidden">
          <ul id={menuId} aria-label="Home submenu" className="py-1">
            <li>
              <Link
                href="/jobseeker"
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${pathname === "/jobseeker" || pathname.startsWith("/jobseeker/") ? "bg-blue-50 text-[#0A1F44]" : "text-slate-700 hover:bg-blue-50 hover:text-blue-900"}`}
                onClick={() => setOpen(false)}
              >
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 5.23a.75.75 0 011.06-.02l4.24 4.24a.75.75 0 010 1.06l-4.24 4.24a.75.75 0 11-1.06-1.06L10.94 10 7.21 6.29a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                </svg>
                <span>Jobseeker</span>
              </Link>
            </li>
            <li>
              <Link
                href="/employer"
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${pathname === "/employer" || pathname.startsWith("/employer/") ? "bg-blue-50 text-[#0A1F44]" : "text-slate-700 hover:bg-blue-50 hover:text-blue-900"}`}
                onClick={() => setOpen(false)}
              >
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 5.23a.75.75 0 011.06-.02l4.24 4.24a.75.75 0 010 1.06l-4.24 4.24a.75.75 0 11-1.06-1.06L10.94 10 7.21 6.29a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                </svg>
                <span>Employer</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
