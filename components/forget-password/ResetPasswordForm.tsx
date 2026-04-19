"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, KeyRound } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { useSignIn } from "@clerk/nextjs";
import Swal from "sweetalert2";

const EmailSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),
});

const ResetSchema = Yup.object().shape({
  code: Yup.string()
    .required("Verification code is required")
    .length(6, "Code must be 6 digits"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

type EmailFormValues = {
  email: string;
};

type ResetFormValues = {
  code: string;
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordForm() {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { isLoaded, signIn } = useSignIn();
  const router = useRouter();

  async function handleEmailSubmit(
    values: EmailFormValues,
    { setSubmitting, setErrors }: FormikHelpers<EmailFormValues>
  ) {
    if (!isLoaded) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Authentication system is not ready. Please refresh the page.",
      });
      setSubmitting(false);
      return;
    }

    setIsProcessing(true);

    try {
      // Start the password reset process
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: values.email,
      });

      setEmail(values.email);

      Swal.fire({
        icon: "success",
        title: "Code Sent",
        text: "A verification code has been sent to your email.",
        timer: 2000,
        showConfirmButton: true,
      });

      // Move to the reset step
      setTimeout(() => {
        setStep("reset");
      }, 2000);
    } catch (err: unknown) {
      console.error("Error sending reset code:", err);

      let errorMessage = "Failed to send reset code.";

      if (typeof err === "object" && err !== null) {
        const e = err as {
          errors?: Array<{ longMessage?: string; message?: string }>;
          message?: string;
        };
        if (Array.isArray(e.errors) && e.errors.length > 0) {
          errorMessage =
            e.errors[0].longMessage || e.errors[0].message || errorMessage;
        } else if (typeof e.message === "string") {
          errorMessage = e.message;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });

      setErrors({ email: errorMessage });
    } finally {
      setIsProcessing(false);
      setSubmitting(false);
    }
  }

  async function handleResetSubmit(
    values: ResetFormValues,
    { setSubmitting, setErrors }: FormikHelpers<ResetFormValues>
  ) {
    if (!isLoaded) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Authentication system is not ready. Please refresh the page.",
      });
      setSubmitting(false);
      return;
    }

    setIsProcessing(true);

    try {
      // Attempt to reset the password
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: values.code,
        password: values.password,
      });

      if (result.status === "complete") {
        Swal.fire({
          icon: "success",
          title: "Password Reset Successful",
          text: "Your password has been updated. Redirecting to login...",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        throw new Error("Password reset incomplete. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Password reset error:", err);

      let errorMessage = "Failed to reset password.";

      if (typeof err === "object" && err !== null) {
        const e = err as {
          errors?: Array<{ longMessage?: string; message?: string }>;
          message?: string;
        };
        if (Array.isArray(e.errors) && e.errors.length > 0) {
          errorMessage =
            e.errors[0].longMessage || e.errors[0].message || errorMessage;
        } else if (typeof e.message === "string") {
          errorMessage = e.message;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: errorMessage,
      });

      setErrors({ code: errorMessage });
    } finally {
      setIsProcessing(false);
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-white border border-gray-300 rounded-xl shadow-sm p-6">  
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          {step === "email" ? "Reset Password" : "Enter Verification Code"}
        </h1>
        <p className="text-sm text-gray-600">
          {step === "email"
            ? "Enter your email to receive a verification code"
            : `We sent a code to ${email}`}
        </p>
      </div>

      {step === "email" ? (
        <Formik<EmailFormValues>
          initialValues={{ email: "" }}
          validationSchema={EmailSchema}
          onSubmit={handleEmailSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-5">
              {isProcessing && (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded"
                >
                  <svg
                    className="animate-spin w-5 h-5 text-[#0C2B4E]"
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
                  <span className="text-sm text-gray-700">
                    Sending verification code...
                  </span>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                      errors.email && touched.email
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <button
                type="submit"
                aria-label="Send verification code"
                disabled={isSubmitting || isProcessing}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md transition focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] ${
                  isSubmitting || isProcessing
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-[#0C2B4E] text-white hover:bg-[#1A3D64]"
                }`}
              >
                {isSubmitting || isProcessing ? (
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
                    Sending Code...
                  </>
                ) : (
                  <>
                    Send Code <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </Form>
          )}
        </Formik>
      ) : (
        <Formik<ResetFormValues>
          initialValues={{ code: "", password: "", confirmPassword: "" }}
          validationSchema={ResetSchema}
          onSubmit={handleResetSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-5">
              {isProcessing && (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded"
                >
                  <svg
                    className="animate-spin w-5 h-5 text-[#0C2B4E]"
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
                  <span className="text-sm text-gray-700">
                    Resetting password...
                  </span>
                </div>
              )}

              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <Field
                    id="code"
                    name="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                      errors.code && touched.code
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                <ErrorMessage
                  name="code"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                      errors.password && touched.password
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <button
                type="submit"
                aria-label="Reset password"
                disabled={isSubmitting || isProcessing}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md transition focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] ${
                  isSubmitting || isProcessing
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-[#0C2B4E] text-white hover:bg-[#1A3D64]"
                }`}
              >
                {isSubmitting || isProcessing ? (
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
                    Resetting...
                  </>
                ) : (
                  <>
                    Reset Password <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-sm text-[#0C2B4E] hover:underline mt-2"
              >
                ← Back to email
              </button>
            </Form>
          )}
        </Formik>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-[#0C2B4E] font-medium hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
