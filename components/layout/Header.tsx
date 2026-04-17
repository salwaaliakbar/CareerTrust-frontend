"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  LogOut,
  User,
  DoorOpen,
  MessageSquare,
  Menu,
  X,
  Star,
} from "lucide-react";
import { useNotificationState } from "@/hooks/useNotificationState";
import NotificationSidebar from "@/components/ui/NotificationSidebar";
import NavDropdown from "./NavDropdown";
import Swal from "sweetalert2";
// import { LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/redux/store/hooks";
import { cleanupClientLogout } from "@/lib/auth/logoutCleanup";

const LOGIN = "/login";
const SIGNUP = "/signup";

function Header() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    notifications,
    markAllAsRead,
    markAsRead,
    deleteNotification,
    openHiredForm,
  } = useNotificationState();
  const [showSidebar, setShowSidebar] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const latestNotificationKey = notifications[0]?.id || "no-notification";

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSignOutWithConfirm = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626", // red
      cancelButtonColor: "#6b7280", // gray
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      handleSignOut(); // Call your logout function
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      cleanupClientLogout(dispatch);
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const userRole = user?.unsafeMetadata?.role as string | undefined;
  const isEmployer = isSignedIn && userRole === "employer";
  const isJobseeker = isSignedIn && userRole === "jobseeker";
  const logoHref = isEmployer ? "/employer" : isJobseeker ? "/jobseeker" : "/";

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur-md shadow-[0_8px_22px_-18px_rgba(37,99,235,0.35)] transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-auto py-3 md:h-17.5 md:py-0 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={logoHref}
          className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
        >
          <Image
            src="/assets/images/Logo.png"
            alt="CareerTrust Logo"
            width={90}
            height={90}
            className="transition-all duration-300 hover:drop-shadow-lg"
          />
        </Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-7">
          <NavDropdown isMobile={false} />
        </div>

        {/* Desktop CTA & User Menu - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoaded ? (
            <div className="flex items-center gap-3 fade-in">
              <div className="w-20 h-9 bg-gray-200 animate-pulse rounded-md shimmer-loading"></div>
              <div className="w-28 h-9 bg-gray-200 animate-pulse rounded-md shimmer-loading"></div>
            </div>
          ) : isSignedIn ? (
            <>
              {/* Notification Bell */}
              <button
                className="relative p-2 rounded-full hover:bg-blue-100 transition-all duration-300 group"
                aria-label="Notifications"
                onClick={() => setShowSidebar(true)}
              >
                <span
                  key={latestNotificationKey}
                  className={unreadCount > 0 ? "inline-flex animate-bell-ring" : "inline-flex"}
                >
                  <svg
                    className="w-6 h-6 text-blue-700 group-hover:text-blue-900 transition"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showSidebar && (
                <NotificationSidebar
                  notifications={notifications}
                  onClose={() => setShowSidebar(false)}
                  onMarkAllRead={() => {
                    markAllAsRead();
                    setShowSidebar(false);
                  }}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  onOpenHiredForm={(notification) => {
                    setShowSidebar(false);
                    openHiredForm(notification);
                  }}
                />
              )}

              {/* User Dropdown Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  className="flex items-center gap-2 bg-linear-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 group min-w-30"
                  id="user-menu-button"
                  aria-haspopup="true"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                >
                  <User className="w-5 h-5 text-blue-700" />
                  <span className="text-sm font-semibold text-blue-900 group-hover:text-blue-800 transition-all duration-200 truncate max-w-20">
                    {user?.firstName || "User"}
                  </span>
                  <svg
                    className={`w-4 h-4 ml-1 text-blue-700 group-hover:text-blue-900 transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-56 min-w-56 bg-white border border-blue-100 rounded-xl shadow-[0_16px_40px_-18px_rgba(15,23,42,0.45)] z-50 animate-fade-in overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col gap-0.5 py-2">
                      <div className="flex items-center gap-2 px-5 py-2 border-b border-blue-50 bg-blue-50 rounded-t-xl">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full font-semibold tracking-wide ${
                            isJobseeker
                              ? "bg-blue-200 text-blue-900"
                              : isEmployer
                                ? "bg-green-200 text-green-900"
                                : "bg-slate-200 text-slate-800"
                          }`}
                        >
                          {isJobseeker
                            ? "Job Seeker"
                            : isEmployer
                              ? "Employer"
                              : "User"}
                        </span>
                      </div>
                      <button
                        className="flex items-center gap-2 px-5 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-900 text-sm font-semibold transition-all duration-200"
                        onClick={() => {
                          setUserMenuOpen(false);
                          if (isJobseeker) {
                            router.push("/jobseeker/profile");
                          } else {
                            router.push("/employer/profile");
                          }
                        }}
                      >
                        <svg
                          className="w-4 h-4 text-blue-700"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        My Profile
                      </button>
                      {isEmployer && (
                        <button
                          className="flex items-center gap-2 px-5 py-2.5 text-amber-600 hover:bg-amber-50 hover:text-amber-700 text-sm font-semibold transition-all duration-200"
                          onClick={() => {
                            setUserMenuOpen(false);
                            router.push("/employer/dashboard?showReputation=true");
                          }}
                        >
                          <Star className="w-4 h-4" />
                          View Reputation
                        </button>
                      )}
                      {isJobseeker && (
                        <>
                          <button
                            className="flex items-center gap-2 px-5 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-900 text-sm font-semibold transition-all duration-200"
                            onClick={() => {
                              setUserMenuOpen(false);
                              router.push("/jobseeker/reviews");
                            }}
                          >
                            <MessageSquare className="w-4 h-4 text-blue-700" />
                            <span>Leave a Review</span>
                          </button>
                          <button
                            className="flex items-center gap-2 px-5 py-2.5 text-orange-600 hover:bg-orange-50 hover:text-orange-700 text-sm font-semibold transition-all duration-200"
                            onClick={() => {
                              setUserMenuOpen(false);
                              router.push("/jobseeker/exit-request");
                            }}
                          >
                            <DoorOpen className="w-4 h-4" />
                            <span>Request Job Exit</span>
                          </button>
                        </>
                      )}
                      <button
                        className="flex items-center gap-2 px-5 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 text-sm font-semibold border-t border-blue-50 transition-all duration-200 rounded-b-xl"
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleSignOutWithConfirm();
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href={LOGIN}
                className="px-3.5 py-2 border border-[#0A1F44] text-[#123560] rounded-lg text-sm font-semibold hover:bg-blue-50 transition-all duration-200 hover:shadow-sm"
              >
                Login
              </Link>
              <Link
                href={SIGNUP}
                className="px-3.5 py-2 bg-linear-to-r from-[#0A1F44] via-[#123560] to-[#1A4779] text-white rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button - Shown only on mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-slate-700" />
          ) : (
            <Menu className="w-6 h-6 text-slate-700" />
          )}
        </button>
      </nav>

      {/* Mobile Menu - Shown only on mobile when open */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-blue-100 bg-white animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
            {/* Mobile Navigation */}
            <NavDropdown isMobile={true} />

            {/* Mobile CTA & User Menu */}
            {!isLoaded ? (
              <div className="space-y-2">
                <div className="w-full h-10 bg-gray-200 animate-pulse rounded-lg shimmer-loading"></div>
                <div className="w-full h-10 bg-gray-200 animate-pulse rounded-lg shimmer-loading"></div>
              </div>
            ) : isSignedIn ? (
              <div className="space-y-2">
                {/* Notification Bell for Mobile */}
                <button
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-blue-50 text-blue-700 font-semibold transition-all relative"
                  onClick={() => {
                    setShowSidebar(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Profile Button for Mobile */}
                <button
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-blue-50 text-blue-700 font-semibold transition-all"
                  onClick={() => {
                    if (userRole === "jobseeker") {
                      router.push("/jobseeker/profile");
                    } else {
                      router.push("/employer/profile");
                    }
                    setMobileMenuOpen(false);
                  }}
                >
                  <User className="w-5 h-5" />
                  <span>My Profile</span>
                </button>

                {/* View Reputation for Mobile (Employers Only) */}
                {isEmployer && (
                  <button
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-amber-50 text-amber-600 font-semibold transition-all"
                    onClick={() => {
                      router.push("/employer/dashboard?showReputation=true");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Star className="w-5 h-5" />
                    <span>View Reputation</span>
                  </button>
                )}

                {/* Leave Review for Jobseekers */}
                {userRole === "jobseeker" && (
                  <>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-blue-50 text-blue-700 font-semibold transition-all"
                      onClick={() => {
                        router.push("/jobseeker/reviews");
                        setMobileMenuOpen(false);
                      }}
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Leave a Review</span>
                    </button>

                    <button
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-orange-50 text-orange-600 font-semibold transition-all"
                      onClick={() => {
                        router.push("/jobseeker/exit-request");
                        setMobileMenuOpen(false);
                      }}
                    >
                      <DoorOpen className="w-5 h-5" />
                      <span>Request Job Exit</span>
                    </button>
                  </>
                )}

                {/* Logout Button */}
                <button
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 font-semibold transition-all border-t border-blue-100 mt-2"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOutWithConfirm();
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href={LOGIN}
                  className="w-full block px-4 py-3 text-center border-2 border-[#0A1F44] text-[#123560] rounded-lg font-semibold hover:bg-blue-50 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href={SIGNUP}
                  className="w-full block px-4 py-3 text-center bg-linear-to-r from-[#0A1F44] via-[#123560] to-[#1A4779] text-white rounded-lg font-semibold transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {showSidebar && (
        <NotificationSidebar
          notifications={notifications}
          onClose={() => setShowSidebar(false)}
          onMarkAllRead={() => {
            markAllAsRead();
            setShowSidebar(false);
          }}
          onMarkAsRead={markAsRead}
          onDelete={deleteNotification}
          onOpenHiredForm={(notification) => {
            setShowSidebar(false);
            openHiredForm(notification);
          }}
        />
      )}
    </header>
  );
}

export default Header;
