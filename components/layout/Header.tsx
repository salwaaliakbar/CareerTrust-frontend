"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import DropdownMenu from "../ui/dropdown-menu";
import HomeDropdown from "../ui/HomeDropdown";

const LOGIN = "/login";
const SIGNUP = "/signup";

function Header() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

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
    <header className="bg-[#F4F4F4] border-b border-gray-300 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/images/Logo.png"
            alt="CareerTrust Logo"
            width={90}
            height={90}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {isSignedIn ? (
            // Logged in users see only About and Features
            <>
              <Link
                href="/about"
                className="text-gray-600 hover:text-primary font-medium transition-colors"
              >
                About
              </Link>
              <Link
                href="/features"
                className="text-gray-600 hover:text-primary font-medium transition-colors"
              >
                Features
              </Link>
            </>
          ) : (
            // Logged out users see all pages except About and Features
            <>
              <HomeDropdown />
              <Link
                href="/services"
                className="text-gray-600 hover:text-primary font-medium transition-colors"
              >
                Services
              </Link>
              <Link
                href="/blogs"
                className="text-gray-600 hover:text-primary font-medium transition-colors"
              >
                Blogs
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-primary font-medium transition-colors"
              >
                Contact
              </Link>
            </>
          )}
        </div>

        {/* CTA Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoaded ? (
            // Loading state
            <div className="flex items-center gap-3">
              <div className="w-20 h-9 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="w-28 h-9 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
          ) : isSignedIn ? (
            // User is logged in - Show user info and logout
            <>
              <Link
                href={
                  userRole === "jobseeker"
                    ? "/dashboard/jobseeker"
                    : "/dashboard/employer"
                }
                className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:text-[#0C2B4E] transition"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {user?.firstName || "Dashboard"}
                </span>
              </Link>

              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {userRole === "jobseeker" ? "Job Seeker" : "Employer"}
              </span>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
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
                className="px-3 py-1.5 border border-[#0C2B4E] text-[#1D546C] rounded-md text-sm hover:bg-blue-50 transition"
              >
                Login
              </Link>
              <Link
                href={SIGNUP}
                className="px-3 py-1.5 bg-[#0C2B4E] text-white rounded-md text-sm hover:bg-[#1D546C] transition"
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
