"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { useSignUp } from "@clerk/nextjs";
import {
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import * as faceapi from "face-api.js";
import { useRouter } from "next/navigation";

type Role = "jobseeker" | "employer";

type FormValues = {
  name: string;
  companyName: string;
  companyURL: string;
  email: string;
  password: string;
  confirmPassword: string;
  captureImage: File | null;
  terms: boolean;
  phone: string;
  cnic: string;
};

export default function SignupForm({ initialRole }: { initialRole?: Role }) {
  const [role, setRole] = useState<Role>(initialRole || "jobseeker");
  const [step, setStep] = useState<number>(1);
  const [preview, setPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [faceCount, setFaceCount] = useState<number>(0);
  const [modelsLoaded, setModelsLoaded] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [verifying, setVerifying] = useState(false);

  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // useEffect(() => {
  //   return () => {
  //     if (preview) {
  //       URL.revokeObjectURL(preview);
  //     }
  //     if (stream) {
  //       stream.getTracks().forEach((t: MediaStreamTrack) => t.stop());
  //     }
  //   };
  // }, [preview, stream]);

  // Load face-api.js models
  // useEffect(() => {
  //   const loadModels = async () => {
  //     const MODEL_URL = "/models";
  //     await Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)]);
  //     setModelsLoaded(true);
  //   };
  //   loadModels();
  // }, []);

  // useEffect(() => {
  //   if (!modelsLoaded || !isStreaming || !videoRef.current) return;
  //   let isMounted = true;
  //   const interval = setInterval(async () => {
  //     if (!videoRef.current) return;
  //     const detections = await faceapi.detectAllFaces(
  //       videoRef.current,
  //       new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 })
  //     );
  //     if (isMounted) {
  //       setFaceCount(detections.length);
  //     }
  //   }, 500);
  //   return () => {
  //     isMounted = false;
  //     clearInterval(interval);
  //   };
  // }, [modelsLoaded, isStreaming]);

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setStep(2);
  };

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

    setIsProcessing(true);

    try {
      // Face verification for job seekers
      /*
      if (role === "jobseeker" && values.captureImage) {
        const formData = new FormData();
        formData.append("file", values.captureImage);
        formData.append("user_id", values.email);
        formData.append("save_if_new", "1");

        // Uncomment when face-check API is ready

     
        
        const resp = await fetch("/api/auth/face-check", {
          method: "POST",
          body: formData,
        });

        const result = await resp.json();

        if (!resp.ok || result?.match) {
          Swal.fire({
            icon: "error",
            title: "Face Verification Failed",
            text: result?.match 
              ? "This face is already registered." 
              : "Face verification service error.",
          });
          setErrors({ captureImage: "Face verification failed" });
          setSubmitting(false);
          setIsProcessing(false);
          return;
        }
        
      }*/

      // Create user in Clerk
      const result = await signUp.create({
        emailAddress: values.email,
        password: values.password,
        firstName: values.name.split(" ")[0],
        lastName: values.name.split(" ").slice(1).join(" ") || "",
        unsafeMetadata: {
          role: role,
          ...(role === "jobseeker" && {
            phone: values.phone,
            cnic: values.cnic,
          }),
          ...(role === "employer" && {
            companyName: values.companyName,
            companyURL: values.companyURL,
          }),
        },
      });

      // Prepare email verification
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // Show verification modal
      setVerifying(true);

      const { value: code } = await Swal.fire({
        title: "Verify Your Email",
        html: `
          <p class="mb-4">We've sent a verification code to <strong>${values.email}</strong></p>
          <p class="text-sm text-gray-600 mb-4">Please enter the 6-digit code below:</p>
        `,
        input: "text",
        inputAttributes: {
          maxlength: "6",
          placeholder: "000000",
          autocomplete: "off",
        },
        showCancelButton: true,
        confirmButtonText: "Verify",
        confirmButtonColor: "#0C2B4E",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value || value.length !== 6) {
            return "Please enter a valid 6-digit code";
          }
          return null;
        },
        allowOutsideClick: false,
      });

      if (!code) {
        setVerifying(false);
        setIsProcessing(false);
        setSubmitting(false);
        return;
      }

      // Verify the email code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });

        Swal.fire({
          icon: "success",
          title: "Account Created!",
          text: "Your account has been successfully created.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Redirect based on role
        setTimeout(() => {
          if (role === "jobseeker") {
            // router.push("/dashboard/jobseeker");
            router.push("/");
          } else {
            // router.push("/dashboard/employer");
            router.push("/");
          }
        }, 2000);
      } else {
        throw new Error("Verification incomplete");
      }
    } catch (err: any) {
      console.error("Signup error:", err);

      let errorMessage = "An unexpected error occurred.";

      if (err.errors && err.errors.length > 0) {
        errorMessage = err.errors[0].longMessage || err.errors[0].message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: errorMessage,
      });

      setErrors({ email: errorMessage });
    } finally {
      setVerifying(false);
      setIsProcessing(false);
      setSubmitting(false);
    }
  }

  const SignupSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    companyName:
      role === "employer" ? Yup.string().required("Required") : Yup.string(),
    companyURL:
      role === "employer" ? Yup.string().url("Invalid URL") : Yup.string(),
    phone:
      role === "jobseeker"
        ? Yup.string()
            .required("Required")
            .matches(/^[0-9]{10,15}$/, "Invalid phone")
        : Yup.string(),
    cnic:
      role === "jobseeker"
        ? Yup.string()
            .required("Required")
            .matches(/^[0-9]{13}$/, "Invalid CNIC; use 13 digits")
        : Yup.string(),
    // captureImage:
    //   role === "jobseeker"
    //     ? Yup.mixed().required("Capture image is required")
    //     : Yup.mixed(),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
    terms: Yup.boolean().oneOf([true], "You must accept the terms"),
  });

  if (step === 1) {
    return (
      <div className="w-full max-w-2xl bg-[#F4F4F4] rounded-xl p-6">
        <div>
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join CareerTrust
            </h1>
            <p className="text-gray-600">
              Choose your path to build trust in Pakistan&apos;s job market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
            <button
              onClick={() => handleRoleSelect("jobseeker")}
              className="bg-white border border-gray-300 rounded-lg p-8 text-left hover:shadow-lg transition-all hover:border-[#0C2B4E] shadow-xl"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <User className="w-7 h-7 text-[#0C2B4E]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                I&apos;m a Job Seeker
              </h2>
              <p className="text-gray-600 mb-6">
                Find verified job opportunities tailored to your skills and
                build your trusted professional profile.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  AI-powered job recommendations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Verified employment history
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Company reputation insights
                </li>
              </ul>
            </button>

            <button
              onClick={() => handleRoleSelect("employer")}
              className="bg-white border border-gray-300 rounded-lg p-8 text-left hover:shadow-lg transition-all hover:border-[#0C2B4E] shadow-xl"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7 text-[#0C2B4E]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                I&apos;m an Employer
              </h2>
              <p className="text-gray-600 mb-6">
                Post jobs, discover vetted candidates, and build your
                company&apos;s trusted reputation in the market.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Post unlimited job listings
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Access verified candidate profiles
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Build company reputation
                </li>
              </ul>
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              {"Already have an account? "}
              <Link
                href="/login"
                className="text-[#0C2B4E] font-semibold hover:text-[#1A3D64]"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex">
      <main className="flex items-stretch w-full min-h-screen mt-10 mb-20">
        <div className="hidden md:block md:w-1/2 md:h-screen md:sticky md:top-0 relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/assets/images/authImage - Copy.png"
              alt="Authentication background"
              fill
              className="object-cover object-center"
              priority
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
                {role === "jobseeker"
                  ? "Set up your job seeker profile"
                  : "Register your company"}
              </p>
            </div>

            <Formik<FormValues>
              initialValues={{
                name: "",
                companyName: "",
                companyURL: "",
                phone: "",
                cnic: "",
                email: "",
                password: "",
                confirmPassword: "",
                // captureImage: null,
                terms: false,
              }}
              validationSchema={SignupSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, setFieldValue }) => (
                <>
                  {(isProcessing || verifying) && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="mb-4 flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded"
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
                        {verifying
                          ? "Verifying your email..."
                          : "Processing — creating your account..."}
                      </span>
                    </div>
                  )}

                  <Form className="space-y-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-semibold text-gray-900 mb-2"
                        >
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                          <Field
                            id="name"
                            name="name"
                            placeholder={
                              role === "jobseeker" ? "John Doe" : "Jane Smith"
                            }
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                              errors.name && touched.name
                                ? "border-red-400"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-sm text-red-500 mt-1"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-gray-900 mb-2"
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

                      {role === "jobseeker" && (
                        <>
                          <div>
                            <label
                              htmlFor="phone"
                              className="block text-sm font-semibold text-gray-900 mb-2"
                            >
                              Phone Number
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                              <Field
                                id="phone"
                                name="phone"
                                placeholder="03xxxxxxxxx"
                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                                  errors.phone && touched.phone
                                    ? "border-red-400"
                                    : "border-gray-300"
                                }`}
                              />
                            </div>
                            <ErrorMessage
                              name="phone"
                              component="div"
                              className="text-sm text-red-500 mt-1"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="cnic"
                              className="block text-sm font-semibold text-gray-900 mb-2"
                            >
                              CNIC (13 digits)
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                              <Field
                                id="cnic"
                                name="cnic"
                                placeholder="3510123456789"
                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                                  errors.cnic && touched.cnic
                                    ? "border-red-400"
                                    : "border-gray-300"
                                }`}
                              />
                            </div>
                            <ErrorMessage
                              name="cnic"
                              component="div"
                              className="text-sm text-red-500 mt-1"
                            />
                          </div>
                        </>
                      )}

                      {role === "employer" && (
                        <>
                          <div>
                            <label
                              htmlFor="companyName"
                              className="block text-sm font-semibold text-gray-900 mb-2"
                            >
                              Company Name
                            </label>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                              <Field
                                id="companyName"
                                name="companyName"
                                placeholder="Your Company"
                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                                  errors.companyName && touched.companyName
                                    ? "border-red-400"
                                    : "border-gray-300"
                                }`}
                              />
                            </div>
                            <ErrorMessage
                              name="companyName"
                              component="div"
                              className="text-sm text-red-500 mt-1"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="companyURL"
                              className="block text-sm font-semibold text-gray-900 mb-2"
                            >
                              Company URL
                            </label>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                              <Field
                                id="companyURL"
                                name="companyURL"
                                placeholder="https://company.com"
                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${
                                  errors.companyURL && touched.companyURL
                                    ? "border-red-400"
                                    : "border-gray-300"
                                }`}
                              />
                            </div>
                            <ErrorMessage
                              name="companyURL"
                              component="div"
                              className="text-sm text-red-500 mt-1"
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-semibold text-gray-900 mb-2"
                        >
                          Password
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
                          className="block text-sm font-semibold text-gray-900 mb-2"
                        >
                          Confirm Password
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
                    </div>

                    {/* {role === "jobseeker" && (
                      <div className="border-t pt-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-4">
                          Identity Verification - Capture Your Photo
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <video
                              ref={videoRef}
                              className="w-full h-64 bg-black rounded-lg object-cover"
                              autoPlay
                              muted
                              playsInline
                            />
                            <div className="flex gap-2 mt-3">
                              {!isStreaming ? (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      const s =
                                        await navigator.mediaDevices.getUserMedia(
                                          {
                                            video: { facingMode: "user" },
                                            audio: false,
                                          }
                                        );
                                      setStream(s);
                                      if (videoRef.current) {
                                        videoRef.current.srcObject = s;
                                        await videoRef.current.play();
                                      }
                                      setIsStreaming(true);
                                    } catch (err) {
                                      console.error("Camera error", err);
                                    }
                                  }}
                                  className="px-4 py-2 bg-[#0C2B4E] text-white rounded-lg hover:bg-[#1A3D64] transition"
                                >
                                  Open Camera
                                </button>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (stream) {
                                        stream
                                          .getTracks()
                                          .forEach((t) => t.stop());
                                      }
                                      setStream(null);
                                      setIsStreaming(false);
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                  >
                                    Stop Camera
                                  </button>

                                  <button
                                    type="button"
                                    disabled={!isStreaming || faceCount !== 1}
                                    className={`px-4 py-2 rounded-lg ${
                                      faceCount !== 1
                                        ? "bg-gray-300"
                                        : "bg-green-600 text-white hover:bg-green-700 transition"
                                    }`}
                                    onClick={() => {
                                      const video = videoRef.current;
                                      if (!video) return;
                                      const canvas =
                                        document.createElement("canvas");
                                      canvas.width = video.videoWidth || 640;
                                      canvas.height = video.videoHeight || 480;
                                      const ctx = canvas.getContext("2d");
                                      if (!ctx) return;
                                      ctx.drawImage(
                                        video,
                                        0,
                                        0,
                                        canvas.width,
                                        canvas.height
                                      );
                                      canvas.toBlob((blob) => {
                                        if (!blob) return;
                                        const file = new File(
                                          [blob],
                                          "capture.jpg",
                                          { type: blob.type }
                                        );
                                        if (preview)
                                          URL.revokeObjectURL(preview);
                                        const url = URL.createObjectURL(file);
                                        setPreview(url);
                                        setFieldValue("captureImage", file);
                                      }, "image/jpeg");
                                    }}
                                  >
                                    {faceCount === 0
                                      ? "No face detected"
                                      : faceCount > 1
                                      ? "Multiple faces detected"
                                      : "Capture Photo"}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-center">
                            {preview ? (
                              <div>
                                <p className="text-sm font-semibold text-gray-900 mb-2">
                                  Captured Image:
                                </p>
                                <img
                                  src={preview}
                                  alt="capture preview"
                                  className="w-full h-64 object-cover rounded-lg border-2 border-green-500"
                                />
                              </div>
                            ) : (
                              <div className="text-center text-gray-500">
                                <p>No image captured yet</p>
                                <p className="text-sm mt-2">
                                  Click Capture Photo after opening camera
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <ErrorMessage
                          name="captureImage"
                          component="div"
                          className="text-sm text-red-500 mt-2"
                        />
                      </div>
                    )} */}

                    <div className="border-t pt-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <Field
                          type="checkbox"
                          id="terms"
                          name="terms"
                          className="w-5 h-5 rounded border-gray-300 accent-[#0C2B4E] focus:ring-[#0C2B4E] cursor-pointer mt-1"
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm text-gray-600"
                        >
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
                      <ErrorMessage
                        name="terms"
                        component="div"
                        className="text-sm text-red-500"
                      />

                      <button
                        type="submit"
                        disabled={isProcessing || verifying}
                        className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-lg transition ${
                          isProcessing || verifying
                            ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                            : "bg-[#0C2B4E] text-white hover:bg-[#1A3D64]"
                        }`}
                      >
                        {isProcessing || verifying ? (
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
                            Create Account <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </Form>
                </>
              )}
            </Formik>

            <div className="text-center">
              <button
                onClick={() => setStep(1)}
                className="text-[#0C2B4E] hover:text-[#1A3D64] font-semibold"
              >
                ← Change role
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
