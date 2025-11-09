"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function HomeDropdown() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const menuId = "home-dropdown-menu"

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
        className="flex items-center gap-1 text-gray-600 hover:text-primary font-medium transition-colors"
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
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <ul id={menuId} aria-label="Home submenu" className="py-1">
            <li>
              <Link
                href="/jobseeker"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
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
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
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
