"use client";

import { useReducer, useEffect, useRef, useState } from "react";
import RoleSelect from "./RoleSelect";
import SignupFields from "./SignupFields";
import { useForm } from "react-hook-form";

import Swal from "sweetalert2";
import * as faceapi from "face-api.js";
import FaceCaptureModal from "../ui/FaceCaptureModal";

type Role = "jobseeker" | "employer";

type FormValues = {
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
    | { type: "setFaceVerified"; payload: boolean }
    | { type: "setShowFacePopup"; payload: boolean };

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
    showFacePopup: false,
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
      case "setShowFacePopup":
        return { ...state, showFacePopup: action.payload };
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

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)]);
      dispatch({ type: "setModelsLoaded", payload: true });
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
          dispatch({ type: "setFaceCount", payload: detections.length });
      } catch (e) {
        console.error("face detection error", e);
      }
    }, 500);

    return () => {
      isMounted = false;
      clearInterval(interval);
      dispatch({ type: "setFaceCount", payload: 0 });
    };
  }, [state.modelsLoaded, state.isStreaming]);

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    reset,
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

  async function onSubmit(values: FormValues) {
    if (state.role === "jobseeker") {
      setPendingFormData(values);
      dispatch({ type: "setShowFacePopup", payload: true });
    } else {
      await submitSignup(values);
    }
  }

  async function submitSignup(values: FormValues) {
    dispatch({ type: "setIsProcessing", payload: true });
    try {
      // all your backend signup endpoint logic here

      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Your account has been successfully created. Redirecting to login...",
      }).then(() => {
        // redirect to login or other action
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: errMsg || "An unexpected error occurred during signup.",
      });
      resetForm();
    } finally {
      dispatch({ type: "setIsProcessing", payload: false });
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

    dispatch({ type: "setIsProcessing", payload: true });

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

      dispatch({ type: "setFaceVerified", payload: true });
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
      dispatch({ type: "setIsProcessing", payload: false });
    }
  }

  function closeFacePopup() {
    if (state.stream) state.stream.getTracks().forEach((t) => t.stop());
    dispatch({ type: "setStream", payload: null });
    dispatch({ type: "setIsStreaming", payload: false });
    dispatch({ type: "setPreview", payload: null });
    dispatch({ type: "setShowFacePopup", payload: false });
    dispatch({ type: "setFaceCount", payload: 0 });
    setCapturedImage(null);
  }

  function resetForm() {
    reset();
    setPendingFormData(null);
    dispatch({ type: "setFaceVerified", payload: false });
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
      dispatch({ type: "setPreview", payload: url });
      setCapturedImage(file);
    }, "image/jpeg");
  }

  async function handleRetake() {
    // Clear preview and captured image, then restart camera immediately
    dispatch({ type: "setPreview", payload: null });
    setCapturedImage(null);
    await openCamera();
  }

  async function openCamera() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      dispatch({ type: "setStream", payload: s });
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
      dispatch({ type: "setIsStreaming", payload: true });
    } catch (err) {
      console.error("Camera error", err);
      Swal.fire({
        icon: "error",
        title: "Camera Error",
        text: "Could not access camera. Please check permissions.",
      });
    }
  }

  function stopCamera() {
    if (state.stream) state.stream.getTracks().forEach((t) => t.stop());
    dispatch({ type: "setStream", payload: null });
    dispatch({ type: "setIsStreaming", payload: false });
  }

  // Step 1: Role selection
  if (state.step === 1) return <RoleSelect onSelectRole={handleRoleSelect} />;

  // Step 2: Signup fields + face capture modal
  return (
    <>
      <SignupFields
        state={state}
        register={register}
        rhfErrors={rhfErrors}
        rhfHandleSubmit={rhfHandleSubmit}
        onSubmit={onSubmit}
        dispatch={dispatch}
        videoRef={videoRef}
        capturedImage={capturedImage}
        openCamera={openCamera}
        stopCamera={stopCamera}
        capturePhoto={capturePhoto}
        verifyFaceAndSubmit={verifyFaceAndSubmit}
        closeFacePopup={closeFacePopup}
        submitSignup={submitSignup}
        resetForm={resetForm}
        setCapturedImage={setCapturedImage}
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
