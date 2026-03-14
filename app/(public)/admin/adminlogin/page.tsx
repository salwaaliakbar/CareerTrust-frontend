"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser, useSignIn } from "@clerk/nextjs";
import Swal from "sweetalert2";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, Lock, Mail } from "lucide-react";

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
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Step 4: Fetch the user to check role
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${await signIn.createdSessionId}`,
          },
        });
        
        // For now, we'll rely on the useEffect to check the role
        // The user object should be updated automatically
        
      } else {
        // Handle MFA or other additional steps
        throw new Error("Additional authentication steps required");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setLoading(false);
      
      // Show error with SweetAlert2
      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.errors?.[0]?.message || err.message || "Invalid email or password. Please try again.",
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
          showConfirmButton: false,
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
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 px-4 py-20 relative">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#0C2B4E]/10 rounded-full blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-[#F97316]/10 rounded-full blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="max-w-md w-full relative z-10 fade-in">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-[#0C2B4E] to-[#1A3D64] p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <ShieldCheck className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-[#0C2B4E] mb-2">
              CareerTrust Admin
            </h1>
            <p className="text-gray-600">Secure portal access for administrators</p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200/50 hover:shadow-3xl transition-all duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Mail className="w-4 h-4 text-[#0C2B4E]" />
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0C2B4E]/20 focus:border-[#0C2B4E] transition-all duration-200 bg-white"
                  placeholder="admin@careertrust.com"
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Lock className="w-4 h-4 text-[#0C2B4E]" />
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0C2B4E]/20 focus:border-[#0C2B4E] transition-all duration-200 bg-white"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64] text-white py-3.5 rounded-xl font-semibold hover:from-[#1A3D64] hover:to-[#0C2B4E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0C2B4E] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    Sign In Securely
                  </span>
                )}
              </button>
            </form>

            {/* Development Credentials */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl">
                <p className="text-xs font-bold text-[#0C2B4E] mb-2 flex items-center gap-2">
                  🔐 Development Access
                </p>
                <div className="space-y-1">
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold">Email:</span> admin@careertrust.com
                  </p>
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold">Note:</span> Use your Clerk password
                  </p>
                </div>
              </div>
            )}

            {/* Security Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <ShieldCheck className="w-5 h-5 text-[#0C2B4E] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">Secure Access</p>
                  <p className="text-xs leading-relaxed">
                    This portal is protected with Clerk enterprise authentication. 
                    All actions are logged and monitored for security compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-amber-800">
                Authorized Personnel Only
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
