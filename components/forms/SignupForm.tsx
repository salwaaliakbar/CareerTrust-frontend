"use client";

import { useReducer, useEffect, useRef, useState } from "react";
import RoleSelect from "./RoleSelect";
import SignupFields from "./SignupFields";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import * as faceapi from "face-api.js";
import FaceCaptureModal from "../ui/FaceCaptureModal";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { JOBSEEKER, EMPLOYER } from "@/constants/constant";
import { ACTIONS } from "@/constants/signupActions";
import logger from "@/lib/logger";

type Role = typeof JOBSEEKER | typeof EMPLOYER;

export type FormValues = {
  name: string;
  companyName: string;
  companyURL: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  phone: string;
  cnic: string;
};

export type SignupAction =
  | { type: typeof ACTIONS.setRole; payload: Role }
  | { type: typeof ACTIONS.setStep; payload: number }
  | { type: typeof ACTIONS.setPreview; payload: string | null }
  | { type: typeof ACTIONS.setStream; payload: MediaStream | null }
  | { type: typeof ACTIONS.setIsStreaming; payload: boolean }
  | { type: typeof ACTIONS.setFaceCount; payload: number }
  | { type: typeof ACTIONS.setModelsLoaded; payload: boolean }
  | { type: typeof ACTIONS.setIsProcessing; payload: boolean }
  | { type: typeof ACTIONS.setFaceVerified; payload: boolean }
  | { type: typeof ACTIONS.setShowFacePopup; payload: boolean }
  | { type: typeof ACTIONS.setVerifying; payload: boolean };

export type SignupDispatch = React.Dispatch<SignupAction>;

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
    showFacePopup: boolean;
    verifying: boolean;
  };

  /* using exported SignupAction type from module scope */

  const initialState: State = {
    role: initialRole || JOBSEEKER,
    step: 1,
    preview: null,
    stream: null,
    isStreaming: false,
    faceCount: 0,
    modelsLoaded: false,
    isProcessing: false,
    faceVerified: false,
    showFacePopup: false,
    verifying: false,
  };

  function reducer(state: State, action: SignupAction): State {
    switch (action.type) {
      case ACTIONS.setRole:
        return { ...state, role: action.payload };
      case ACTIONS.setStep:
        return { ...state, step: action.payload };
      case ACTIONS.setPreview:
        return { ...state, preview: action.payload };
      case ACTIONS.setStream:
        return { ...state, stream: action.payload };
      case ACTIONS.setIsStreaming:
        return { ...state, isStreaming: action.payload };
      case ACTIONS.setFaceCount:
        return { ...state, faceCount: action.payload };
      case ACTIONS.setModelsLoaded:
        return { ...state, modelsLoaded: action.payload };
      case ACTIONS.setIsProcessing:
        return { ...state, isProcessing: action.payload };
      case ACTIONS.setFaceVerified:
        return { ...state, faceVerified: action.payload };
      case ACTIONS.setShowFacePopup:
        return { ...state, showFacePopup: action.payload };
      case ACTIONS.setVerifying:
        return { ...state, verifying: action.payload };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const [pendingFormData, setPendingFormData] = useState<FormValues | null>(
    null
  );
  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // const [verifying, setVerifying] = useState(false);
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const handleRoleSelect = (selectedRole: Role) => {
    dispatch({ type: ACTIONS.setRole, payload: selectedRole });
    dispatch({ type: ACTIONS.setStep, payload: 2 });
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

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      dispatch({ type: ACTIONS.setModelsLoaded , payload: true });
    };
    loadModels();
  }, []);

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
        if (isMounted)
          dispatch({ type: ACTIONS.setFaceCount, payload: detections.length });
      } catch (e) {
       logger.error("Face detection error:", e);
      }
    }, 500);

    return () => {
      isMounted = false;
      clearInterval(interval);
      dispatch({ type: ACTIONS.setFaceCount, payload: 0 });
    };
  }, [state.modelsLoaded, state.isStreaming]);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors: rhfErrors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      companyName: "",
      companyURL: "",
      phone: "",
      cnic: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (state.role === JOBSEEKER) {
      setPendingFormData(values);
      // await submitSignup(values);
      dispatch({ type: ACTIONS.setShowFacePopup, payload: true });
    } else {
      await submitSignup(values);
    }
  };

  async function submitSignup(values: FormValues) {
    dispatch({ type: ACTIONS.setIsProcessing, payload: true });
    // all your backend signup endpoint logic here
    if (!isLoaded) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Authentication system is not ready. Please refresh the page.",
      });
      return;
    }
    dispatch({ type: ACTIONS.setIsProcessing, payload: true });
    try {
      // Create user in Clerk
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
        firstName: values.name.split(" ")[0],
        lastName: values.name.split(" ").slice(1).join(" ") || "",
        unsafeMetadata: {
          role: state.role,
          ...(state.role === JOBSEEKER && {
            phone: values.phone,
            cnic: values.cnic,
          }),
          ...(state.role === EMPLOYER && {
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
      dispatch({ type: ACTIONS.setVerifying, payload: true });
      // if (state.role === "jobseeker") {
      //   dispatch({ type: ACTIONS.setShowFacePopup, payload: true });
      // }

      const { value: code } = await Swal.fire({
        title: "Verify Your Email",
        html: `
    <p class="mb-4">A 6 digit code was sent to <strong>${
      values.email
    }</strong></p>
    <div id="otp-container" class="flex justify-center gap-3 mt-3">
      ${Array(6)
        .fill(0)
        .map(
          (_, i) => `
          <input 
            type="text" 
            id="otp-${i}" 
            maxlength="1" 
            class="otp-input w-10 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-400 transition-all duration-200"
          />
        `
        )
        .join("")}
    </div>
  `,
        showCancelButton: true,
        confirmButtonText: "Verify",
        confirmButtonColor: "#0C2B4E",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
        preConfirm: () => {
          let finalCode = "";
          for (let i = 0; i < 6; i++) {
            const element = document.getElementById(`otp-${i}`) as HTMLInputElement | null;
            const val = element?.value;
            if (!val) return Swal.showValidationMessage("Enter all 6 digits");
            finalCode += val;
          }
          return finalCode;
        },
        didOpen: () => {
          const inputs = document.querySelectorAll(".otp-input") as NodeListOf<HTMLInputElement>;
          inputs[0]?.focus();

          inputs.forEach((input, index) => {
            input.addEventListener("input", () => {
              if (input.value.length === 1 && index < 5) {
                (inputs[index + 1] as HTMLInputElement)?.focus();
              }
            });

            input.addEventListener("keydown", (e) => {
              if (e.key === "Backspace" && index > 0 && !input.value) {
                (inputs[index - 1] as HTMLInputElement)?.focus();
              }
            });
          });
        },
      });

      if (!code) {
        dispatch({ type: ACTIONS.setVerifying, payload: false });
        dispatch({ type: ACTIONS.setIsProcessing, payload: false });
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
          showConfirmButton: true,
        });

        // Redirect based on role
        setTimeout(() => {
          if (state.role === JOBSEEKER) {
            router.push("/jobseeker");
            // router.push("/");
          } else {
            router.push("/employer");
            // router.push("/");
          }
        }, 2000);
      } else {
        throw new Error("Verification incomplete");
      }
    } catch (err: unknown) {
      logger.error("Signup error:", err);

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

      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: errorMessage,
      });
    } finally {
      dispatch({ type: ACTIONS.setVerifying, payload: false });
      dispatch({ type: ACTIONS.setIsProcessing, payload: false });
    }
  }

  async function verifyFaceAndSubmit() {
    if (!capturedImage) {
      Swal.fire({
        icon: "warning",
        title: "No image",
        text: "Please capture an image first.",
      });
      return;
    }

    if (!pendingFormData) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Form data is missing. Please try again.",
      });
      closeFacePopup();
      return;
    }

    dispatch({ type: ACTIONS.setIsProcessing, payload: true });

    try {
      const formData = new FormData();
      formData.append("file", capturedImage);
      formData.append("user_id", pendingFormData.email);
      formData.append("save_if_new", "1");
      const resp = await fetch("/api/auth/face-check", {
        method: "POST",
        body: formData,
      });
      let result: unknown = {};
      try {
        result = await resp.json();
      } catch (e) {
        console.error("Invalid JSON from face-check", e);
      }
      const resObj = result as {
        error?: string;
        details?: string;
        match?: boolean;
        saved?: boolean;
      };
      if (!resp.ok) {
        const message =
          resObj?.error || resObj?.details || `Service returned ${resp.status}`;
        throw new Error(message);
      }
      if (resObj?.match) {
        throw new Error(
          "This face is already registered. If this is your face, please contact support or use a different verification method."
        );
      }

      dispatch({ type: ACTIONS.setFaceVerified, payload: true });
      Swal.fire({
        icon: "success",
        title: "Face Verified",
        text: "Identity verification successful. Creating your account...",
        timer: 2000,
        showConfirmButton: false,
      });
      closeFacePopup();
      await submitSignup(pendingFormData);
    } catch (err) {
      const errMsg =
        err instanceof Error
          ? err.message
          : "An error occurred during face verification";
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: errMsg,
      }).then(() => {
        resetForm();
        closeFacePopup();
      });
    } finally {
      dispatch({ type: ACTIONS.setIsProcessing, payload: false });
    }
  }

  function closeFacePopup() {
    if (state.stream) state.stream.getTracks().forEach((t) => t.stop());
    dispatch({ type: ACTIONS.setStream, payload: null });
    dispatch({ type: ACTIONS.setIsStreaming, payload: false });
    dispatch({ type: ACTIONS.setPreview, payload: null });
    dispatch({ type: ACTIONS.setShowFacePopup, payload: false });
    dispatch({ type: ACTIONS.setFaceCount, payload: 0 });
    setCapturedImage(null);
  }

  function resetForm() {
    reset();
    setPendingFormData(null);
    dispatch({ type: ACTIONS.setFaceVerified, payload: false });
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "capture.jpg", { type: blob.type });
      if (state.preview) URL.revokeObjectURL(state.preview);
      const url = URL.createObjectURL(file);
      dispatch({ type: ACTIONS.setPreview, payload: url });
      setCapturedImage(file);
    }, "image/jpeg");
  }

  async function handleRetake() {
    // Clear preview and captured image, then restart camera immediately
    dispatch({ type: ACTIONS.setPreview, payload: null });
    setCapturedImage(null);
    await openCamera();
  }

  async function openCamera() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      dispatch({ type: ACTIONS.setStream, payload: s });
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
      dispatch({ type: ACTIONS.setIsStreaming, payload: true });
    } catch (err) {
      logger.error("Camera error", err);
      dispatch({ type: ACTIONS.setIsStreaming, payload: false });
      Swal.fire({
        icon: "error",
        title: "Camera Error",
        text: "Could not access camera. Please check permissions.",
      });
    }
  }

  function stopCamera() {
    if (state.stream) state.stream.getTracks().forEach((t) => t.stop());
    dispatch({ type: ACTIONS.setStream, payload: null });
    dispatch({ type: ACTIONS.setIsStreaming, payload: false });
  }

  // Step 1: Role selection
  if (state.step === 1) return <RoleSelect onSelectRole={handleRoleSelect} />;

  // Step 2: Signup fields + face capture modal
  return (
    <>
      <SignupFields
        state={{
          role: state.role,
          isProcessing: state.isProcessing,
          verifying: state.verifying,
        }}
        register={register}
        rhfErrors={rhfErrors}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        getValues={getValues}
        dispatch={dispatch}
      />

      <FaceCaptureModal
        show={state.showFacePopup}
        isProcessing={state.isProcessing}
        preview={state.preview}
        videoRef={videoRef}
        isStreaming={state.isStreaming}
        faceCount={state.faceCount}
        capturedImage={capturedImage}
        onOpenCamera={openCamera}
        onStopCamera={stopCamera}
        onCapturePhoto={capturePhoto}
        onRetake={handleRetake}
        onClose={closeFacePopup}
        onVerify={verifyFaceAndSubmit}
      />
    </>
  );
}
