"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { useSignIn } from "@clerk/nextjs";
import Swal from "sweetalert2";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),
  password: Yup.string().min(6, "Too short").required("Password is Required"),
});

type FormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  async function handleSubmit(
    values: FormValues,
    { setSubmitting, setErrors }: FormikHelpers<FormValues>
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

    setError(null);
    setIsProcessing(true);

    try {
      // Attempt to sign in with Clerk
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      // Check if sign-in was successful
      if (result.status === "complete") {
        // Set the active session
        await setActive({ session: result.createdSessionId });

        // Get user metadata to determine role
        console.log(result);

        const userRole = (result.userData as any)?.unsafeMetadata?.role;

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back to CareerTrust!",
          timer: 2000,
          showConfirmButton: false,
        });

        console.log("I am the role", userRole);

        // Redirect based on role
        setTimeout(() => {
          if (userRole === "jobseeker") {
            router.push("/jobseeker");
            // router.push("/");
          } else if (userRole === "employer") {
            router.push("/employer");
            // router.push("/");
          } else {
            router.push("/");
            // router.push("/dashboard");
          }
        }, 2000);
      } else {
        // Handle other statuses (shouldn't normally happen for simple password sign-in)
        throw new Error("Sign-in incomplete. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);

      let errorMessage = "An unexpected error occurred.";

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
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      // Show error to user
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
      });

      setError(errorMessage);
      setErrors({ email: errorMessage });
    } finally {
      setIsProcessing(false);
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-white border border-gray-300 rounded-xl shadow-sm p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-600">
          Sign in to access your CareerTrust account
        </p>
      </div>

      <Formik<FormValues>
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
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
                <span className="text-sm text-gray-700">Signing you in...</span>
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

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link
                  href="/forget-password"
                  // href="/resetPassword"
                  className="text-sm text-[#0C2B4E] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
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

            {error && (
              <div className="mt-4 text-sm text-red-600 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              aria-label="Sign in"
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
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </Form>
        )}
      </Formik>

      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="px-3 text-sm text-gray-500">Or continue with</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          aria-label="Continue with Facebook"
          className="group flex items-center justify-center gap-2 px-3 py-2.5 border rounded-lg border-[#1877F2] text-[#1877F2] hover:scale-105 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-[#1A3D64]"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M22 12.073C22 6.507 17.523 2 12 2S2 6.507 2 12.073C2 17.093 5.656 21.128 10.438 21.994v-7.03H7.897v-2.964h2.541V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.196 2.238.196v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.964h-2.33V22C18.344 21.128 22 17.093 22 12.073z" />
          </svg>
          <span className="text-sm font-medium">Facebook</span>
        </button>

        <button
          type="button"
          aria-label="Continue with Google"
          className="flex items-center justify-center gap-3 px-4 py-2.5 border rounded-lg border-yellow-500 bg-white transition-transform hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">Google</span>
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {"Don't have an account? "}
          <Link
            href="/signup"
            className="text-[#0C2B4E] font-medium hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
