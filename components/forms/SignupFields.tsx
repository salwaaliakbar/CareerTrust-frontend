"use client";

import React from "react";
import { Mail, Lock, User, Phone, Building2, ArrowRight } from "lucide-react";
import {
  SubmitHandler,
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormGetValues,
} from "react-hook-form";
import type { FormValues, SignupAction } from "./SignupForm";
import { JOBSEEKER, EMPLOYER } from "@/constants/constant";

type SignupFieldsState = {
  role: typeof JOBSEEKER | typeof EMPLOYER;
  isProcessing: boolean;
  verifying: boolean;
};

type Props = {
  state: SignupFieldsState;
  register: UseFormRegister<FormValues>;
  rhfErrors: FieldErrors<FormValues>;
  handleSubmit: UseFormHandleSubmit<FormValues>;
  onSubmit: SubmitHandler<FormValues>;
  getValues: UseFormGetValues<FormValues>;
  dispatch: React.Dispatch<SignupAction>;
};

export default function SignupFields({
  state,
  register,
  rhfErrors,
  handleSubmit,
  onSubmit,
  getValues,
  dispatch,
}: Props) {
  return (
    <>
      <div className="w-full flex">
        <main className="flex items-stretch w-full min-h-screen mt-10 mb-20">
          <div className="hidden md:block md:w-1/2 md:h-screen md:sticky md:top-0 relative overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="/assets/images/authImage - Copy.png"
                alt="Auth background"
                className="object-cover object-center w-full h-full slide-in-left animation-delay-1000"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex items-center justify-center px-4">
            <div className="w-full max-w-4xl bg-[#F4F4F4] border border-gray-300 rounded-xl shadow-lg p-8 max-h-[calc(100vh-6rem)] overflow-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Create Your Account
                </h1>
                <p className="text-gray-600">
                  {state.role === "jobseeker"
                    ? "Set up your job seeker profile"
                    : "Register your company"}
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        id="name"
                        {...register("name", {
                          required: "Full name is required",
                        })}
                        placeholder={
                          state.role === "jobseeker" ? "John Doe" : "Jane Smith"
                        }
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                          rhfErrors.name ? "border-red-400" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {rhfErrors.name && (
                      <div className="text-sm text-red-500 mt-1">
                        {String(rhfErrors.name.message)}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address",
                          },
                        })}
                        placeholder="you@example.com"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                          rhfErrors.email ? "border-red-400" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {rhfErrors.email && (
                      <div className="text-sm text-red-500 mt-1">
                        {String(rhfErrors.email.message)}
                      </div>
                    )}
                  </div>

                  {state.role === JOBSEEKER && (
                    <>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-semibold text-gray-900 mb-2"
                        >
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            id="phone"
                            {...register("phone", {
                              required: "Phone number is required",
                              pattern: {
                                value: /^[0-9]{10,15}$/,
                                message: "Invalid phone number (10-15 digits)",
                              },
                            })}
                            placeholder="03xxxxxxxxx"
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                              rhfErrors.phone
                                ? "border-red-400"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        {rhfErrors.phone && (
                          <div className="text-sm text-red-500 mt-1">
                            {String(rhfErrors.phone.message)}
                          </div>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="cnic"
                          className="block text-sm font-semibold text-gray-900 mb-2"
                        >
                          CNIC (13 digits) *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            id="cnic"
                            {...register("cnic", {
                              required: "CNIC is required",
                              pattern: {
                                value: /^[0-9]{13}$/,
                                message: "Invalid CNIC (must be 13 digits)",
                              },
                            })}
                            placeholder="3510123456789"
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                              rhfErrors.cnic
                                ? "border-red-400"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        {rhfErrors.cnic && (
                          <div className="text-sm text-red-500 mt-1">
                            {String(rhfErrors.cnic.message)}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {state.role === EMPLOYER && (
                    <>
                      <div>
                        <label
                          htmlFor="companyName"
                          className="block text-sm font-semibold text-gray-900 mb-2"
                        >
                          Company Name *
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            id="companyName"
                            {...register("companyName", {
                              required:
                                state.role === "employer"
                                  ? "Company name is required"
                                  : false,
                            })}
                            placeholder="Your Company"
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                              rhfErrors.companyName
                                ? "border-red-400"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        {rhfErrors.companyName && (
                          <div className="text-sm text-red-500 mt-1">
                            {String(rhfErrors.companyName.message)}
                          </div>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="companyURL"
                          className="block text-sm font-semibold text-gray-900 mb-2"
                        >
                          Company URL *
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            id="companyURL"
                            {...register("companyURL", {
                              required:
                                state.role === "employer"
                                  ? "Company URL is required"
                                  : false,
                              pattern: {
                                value: /^https?:\/\//,
                                message:
                                  "Invalid URL (must start with http:// or https://)",
                              },
                            })}
                            placeholder="https://company.com"
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                              rhfErrors.companyURL
                                ? "border-red-400"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        {rhfErrors.companyURL && (
                          <div className="text-sm text-red-500 mt-1">
                            {String(rhfErrors.companyURL.message)}
                          </div>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="linkedinUrl"
                          className="block text-sm font-semibold text-gray-900 mb-2"
                        >
                          Company LinkedIn Page *
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            id="linkedinUrl"
                            {...register("linkedinUrl", {
                              required:
                                state.role === "employer"
                                  ? "Company LinkedIn URL is required"
                                  : false,
                              pattern: {
                                value:
                                  /^https:\/\/(www\.)?linkedin\.com\/(company|in)\//,
                                message:
                                  "Invalid LinkedIn URL (must be a LinkedIn company or profile page)",
                              },
                            })}
                            placeholder="https://www.linkedin.com/company/your-company"
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                              rhfErrors.linkedinUrl
                                ? "border-red-400"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        {rhfErrors.linkedinUrl && (
                          <div className="text-sm text-red-500 mt-1">
                            {String(rhfErrors.linkedinUrl.message)}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        id="password"
                        type="password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
                            message:
                              "Password must contain uppercase, lowercase, number and special character",
                          },
                        })}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                          rhfErrors.password
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    {rhfErrors.password && (
                      <div className="text-sm text-red-500 mt-1">
                        {String(rhfErrors.password.message)}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (v: string) =>
                            v === getValues("password") ||
                            "Passwords do not match",
                        })}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                          rhfErrors.confirmPassword
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    {rhfErrors.confirmPassword && (
                      <div className="text-sm text-red-500 mt-1">
                        {String(rhfErrors.confirmPassword.message)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      {...register("terms", {
                        required: "You must accept the terms and conditions",
                      })}
                      className="w-5 h-5 rounded border-gray-300 accent-[#0C2B4E] focus:ring-[#0C2B4E] cursor-pointer mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to CareerTrust&apos;s{" "}
                      <a
                        href="#terms"
                        className="text-[#0C2B4E] hover:text-[#1A3D64] font-semibold"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#privacy"
                        className="text-[#0C2B4E] hover:text-[#1A3D64] font-semibold"
                      >
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {rhfErrors.terms && (
                    <div className="text-sm text-red-500">
                      {String(rhfErrors.terms.message)}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={state.isProcessing || state.verifying}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-lg transition ${
                      state.isProcessing || state.verifying
                        ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                        : "bg-[#0C2B4E] text-white hover:bg-[#1A3D64]"
                    }`}
                  >
                    {state.isProcessing || state.verifying ? (
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
                        Processing...
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center">
                <button
                  onClick={() => dispatch({ type: "setStep", payload: 1 })}
                  className="text-[#0C2B4E] hover:text-[#1A3D64] font-semibold"
                >
                  ← Change role
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
