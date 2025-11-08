"use client";

import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short").required("Required"),
});

export default function LoginForm() {
  const handleSubmit = (values: { email: string; password: string }) => {
    // Replace with real auth logic
    console.log("Login attempt:", values);
  };

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Welcome Back</h1>
        <p className="text-sm text-gray-600">Sign in to access your CareerTrust account</p>
      </div>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ errors, touched }) => (
          <Form className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                    errors.email && touched.email ? "border-red-400" : "border-gray-300"
                  }`}
                />
              </div>
              <ErrorMessage name="email" component="div" className="text-sm text-red-500 mt-1" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Link href="/forgot" className="text-sm text-[#0C2B4E] hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                    errors.password && touched.password ? "border-red-400" : "border-gray-300"
                  }`}
                />
              </div>
              <ErrorMessage name="password" component="div" className="text-sm text-red-500 mt-1" />
            </div>

            <button type="submit" aria-label="Sign in" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0C2B4E] text-white rounded-md hover:bg-[#1A3D64] focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] transition">
              Sign In <ArrowRight className="w-5 h-5" />
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
        <button type="button" aria-label="Continue with Facebook" className="group flex items-center justify-center gap-2 px-3 py-2.5 border rounded-lg border-[#1877F2] text-[#1877F2] hover:scale-105 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-[#1A3D64]">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.073C22 6.507 17.523 2 12 2S2 6.507 2 12.073C2 17.093 5.656 21.128 10.438 21.994v-7.03H7.897v-2.964h2.541V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.196 2.238.196v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.964h-2.33V22C18.344 21.128 22 17.093 22 12.073z" /></svg>
          <span className="text-sm font-medium">Facebook</span>
        </button>

        <button type="button" aria-label="Continue with Google" className="flex items-center justify-center gap-3 px-4 py-2.5 border rounded-lg border-yellow-500 bg-white transition-transform hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          <span className="text-sm font-medium text-gray-700">Google</span>
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">{"Don't have an account? "}<Link href="/signup" className="text-[#0C2B4E] font-medium hover:underline">Sign up here</Link></p>
      </div>
    </div>
  );
}
