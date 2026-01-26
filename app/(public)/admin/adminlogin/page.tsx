"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get API URL from environment variable
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      
      const response = await fetch(
        `${apiUrl}/api/admin/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Backend server error. Please ensure the backend is running on ${apiUrl}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store tokens
      localStorage.setItem("adminAccessToken", data.data.accessToken);
      localStorage.setItem("adminRefreshToken", data.data.refreshToken);
      localStorage.setItem("adminProfile", JSON.stringify(data.data.admin));

      // Show success message
      await Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome back, ${data.data.admin.fullName}`,
        timer: 1500,
        showConfirmButton: false,
      });

      // Redirect to admin dashboard
      router.push("/admin/admindashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      
      // Show error with SweetAlert2
      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.message || "An error occurred during login. Please try again.",
        confirmButtonColor: "#4F46E5",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  };

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
                    <span className="font-semibold">Password:</span> Admin@123
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
                    This portal is protected with enterprise-grade encryption. 
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
