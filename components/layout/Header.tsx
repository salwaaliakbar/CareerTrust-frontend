"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import HomeDropdown from "../ui/HomeDropdown";
import Swal from "sweetalert2";
// import { LogOut } from "lucide-react";

const LOGIN = "/login";
const SIGNUP = "/signup";

function Header() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

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
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const userRole = user?.unsafeMetadata?.role as string;

  return (
    <header className="bg-[#F4F4F4] border-b border-gray-300 sticky top-0 z-50 shadow-sm transition-all duration-300 hover:shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
          <Image
            src="/assets/images/Logo.png"
            alt="CareerTrust Logo"
            width={90}
            height={90}
            className="transition-all duration-300 hover:drop-shadow-lg"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {isSignedIn && <HomeDropdown />}
          <Link
            href="/about"
            className="text-gray-600 hover:text-primary font-medium transition-all duration-300 relative group hover:translate-y-0.5"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
          </Link>
          <Link
            href="/features"
            className="text-gray-600 hover:text-primary font-medium transition-all duration-300 relative group hover:translate-y-0.5"
          >
            Features
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
          </Link>
          <Link
            href="/services"
            className="text-gray-600 hover:text-primary font-medium transition-all duration-300 relative group hover:translate-y-0.5"
          >
            Services
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
          </Link>
          <Link
            href="/blogs"
            className="text-gray-600 hover:text-primary font-medium transition-all duration-300 relative group hover:translate-y-0.5"
          >
            Blogs
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
          </Link>
          <Link
            href="/contact"
            className="text-gray-600 hover:text-primary font-medium transition-all duration-300 relative group hover:translate-y-0.5"
          >
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
          </Link>
        </div>

        {/* CTA Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoaded ? (
            // Loading state
            <div className="flex items-center gap-3 fade-in">
              <div className="w-20 h-9 bg-gray-200 animate-pulse rounded-md shimmer-loading"></div>
              <div className="w-28 h-9 bg-gray-200 animate-pulse rounded-md shimmer-loading"></div>
            </div>
          ) : isSignedIn ? (
            // User is logged in - Show user info and logout
            <>
              {userRole === "jobseeker" ? (
                <Link
                  href="/jobseeker/dashboard"
                  className="text-gray-600 hover:text-primary font-medium transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/employer/dashboard"
                  className="text-gray-600 hover:text-primary font-medium transition-colors"
                >
                  Dashboard
                </Link>
              )}

              <div className="flex items-center gap-1 hover:bg-gray-200 rounded-full px-1 py-1 transition-all duration-300 cursor-pointer hover:scale-105">
                <User className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                <button
                  onClick={() => router.push("/jobseeker/profile")}
                  className="text-sm font-medium cursor-pointer hover:text-primary transition-colors duration-300"
                >
                  {user?.firstName || "Dashboard"}
                </button>
              </div>
              <span className="px-2 py-1 bg-linear-to-r from-blue-100 to-blue-50 text-blue-800 text-xs rounded-full font-semibold transition-all duration-300 hover:shadow-md hover:scale-105">
                {userRole === "jobseeker" ? "Job Seeker" : "Employer"}
              </span>

              <button
                onClick={handleSignOutWithConfirm}
                className="flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-red-600 to-red-700 text-white rounded-md text-sm hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            // User is not logged in - Show login and signup buttons
            <>
              <Link
                href={LOGIN}
                className="px-3 py-1.5 border border-[#0C2B4E] text-[#1D546C] rounded-md text-sm hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                Login
              </Link>
              <Link
                href={SIGNUP}
                className="px-3 py-1.5 bg-linear-to-r from-[#0C2B4E] to-[#1D546C] text-white rounded-md text-sm hover:from-[#1D546C] hover:to-[#0C2B4E] transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile dropdown (client) */}
        {/* <DropdownMenu
          login={LOGIN}
          signup={SIGNUP}
          isSignedIn={isSignedIn}
          user={user}
          onSignOut={handleSignOut}
        /> */}
      </nav>
    </header>
  );
}

export default Header;
