"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface NavDropdownProps {
  isMobile?: boolean;
}

const NavDropdown = ({ isMobile = false }: NavDropdownProps) => {
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();
  const [guestRoleMenuOpen, setGuestRoleMenuOpen] = useState(false);
  const guestRoleMenuRef = useRef<HTMLDivElement | null>(null);

  const userRole = user?.unsafeMetadata?.role as string | undefined;
  const isJobseeker = isSignedIn && userRole === "jobseeker";
  const dashboardHref =
    isSignedIn && userRole === "employer"
      ? "/employer/dashboard"
      : "/jobseeker/dashboard";

  useEffect(() => {
    if (isMobile || isSignedIn) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        guestRoleMenuRef.current &&
        !guestRoleMenuRef.current.contains(event.target as Node)
      ) {
        setGuestRoleMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setGuestRoleMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobile, isSignedIn]);

  const signedInNavItems = [
    {
      href: dashboardHref,
      label: "Dashboard",
    },
    ...(isJobseeker
      ? [
          { href: "/jobs", label: "Jobs" },
          { href: "/companies", label: "Companies" },
        ]
      : []),
    { href: "/about", label: "About" },
    { href: "/features", label: "Features" },
    { href: "/services", label: "Services" },
    { href: "/blogs", label: "Blogs" },
    { href: "/contact", label: "Contact" },
  ];

  const guestNavItems = [
    { href: "/about", label: "About" },
    { href: "/features", label: "Features" },
    { href: "/services", label: "Services" },
    { href: "/blogs", label: "Blogs" },
    { href: "/contact", label: "Contact" },
  ];

  const guestRoleItems = [
    { href: "/jobseeker", label: "Jobseeker" },
    { href: "/employer", label: "Employer" },
  ];

  const isActiveRoute = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const navItems = isSignedIn ? signedInNavItems : guestNavItems;
  const isGuestRoleActive = guestRoleItems.some((item) => isActiveRoute(item.href));

  // Mobile View - Full Width Navigation
  if (isMobile) {
    return (
      <div className="flex flex-col gap-2 w-full">
        {!isSignedIn && (
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <button
              type="button"
              className={`w-full flex items-center justify-between px-4 py-3 font-semibold transition-all ${
                isGuestRoleActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => setGuestRoleMenuOpen((prev) => !prev)}
            >
              <span>Home</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  guestRoleMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {guestRoleMenuOpen && (
              <div className="border-t border-slate-200 bg-white">
                {guestRoleItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-3 rounded-none font-semibold transition-all ${
                      isActiveRoute(item.href)
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                    onClick={() => setGuestRoleMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-3 rounded-lg font-semibold transition-all ${
              isActiveRoute(item.href)
                ? "bg-blue-100 text-blue-700 border-l-4 border-blue-600"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    );
  }

  // Desktop View - Inline Navigation
  return (
    <div className="hidden md:flex items-center gap-1 lg:gap-2 flex-wrap">
      {!isSignedIn && (
        <div className="relative" ref={guestRoleMenuRef}>
          <button
            type="button"
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 inline-flex items-center gap-1 ${
              isGuestRoleActive
                ? "bg-blue-100 text-blue-700 shadow-sm"
                : "text-slate-700 hover:bg-blue-50 hover:text-blue-900"
            }`}
            onClick={() => setGuestRoleMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
          >
            Home
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                guestRoleMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {guestRoleMenuOpen && (
            <div className="absolute left-0 mt-2 w-44 rounded-xl border border-blue-100 bg-white shadow-[0_16px_40px_-18px_rgba(15,23,42,0.45)] z-50 py-1.5">
              {guestRoleItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2.5 text-sm font-semibold transition-all duration-150 ${
                    isActiveRoute(item.href)
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-900"
                  }`}
                  onClick={() => setGuestRoleMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            isActiveRoute(item.href)
              ? "bg-blue-100 text-blue-700 shadow-sm"
              : "text-slate-700 hover:bg-blue-50 hover:text-blue-900"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default NavDropdown;
