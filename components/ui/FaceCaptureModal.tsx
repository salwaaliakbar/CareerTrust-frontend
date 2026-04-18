
"use client";

import React from "react";
import { X } from "lucide-react";

type Props = {
  show: boolean;
  isProcessing: boolean;
  preview: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isStreaming: boolean;
  faceCount: number;
  modelsLoaded: boolean;
  faceDetectionError: string | null;
  capturedImage: File | null;
  onOpenCamera: () => Promise<void> | void;
  onStopCamera: () => void;
  onCapturePhoto: () => void;
  onRetake: () => Promise<void> | void;
  onClose: () => void;
  onVerify: () => void;
};

export default function FaceCaptureModal({
  show,
  isProcessing,
  preview,
  videoRef,
  isStreaming,
  faceCount,
  modelsLoaded,
  faceDetectionError,
  capturedImage,
  onOpenCamera,
  onStopCamera,
  onCapturePhoto,
  onRetake,
  onClose,
  onVerify,
}: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Identity Verification</h2>
          <button
            aria-label="Close verification dialog"
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {isProcessing && (
            <div role="status" aria-live="polite" className="mb-4 flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <svg className="animate-spin w-5 h-5 text-[#0C2B4E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-sm text-gray-700">Verifying your identity...</span>
            </div>
          )}

          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              To ensure the security and authenticity of all accounts on CareerTrust, we require face verification for job seekers.
            </p>
            <p className="text-sm text-gray-600">
              Please capture a clear photo of your face. Make sure you are in a well-lit area and looking directly at the camera.
            </p>
            {faceDetectionError && (
              <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                {faceDetectionError}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Camera Feed */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Camera Feed</label>
              <video
                ref={videoRef}
                className="w-full h-64 bg-black rounded-lg object-cover border-2 border-gray-300"
                autoPlay
                muted
                playsInline
              />

              {isStreaming && faceCount > 0 && (
                <div className="mt-2 text-center">
                  <span className={`text-sm font-medium ${faceCount === 1 ? 'text-green-600' : 'text-orange-600'}`}>
                    {faceCount === 1 ? '✓ One face detected' : `⚠ ${faceCount} faces detected`}
                  </span>
                </div>
              )}

              {isStreaming && !modelsLoaded && !faceDetectionError && (
                <div className="mt-2 text-center text-sm text-blue-700">
                  Initializing face detector...
                </div>
              )}

              <div className="flex gap-2 mt-3">
                {!isStreaming ? (
                  <button
                    type="button"
                    onClick={onOpenCamera}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 bg-[#0C2B4E] text-white rounded-lg hover:bg-[#1A3D64] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Open Camera
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={onStopCamera}
                      disabled={isProcessing}
                      className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Stop Camera
                    </button>

                    <button
                      type="button"
                      disabled={
                        !isStreaming ||
                        !modelsLoaded ||
                        faceCount !== 1 ||
                        isProcessing
                      }
                      className={`flex-1 px-4 py-2 rounded-lg transition ${
                        (!modelsLoaded || faceCount !== 1 || isProcessing)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                      onClick={onCapturePhoto}
                    >
                      {!modelsLoaded
                        ? 'Detector not ready'
                        : faceCount === 0
                          ? 'No face detected'
                          : faceCount > 1
                            ? 'Multiple faces'
                            : 'Capture Photo'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Captured Image</label>
              <div className="flex items-center justify-center">
                {preview ? (
                  <div className="w-full">
                    <img
                      src={preview as string}
                      alt="Captured face"
                      className="w-full h-64 object-cover rounded-lg border-2 border-green-500"
                      draggable={false}
                    />
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={onRetake}
                        disabled={isProcessing}
                        className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        Retake
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center text-gray-500">
                      <p>No image captured yet</p>
                      <p className="text-sm mt-2">Open camera and capture your photo</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3 justify-end border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onVerify}
              disabled={!capturedImage || isProcessing}
              className={`px-6 py-2.5 rounded-lg font-medium transition ${
                !capturedImage || isProcessing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#0C2B4E] text-white hover:bg-[#1A3D64]'
              }`}
            >
              {isProcessing ? 'Verifying...' : 'Verify & Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
