"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth, useUser, useSignIn } from "@clerk/nextjs";
import Swal from "sweetalert2";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signIn, setActive } = useSignIn();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Only check once when component mounts
    if (isLoaded && !hasCheckedAuth) {
      setHasCheckedAuth(true);
      
      if (isSignedIn && user) {
        const userRole = user.unsafeMetadata?.role as string | undefined;
        
        if (userRole === "admin") {
          // Already logged in as admin, redirect to dashboard
          router.replace("/admin/admindashboard");
        } else if (userRole) {
          // Logged in but not as admin
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "You do not have admin privileges.",
            confirmButtonColor: "#4F46E5",
          }).then(() => {
            router.push("/");
          });
        }
      }
    }
  }, [isLoaded, isSignedIn, user, router, hasCheckedAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!signIn) {
        throw new Error("Sign in not initialized");
      }

      // Step 1: Attempt to sign in with Clerk
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      // Step 2: If sign-in successful, set the session active
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        
        // Step 3: Wait a moment for user data to load
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // For now, we'll rely on the useEffect to check the role
        // The user object should be updated automatically
        
      } else {
        // Handle MFA or other additional steps
        throw new Error("Additional authentication steps required");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      setLoading(false);

      let errorMessage = "Invalid email or password. Please try again.";
      if (typeof err === "object" && err !== null) {
        const typedError = err as {
          errors?: Array<{ message?: string }>;
          message?: string;
        };
        errorMessage =
          typedError.errors?.[0]?.message ||
          typedError.message ||
          errorMessage;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      
      // Show error with SweetAlert2
      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
        confirmButtonColor: "#4F46E5",
        confirmButtonText: "Try Again",
      });
    }
  };

  // This will run when user object updates after sign-in
  useEffect(() => {
    if (isLoaded && isSignedIn && user && loading && hasCheckedAuth) {
      const userRole = user.unsafeMetadata?.role as string | undefined;
      
      if (userRole === "admin") {
        // Show success message
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: `Welcome back, ${user.firstName || 'Admin'}!`,
          timer: 1500,
          showConfirmButton: true,
        }).then(() => {
          setLoading(false);
          // Redirect to admin dashboard
          router.replace("/admin/admindashboard");
        });
      } else {
        // Not an admin
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "This account does not have admin privileges.",
          confirmButtonColor: "#4F46E5",
        }).then(() => {
          // Sign out and redirect
          setLoading(false);
          router.push("/");
        });
      }
    }
  }, [isLoaded, isSignedIn, user, loading, router, hasCheckedAuth]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col">
      <Header />
      <main className="flex-1 flex items-stretch mt-5 mb-20">
        <div className="hidden md:flex md:w-1/2 items-start justify-center bg-white p-6 pt-2">
          <Image
            src="/assets/images/authImage - Copy.png"
            alt="Admin authentication background"
            width={900}
            height={900}
            className="w-full h-auto max-h-180 object-contain"
            priority
          />
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md bg-white border border-gray-300 rounded-xl shadow-sm p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                Admin Login
              </h1>
              <p className="text-sm text-gray-600">
                Secure portal access for administrators
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@careertrust.com"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md transition focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] ${
                  loading
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-[#0C2B4E] text-white hover:bg-[#1A3D64]"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                  </>
                )}
              </button>
            </form>

            {process.env.NODE_ENV === "development" && (
              <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs font-semibold text-[#0C2B4E] mb-1">
                  Development Access
                </p>
                <p className="text-xs text-gray-700">Email: admin@careertrust.com</p>
                <p className="text-xs text-gray-700">Use your Clerk password</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-900 mb-1">Secure Access</p>
                  <p className="text-xs leading-relaxed">
                    This portal is protected with enterprise authentication and
                    monitored for security compliance.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                <span className="text-xs font-medium text-amber-800">
                  Authorized Personnel Only
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
