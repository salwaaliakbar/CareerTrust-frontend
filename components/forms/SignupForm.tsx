"use client";

import Image from "next/image";
import { useReducer, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";

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
  type State = {
    role: Role;
    step: number;
    preview: string | null;
    stream: MediaStream | null;
    isStreaming: boolean;
    faceCount: number;
    modelsLoaded: boolean;
    isProcessing: boolean;
    faceVerified: boolean;
  };

  type Action =
    | { type: "setRole"; payload: Role }
    | { type: "setStep"; payload: number }
    | { type: "setPreview"; payload: string | null }
    | { type: "setStream"; payload: MediaStream | null }
    | { type: "setIsStreaming"; payload: boolean }
    | { type: "setFaceCount"; payload: number }
    | { type: "setModelsLoaded"; payload: boolean }
    | { type: "setIsProcessing"; payload: boolean }
    | { type: "setFaceVerified"; payload: boolean };

  const initialState: State = {
    role: initialRole || "jobseeker",
    step: 1,
    preview: null,
    stream: null,
    isStreaming: false,
    faceCount: 0,
    modelsLoaded: false,
    isProcessing: false,
    faceVerified: false,
  };

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case "setRole":
        return { ...state, role: action.payload };
      case "setStep":
        return { ...state, step: action.payload };
      case "setPreview":
        return { ...state, preview: action.payload };
      case "setStream":
        return { ...state, stream: action.payload };
      case "setIsStreaming":
        return { ...state, isStreaming: action.payload };
      case "setFaceCount":
        return { ...state, faceCount: action.payload };
      case "setModelsLoaded":
        return { ...state, modelsLoaded: action.payload };
      case "setIsProcessing":
        return { ...state, isProcessing: action.payload };
      case "setFaceVerified":
        return { ...state, faceVerified: action.payload };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleRoleSelect = (selectedRole: Role) => {
    dispatch({ type: "setRole", payload: selectedRole });
    dispatch({ type: "setStep", payload: 2 });
  };

  useEffect(() => {
    return () => {
      if (state.preview) {
        URL.revokeObjectURL(state.preview);
      }
      if (state.stream) {
        state.stream.getTracks().forEach((t: MediaStreamTrack) => t.stop());
      }
    };
  }, [state.preview, state.stream]);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)]);
      dispatch({ type: "setModelsLoaded", payload: true });
    };
    loadModels();
  }, []);

  // Periodically detect faces in the video stream and update faceCount
  useEffect(() => {
    if (!state.modelsLoaded || !state.isStreaming || !videoRef.current) return;
    let isMounted = true;
    const interval = setInterval(async () => {
      if (!videoRef.current) return;
      try {
        const detections = await faceapi.detectAllFaces(
          videoRef.current as HTMLVideoElement,
          new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 })
        );
        if (isMounted) dispatch({ type: "setFaceCount", payload: detections.length });
      } catch (e) {
        console.error("face detection error", e);
      }
    }, 500);

    return () => {
      isMounted = false;
      clearInterval(interval);
      // reset face count when stopping
      dispatch({ type: "setFaceCount", payload: 0 });
    };
  }, [state.modelsLoaded, state.isStreaming]);

  
  
  const { register, handleSubmit: rhfHandleSubmit, setValue, getValues, formState: { errors: rhfErrors } } = useForm<FormValues>({
    defaultValues: {
      name: "",
      companyName: "",
      companyURL: "",
      phone: "",
      cnic: "",
      email: "",
      password: "",
      confirmPassword: "",
      captureImage: null,
      terms: false,
    }
  });

  async function onSubmit(values: FormValues) {
    // Require face verification first for jobseekers
    if (state.role === "jobseeker" && !state.faceVerified) {
      Swal.fire({ icon: "warning", title: "Verify identity", text: "Please complete identity verification before creating your account." });
      return;
    }

    console.log("Form submitted with values:", values);
    dispatch({ type: "setIsProcessing", payload: true });
    try {
      // Continue with signup logic here (e.g., create user)
      // TODO: send signup details to your auth endpoint
      Swal.fire({ icon: "success", title: "Signup ready", text: "Identity verified — proceed to create account (implement backend signup)." });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error("Error during submission:", err);
      Swal.fire({ icon: "error", title: "Submission failed", text: errMsg || "An unexpected error occurred." });
    } finally {
      dispatch({ type: "setIsProcessing", payload: false });
    }
  }

  async function verifyFace() {
    // Trigger face-check against the microservice and set faceVerified on success
    const file = getValues().captureImage;
    if (!file) {
      Swal.fire({ icon: "warning", title: "No image", text: "Please capture an image first." });
      return;
    }
    console.log("Verifying face for file:", file);

    dispatch({ type: "setIsProcessing", payload: true });
    try {
      const formData = new FormData();
      formData.append("file", file as File);
      const email = getValues().email;
      if (email) {
        formData.append("user_id", email);
        formData.append("save_if_new", "1");
      }
      console.log("Sending face verification request with formData:", formData);

      const resp = await fetch("/api/auth/face-check", { method: "POST", body: formData });
      let result: unknown = {};
      try { result = await resp.json(); } catch (e) { console.error("Invalid JSON from face-check", e); }
      const resObj = result as { error?: string; details?: string; match?: boolean; saved?: boolean };

      if (!resp.ok) {
        const message = resObj?.error || resObj?.details || `Service returned ${resp.status}`;
        Swal.fire({ icon: "error", title: "Verification failed", text: message });
        return;
      }

      if (resObj?.match) {
        // Face already registered
        dispatch({ type: "setFaceVerified", payload: false });
        Swal.fire({ icon: "error", title: "Face Already Registered", text: "The captured face is already registered. If this is your face, please contact support or use a different verification method." });
        return;
      }

      // No match -> allowed to register
      dispatch({ type: "setFaceVerified", payload: true });
      if (resObj?.saved) console.log("Embedding saved for user:", email);
      Swal.fire({ icon: "success", title: "Verified", text: "Identity verification passed. You may now create your account." });
    } catch (err) {
      console.error("verifyFace error", err);
      Swal.fire({ icon: "error", title: "Verification failed", text: "An error occurred while verifying face." });
    } finally {
      dispatch({ type: "setIsProcessing", payload: false });
    }
  }

  

  if (state.step === 1) {
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
        {/* Left: fixed-height image on md+ */}
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

        {/* Right: form pane */}
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

            <form onSubmit={rhfHandleSubmit(onSubmit)} className="space-y-6 mb-8">
              {state.isProcessing && (
                <div role="status" aria-live="polite" className="mb-4 flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <svg className="animate-spin w-5 h-5 text-[#0C2B4E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span className="text-sm text-gray-700">Processing — verifying your identity...</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input id="name" {...register('name', { required: 'Full name is required' })} placeholder={state.role === 'jobseeker' ? 'John Doe' : 'Jane Smith'} className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${rhfErrors.name ? 'border-red-400' : 'border-gray-300'}`} />
                  </div>
                  {rhfErrors.name && <div className="text-sm text-red-500 mt-1">{String(rhfErrors.name.message)}</div>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input id="email" type="email" {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} placeholder="you@example.com" className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${rhfErrors.email ? 'border-red-400' : 'border-gray-300'}`} />
                  </div>
                  {rhfErrors.email && <div className="text-sm text-red-500 mt-1">{String(rhfErrors.email.message)}</div>}
                </div>

                {state.role === 'jobseeker' && (
                  <>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input id="phone" {...register('phone', { required: 'Phone is required', pattern: { value: /^[0-9]{10,15}$/, message: 'Invalid phone' } })} placeholder="03xxxxxxxxx" className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${rhfErrors.phone ? 'border-red-400' : 'border-gray-300'}`} />
                      </div>
                      {rhfErrors.phone && <div className="text-sm text-red-500 mt-1">{String(rhfErrors.phone.message)}</div>}
                    </div>

                    <div>
                      <label htmlFor="cnic" className="block text-sm font-semibold text-gray-900 mb-2">CNIC (13 digits)</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input id="cnic" {...register('cnic', { required: 'CNIC is required', pattern: { value: /^[0-9]{13}$/, message: 'Invalid CNIC; use 13 digits' } })} placeholder="3510123456789" className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${rhfErrors.cnic ? 'border-red-400' : 'border-gray-300'}`} />
                      </div>
                      {rhfErrors.cnic && <div className="text-sm text-red-500 mt-1">{String(rhfErrors.cnic.message)}</div>}
                    </div>
                  </>
                )}

                {state.role === 'employer' && (
                  <>
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-semibold text-gray-900 mb-2">Company Name</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input id="companyName" {...register('companyName', { required: state.role === 'employer' ? 'Company name is required' : false })} placeholder="Your Company" className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${rhfErrors.companyName ? 'border-red-400' : 'border-gray-300'}`} />
                      </div>
                      {rhfErrors.companyName && <div className="text-sm text-red-500 mt-1">{String(rhfErrors.companyName.message)}</div>}
                    </div>

                    <div>
                      <label htmlFor="companyURL" className="block text-sm font-semibold text-gray-900 mb-2">Company URL</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input id="companyURL" {...register('companyURL', { required: state.role === 'employer' ? 'Company URL is required' : false, pattern: { value: /^https?:\/\//, message: 'Invalid URL' } })} placeholder="https://company.com" className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${rhfErrors.companyURL ? 'border-red-400' : 'border-gray-300'}`} />
                      </div>
                      {rhfErrors.companyURL && <div className="text-sm text-red-500 mt-1">{String(rhfErrors.companyURL.message)}</div>}
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input id="password" type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Too short' }, pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, message: 'Password must contain upper, lower, number and special char' } })} placeholder="••••••••" className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${rhfErrors.password ? 'border-red-400' : 'border-gray-300'}`} />
                  </div>
                  {rhfErrors.password && <div className="text-sm text-red-500 mt-1">{String(rhfErrors.password.message)}</div>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input id="confirmPassword" type="password" {...register('confirmPassword', { required: 'Confirm password is required', validate: (v) => v === getValues().password || 'Passwords must match' })} placeholder="••••••••" className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent ${rhfErrors.confirmPassword ? 'border-red-400' : 'border-gray-300'}`} />
                  </div>
                  {rhfErrors.confirmPassword && <div className="text-sm text-red-500 mt-1">{String(rhfErrors.confirmPassword.message)}</div>}
                </div>
              </div>

              {state.role === 'jobseeker' && (
                <div className="border-t pt-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-4">Identity Verification - Capture Your Photo</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <video ref={videoRef} className="w-full h-64 bg-black rounded-lg object-cover" autoPlay muted playsInline />
                      <div className="flex gap-2 mt-3">
                        {!state.isStreaming ? (
                          <button type="button" onClick={async () => {
                            try {
                              const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
                              dispatch({ type: 'setStream', payload: s });
                              if (videoRef.current) { videoRef.current.srcObject = s; await videoRef.current.play(); }
                              dispatch({ type: 'setIsStreaming', payload: true });
                            } catch (err) { console.error('Camera error', err); }
                          }} className="px-4 py-2 bg-[#0C2B4E] text-white rounded-lg hover:bg-[#1A3D64] transition">Open Camera</button>
                        ) : (
                          <>
                            <button type="button" onClick={() => { if (state.stream) state.stream.getTracks().forEach(t => t.stop()); dispatch({ type: 'setStream', payload: null }); dispatch({ type: 'setIsStreaming', payload: false }); }} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">Stop Camera</button>

                            <button type="button" disabled={!state.isStreaming || state.faceCount !== 1} className={`px-4 py-2 rounded-lg ${state.faceCount !== 1 ? 'bg-gray-300' : 'bg-green-600 text-white hover:bg-green-700 transition'}`} onClick={() => {
                              const video = videoRef.current; if (!video) return; const canvas = document.createElement('canvas'); canvas.width = video.videoWidth || 640; canvas.height = video.videoHeight || 480; const ctx = canvas.getContext('2d'); if (!ctx) return; ctx.drawImage(video, 0, 0, canvas.width, canvas.height); canvas.toBlob((blob) => { if (!blob) return; const file = new File([blob], 'capture.jpg', { type: blob.type }); if (state.preview) URL.revokeObjectURL(state.preview); const url = URL.createObjectURL(file); dispatch({ type: 'setPreview', payload: url }); setValue('captureImage', file); }, 'image/jpeg');
                            }}>{state.faceCount === 0 ? 'No face detected' : state.faceCount > 1 ? 'Multiple faces detected' : 'Capture Photo'}</button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      {state.preview ? (
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-2">Captured Image:</p>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={state.preview as string} alt="capture preview" className="w-full h-64 object-cover rounded-lg border-2 border-green-500" />

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div>
                              <button type="button" onClick={verifyFace} disabled={state.isProcessing} className={`px-4 py-2 rounded-lg font-medium ${state.isProcessing ? 'bg-gray-300 text-gray-700' : 'bg-[#0C2B4E] text-white hover:bg-[#1A3D64]'}`}>
                                Verify Identity
                              </button>
                            </div>
                            <div className="text-right">
                              {state.faceVerified ? (
                                <span className="inline-flex items-center gap-2 text-green-700 font-semibold"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Verified</span>
                              ) : (
                                <span className="text-sm text-gray-600">Not verified</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500"><p>No image captured yet</p><p className="text-sm mt-2">Click Capture Photo after opening camera</p></div>
                      )}
                    </div>
                  </div>
                  {rhfErrors.captureImage && <div className="text-sm text-red-500 mt-2">{String(rhfErrors.captureImage.message)}</div>}
                </div>
              )}

              <div className="border-t pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="terms" {...register('terms', { required: 'You must accept the terms' })} className="w-5 h-5 rounded border-gray-300 accent-[#0C2B4E] focus:ring-[#0C2B4E] cursor-pointer mt-1" />
                  <label htmlFor="terms" className="text-sm text-gray-600">I agree to CareerTrust&apos;s <a href="#terms" className="text-[#0C2B4E] hover:text-[#1A3D64] font-semibold">Terms of Service</a> and <a href="#privacy" className="text-[#0C2B4E] hover:text-[#1A3D64] font-semibold">Privacy Policy</a></label>
                </div>
                {rhfErrors.terms && <div className="text-sm text-red-500">{String(rhfErrors.terms.message)}</div>}

                <button type="submit" disabled={state.isProcessing || (state.role === 'jobseeker' && !state.faceVerified)} className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-lg transition ${(state.isProcessing || (state.role === 'jobseeker' && !state.faceVerified)) ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-[#0C2B4E] text-white hover:bg-[#1A3D64]'}`}>
                  {state.isProcessing ? (<><svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>Processing...</>) : (<><span>Create Account</span> <ArrowRight className="w-5 h-5" /></>)}
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
  );
}
