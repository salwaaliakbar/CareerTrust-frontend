"use client";

import React, { useRef } from "react";
import {
  UploadCloud,
  Trash,
  FileText,
  Sparkles,
} from "lucide-react";

interface ResumeUploadProps {
  resumeFile: File | null;
  autoFilling: boolean;
  onFileChange: (file: File | null) => void;
  onAutoFill: (file: File) => Promise<void>;
}

export default function ResumeUpload({
  resumeFile,
  autoFilling,
  onFileChange,
  onAutoFill,
}: ResumeUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleResumePick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (f) {
      onFileChange(f);
      await onAutoFill(f);
    }
  }

  function removeResume() {
    onFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="top-6 group relative">
      <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-blue-100 to-transparent rounded-full blur-3xl opacity-50"></div>

        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Resume Upload
          </h3>
          <span className="text-xs font-black text-blue-700 bg-linear-to-r from-blue-100 to-purple-100 px-3 py-1.5 rounded-full border border-blue-200 shadow-sm">
            PDF / DOCX
          </span>
        </div>

        <div className="space-y-5 relative z-10">
          {/* Resume Display Area */}
          {resumeFile ? (
            <div className="border-3 border-[#0C2B4E] bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full blur-md animate-pulse"></div>
                  <div className="relative p-5 bg-linear-to-br from-blue-600 to-indigo-600 rounded-full shadow-xl">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-slate-800 mb-2 truncate max-w-[200px]">
                    {resumeFile.name}
                  </p>
                  <p className="text-xs font-bold text-blue-700 bg-white/80 px-3 py-1.5 rounded-full inline-block shadow-sm">
                    {(resumeFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            </div>
          ) : autoFilling ? (
            <div className="border-3 border-dashed border-blue-500 bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-10 shadow-inner">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full blur-lg animate-pulse"></div>
                  <div className="relative p-5 bg-linear-to-br from-blue-600 to-indigo-600 rounded-full shadow-2xl animate-pulse">
                    <FileText className="w-10 h-10 text-white animate-bounce" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-slate-800 mb-2">
                    Parsing resume...
                  </p>
                  <p className="text-xs font-semibold text-slate-500 mb-3">
                    Auto-filling your profile
                  </p>
                  <div className="flex gap-1.5 justify-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
                    <span
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-100"
                    ></span>
                    <span
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-200"
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="border-3 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 group/upload cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <UploadCloud className="w-16 h-16 text-slate-400 mx-auto mb-4 group-hover/upload:text-blue-500 group-hover/upload:scale-110 transition-all duration-300" />
              <p className="text-sm font-bold text-slate-500 group-hover/upload:text-slate-700 transition-colors">
                Click to upload resume
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full group/btn inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#0C2B4E] to-[#1D546C] text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 font-black overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-linear-to-r from-[#1A3D64] to-[#0C2B4E] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <UploadCloud className="w-6 h-6 relative z-10 group-hover/btn:animate-bounce text-white" />
              <span className="relative z-10">
                {resumeFile ? "Change Resume" : "Upload Resume"}
              </span>
            </button>

            {resumeFile && (
              <button
                type="button"
                onClick={removeResume}
                className="w-full group/btn inline-flex items-center justify-center gap-2 bg-linear-to-r from-rose-50 to-red-100 text-rose-700 px-6 py-3.5 rounded-xl hover:from-rose-100 hover:to-red-200 hover:shadow-lg transition-all duration-200 font-black border-2 border-rose-200"
              >
                <Trash className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                Remove Resume
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumePick}
            className="hidden"
            aria-label="Upload resume file"
            title="Upload resume file"
          />

          {/* Info Box */}
          <div className="bg-linear-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-5 border-2 border-blue-200 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/40 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex gap-3">
              <div className="">
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-blue-900 mb-1">
                  Auto-Fill Magic!
                </p>
                <p className="text-xs text-blue-700 leading-relaxed font-semibold">
                  Upload your resume and we{`'`}ll automatically extract your
                  information and employment history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}