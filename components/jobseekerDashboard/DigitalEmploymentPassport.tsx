"use client";

import React, { useRef, useState } from "react";
import {
  CheckCircle2,
  Building2,
  Calendar,
  FileCheck,
  AlertCircle,
  Shield,
  Briefcase,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { EmploymentRecord } from "@/types/jobseeker.types";

interface DigitalEmploymentPassportProps {
  verifiedEmployment: EmploymentRecord[];
}

export default function DigitalEmploymentPassport({
  verifiedEmployment,
}: DigitalEmploymentPassportProps) {
  const passportRef = useRef<HTMLDivElement>(null);
  const [expandedDocuments, setExpandedDocuments] = useState<Set<string>>(new Set());

  const toggleDocuments = (empId: string) => {
    setExpandedDocuments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(empId)) {
        newSet.delete(empId);
      } else {
        newSet.add(empId);
      }
      return newSet;
    });
  };

  // Calculate total years of experience from verified employment
  const calculateTotalExperience = () => {
    let totalMonths = 0;
    
    verifiedEmployment.forEach((emp) => {
      // Parse MM/YYYY format
      const parseDate = (dateStr: string) => {
        if (!dateStr) return null;
        const parts = dateStr.split('/');
        if (parts.length === 2) {
          const month = parseInt(parts[0]) - 1; // 0-indexed
          const year = parseInt(parts[1]);
          return new Date(year, month, 1);
        }
        return new Date(dateStr);
      };
      
      const startDate = parseDate(emp.startDate);
      const endDate = emp.currentlyWorking ? new Date() : parseDate(emp.endDate);
      
      if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                      (endDate.getMonth() - startDate.getMonth());
        totalMonths += Math.max(0, months);
      }
    });
    
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    
    if (years === 0 && months === 0) return "0 months";
    if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`;
    if (months === 0) return `${years} year${years !== 1 ? 's' : ''}`;
    return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
  };

  // const downloadPDF = async () => {
  //   console.log("[PDF] Starting download process...");
  //   const element = passportRef.current;
  //   console.log("[PDF] Element found:", !!element);
   
  //   if (!element) {
  //     alert("Error: Could not find passport element");
  //     return;
  //   }

  //   console.log("[PDF] Original element - scrollWidth:", element.scrollWidth, "scrollHeight:", element.scrollHeight);

  //   let originalHTML = "";
  //   let clonedElement: HTMLDivElement | null = null;
  //   try {
  //     // Dynamically import libraries to avoid SSR issues
  //     const html2Canvas = (await import("html2canvas")).default;
  //     const jsPDF = (await import("jspdf")).jsPDF;
  //     console.log("[PDF] Libraries imported successfully");

  //     // Show loading state
  //     const buttonElement = document.querySelector(
  //       "#download-pdf-btn"
  //     ) as HTMLButtonElement | null;
      
  //     if (buttonElement) {
  //       buttonElement.disabled = true;
  //       originalHTML = buttonElement.innerHTML;
  //       buttonElement.innerHTML = '<span class="flex items-center gap-2"><svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating PDF...</span>';
  //       await new Promise(resolve => setTimeout(resolve, 100));
  //     }

  //     console.log("[PDF] Cloning element...");
  //     // Clone the element
  //     clonedElement = element.cloneNode(true) as HTMLDivElement;
  //     console.log("[PDF] Cloned element - scrollWidth:", clonedElement.scrollWidth, "scrollHeight:", clonedElement.scrollHeight);
      
  //     // Hide header and decorative elements, keep only employment cards
  //     const hideSelectors = [
  //       '.fixed', // Fixed background blobs
  //       '[class*="animate-blob"]',
  //       '[class*="animate-ping"]',
  //       '.absolute.inset-0', // Gradient overlays
  //     ];
      
  //     hideSelectors.forEach(selector => {
  //       const elements = clonedElement.querySelectorAll(selector);
  //       elements.forEach(el => {
  //         (el as HTMLElement).style.display = 'none';
  //       });
  //     });
      
  //     // Inject professional styling with safe RGB colors
  //     const styleTag = document.createElement('style');
  //     styleTag.textContent = `
  //       * {
  //         background-image: none !important;
  //         filter: none !important;
  //         backdrop-filter: none !important;
  //         mix-blend-mode: normal !important;
  //         animation: none !important;
  //       }
        
  //       /* Professional color scheme using only RGB */
  //       body, .min-h-screen {
  //         background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
  //       }
        
  //       /* Header styling */
  //       .relative.bg-gradient-to-r {
  //         background: linear-gradient(90deg, #0A1F44 0%, #1e3a5f 50%, #2d4a6f 100%) !important;
  //         border: 2px solid rgba(255, 255, 255, 0.1) !important;
  //         box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
  //       }
        
  //       h1 {
  //         background: linear-gradient(90deg, #ffffff 0%, #e0f2fe 100%) !important;
  //         -webkit-background-clip: text !important;
  //         background-clip: text !important;
  //         color: transparent !important;
  //       }
        
  //       /* Card styling */
  //       .group.relative.transform {
  //         background: rgba(255, 255, 255, 0.9) !important;
  //         border: 2px solid #3b82f6 !important;
  //         box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
  //       }
        
  //       /* Status badges */
  //       .inline-flex.items-center.gap-2.px-4 {
  //         background-color: #10b981 !important;
  //         color: #ffffff !important;
  //         border: 2px solid #059669 !important;
  //       }
        
  //       /* Icons and badges inside cards */
  //       .p-3.bg-gradient-to-br {
  //         background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%) !important;
  //       }
        
  //       .p-2\\.5.bg-gradient-to-br {
  //         background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%) !important;
  //       }
        
  //       /* Text colors */
  //       .text-\\[\\#1D546C\\], [class*="text-blue"], [class*="text-indigo"] {
  //         color: #1e40af !important;
  //       }
        
  //       .text-gray-600, .text-gray-500 {
  //         color: #4b5563 !important;
  //       }
        
  //       .text-gray-900 {
  //         color: #111827 !important;
  //       }
        
  //       .text-white, .text-blue-200, .text-blue-100 {
  //         color: #ffffff !important;
  //       }
        
  //       .text-emerald-600, .text-emerald-700 {
  //         color: #059669 !important;
  //       }
        
  //       /* SVG icons */
  //       svg {
  //         display: inline-block !important;
  //       }
        
  //       /* Remove hover effects */
  //       * {
  //         transition: none !important;
  //       }
  //     `;
  //     clonedElement.appendChild(styleTag);
  //     console.log("[PDF] Professional styles injected");
      
  //     // Remove only problematic classes, keep layout and basic styling
  //     const allElements = clonedElement.querySelectorAll("*");
  //     console.log("[PDF] Total elements to process:", allElements.length);
      
  //     let classRemovalStats = {
  //       totalElements: allElements.length,
  //       elementsProcessed: 0,
  //     };
      
  //     allElements.forEach((el) => {
  //       const htmlEl = el as HTMLElement;
  //       const classList = htmlEl.className;
        
  //       if (typeof classList === 'string') {
  //         // Remove only transition, animation, and state classes
  //         const classesToRemove = [
  //           'group-hover:', 'hover:', 'focus:', 'active:', 'disabled:',
  //           'animate-blob', 'animate-ping', 'animation-delay',
  //           'pointer-events-none',
  //         ];
          
  //         const classArray = classList.split(' ');
  //         const filteredClasses = classArray.filter(cls => {
  //           return !classesToRemove.some(pattern => cls.includes(pattern));
  //         });
          
  //         htmlEl.className = filteredClasses.join(' ');
  //         classRemovalStats.elementsProcessed++;
  //       }
  //     });
      
  //     console.log("[PDF] Class removal stats:", classRemovalStats);

  //     console.log("[PDF] Adding cloned element to DOM...");
  //     // Add the cloned element temporarily to the DOM
  //     clonedElement.style.position = "absolute";
  //     clonedElement.style.left = "0";
  //     clonedElement.style.top = "-9999px";
  //     clonedElement.style.width = "800px";
  //     clonedElement.style.padding = "32px";
  //     clonedElement.style.backgroundColor = '#ffffff';
  //     clonedElement.style.color = '#000000';
  //     document.body.appendChild(clonedElement);

  //     console.log("[PDF] Element added to DOM - final size:", clonedElement.scrollWidth, "x", clonedElement.scrollHeight);

  //     console.log("[PDF] Starting canvas conversion...");
  //     // Generate canvas from the cloned element with higher quality
  //     const canvas = await html2Canvas(clonedElement, {
  //       scale: 2,
  //       useCORS: true,
  //       logging: false,
  //       backgroundColor: "#ffffff",
  //       windowWidth: 800,
  //       windowHeight: clonedElement.scrollHeight,
  //       allowTaint: true,
  //       removeContainer: false,
  //     });

  //     console.log("[PDF] Canvas created - dimensions:", canvas.width, "x", canvas.height);

  //     console.log("[PDF] Removing cloned element from DOM...");
  //     // Remove the cloned element from DOM
  //     document.body.removeChild(clonedElement);
  //     clonedElement = null;

  //     // Calculate PDF dimensions
  //     const imgWidth = 210; // A4 width in mm
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     const pageHeight = 297; // A4 height in mm
      
  //     console.log("[PDF] PDF calculations - imgWidth:", imgWidth, "mm, imgHeight:", imgHeight, "mm, pageHeight:", pageHeight, "mm");
      
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     let heightLeft = imgHeight;
  //     let position = 0;
  //     let pageCount = 1;

  //     console.log("[PDF] Converting canvas to JPEG...");
  //     // Convert canvas to image
  //     const imgData = canvas.toDataURL("image/jpeg", 0.95);
  //     console.log("[PDF] Image data URL length:", imgData.length, "bytes");
  
  //     console.log("[PDF] Adding first page...");
  //     // Add pages
  //     pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;

  //     while (heightLeft > 0) {
  //       position = heightLeft - imgHeight;
  //       console.log("[PDF] Adding page", pageCount + 1);
  //       pdf.addPage();
  //       pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;
  //       pageCount++;
  //     }

  //     console.log("[PDF] Total pages:", pageCount);

  //     // Generate filename with current date
  //     const date = new Date().toISOString().split('T')[0];
  //     const filename = `employment-passport-${date}.pdf`;
      
  //     console.log("[PDF] Saving PDF with filename:", filename);
  //     // Save PDF
  //     pdf.save(filename);
  //     console.log("[PDF] PDF saved successfully!");

  //     // Reset button state
  //     const buttonElement2 = document.querySelector(
  //       "#download-pdf-btn"
  //     ) as HTMLButtonElement | null;
  //     if (buttonElement2) {
  //       buttonElement2.disabled = false;
  //       buttonElement2.innerHTML = originalHTML;
  //     }
      
  //     console.log("[PDF] Download process completed!");
    
  //   } catch (error) {
  //     console.error("[PDF] Download failed with error:", error);
  //     if (error instanceof Error) {
  //       console.error("[PDF] Error message:", error.message);
  //       console.error("[PDF] Error stack:", error.stack);
  //     }
  //     alert("Error generating PDF. Check browser console for details. Error: " + (error instanceof Error ? error.message : "Unknown error"));

  //     // Remove cloned element if it exists
  //     if (clonedElement && clonedElement.parentNode) {
  //       console.log("[PDF] Cleaning up cloned element from DOM");
  //       document.body.removeChild(clonedElement);
  //     }

  //     // Reset button
  //     const buttonElement = document.querySelector(
  //       "#download-pdf-btn"
  //     ) as HTMLButtonElement | null;
  //     if (buttonElement) {
  //       buttonElement.disabled = false;
  //       buttonElement.innerHTML = originalHTML;
  //     }
  //   }
  // };


  // const downloadPDF = () => {
  //   alert("PDF download functionality is currently unavailable. Please check back later."); 
  // }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "pending":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "rejected":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-blue-50 border-blue-200 text-blue-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileCheck className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

      <div
        ref={passportRef}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-12 space-y-10 md:space-y-12"
      >
        {/* Header Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-[0_18px_55px_-18px_rgba(15,23,42,0.55)]">
          <div className="absolute inset-0 bg-[#0B1F45]" />
          <div className="absolute inset-0 opacity-60 passport-hero-mesh" />
          <div className="absolute inset-0 opacity-[0.05] passport-hero-grid" />
          <div className="absolute top-8 right-32 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60" />
          <div className="absolute bottom-10 right-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-40 animation-delay-800" />

          <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8 lg:gap-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <Shield className="w-4 h-4 text-blue-300/80" />
                <span className="text-blue-300/80 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em]">
                  Verified Career Identity
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                Employment Passport
              </h1>
              <p className="mt-4 text-blue-200/80 text-sm sm:text-base max-w-xl leading-relaxed">
                A trusted timeline of your verified companies, roles, and
                supporting records.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3.5 sm:gap-4 shrink-0 w-full md:w-auto">
              <div className="inline-flex items-center gap-3 px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-white/10 border border-white/15 text-white backdrop-blur-sm w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-blue-200/80 font-semibold">
                    Verified Records
                  </p>
                  <p className="text-xl font-black">{verifiedEmployment.length}</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-3 px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-linear-to-r from-violet-500/90 via-indigo-500/90 to-blue-500/90 border border-white/10 text-white shadow-lg shadow-blue-500/30 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/15">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-blue-100/90 font-semibold">
                    Total Experience
                  </p>
                  <p className="text-base sm:text-lg font-black leading-tight">
                    {calculateTotalExperience()}
                  </p>
                </div>
              </div>
{/* 
                  <button
                    id="download-pdf-btn"
                    onClick={downloadPDF}
                    className="flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 group/download disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-5 h-5 group-hover/download:scale-110 transition-transform" />
                    Download PDF
                  </button> */}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {verifiedEmployment.length === 0 ? (
            <div className="bg-linear-to-br from-white via-blue-50/35 to-white rounded-3xl border border-blue-100/80 shadow-[0_10px_30px_-16px_rgba(37,99,235,0.35),0_0_0_1px_rgba(96,165,250,0.18)] text-center p-14 sm:p-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-500 to-indigo-600 rounded-3xl mb-6 shadow-lg shadow-blue-500/30">
                <FileCheck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                No Verified Employment Yet
              </h3>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Upload and verify your employment documents to build your
                trusted work history on CareerTrust.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {verifiedEmployment.map((emp) => (
                <div
                  key={emp.id}
                  className="group relative transform transition-all duration-500 hover:scale-[1.01]"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500/18 to-indigo-500/18 rounded-3xl blur opacity-0 group-hover:opacity-45 transition-opacity duration-500"></div>
                  <div
                    className={`relative bg-linear-to-br from-white via-blue-50/35 to-white rounded-3xl p-7 sm:p-8 shadow-[0_10px_24px_-14px_rgba(37,99,235,0.4),0_0_0_1px_rgba(59,130,246,0.18)] border ${getStatusColor(emp.verificationStatus)} transition-all duration-300 hover:shadow-[0_16px_34px_-14px_rgba(37,99,235,0.5),0_0_0_1px_rgba(79,70,229,0.2)] overflow-hidden`}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                    {/* Status Badge */}
                    <div className="absolute top-0 right-0 p-6">
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(emp.verificationStatus)} font-semibold text-sm backdrop-blur-sm`}
                      >
                        {getStatusIcon(emp.verificationStatus)}
                        <span>
                          {emp.verificationStatus.charAt(0).toUpperCase() +
                            emp.verificationStatus.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Header with Company and Position */}
                      <div className="flex items-start gap-5 pr-40">
                        <div className="p-3 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
                            {emp.position}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-slate-500 mb-3">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-blue-600" />
                              <span>{emp.company}</span>
                            </div>
                          </div>
                          {emp.description && (
                            <p className="text-slate-500 leading-relaxed mt-2 line-clamp-3">
                              {emp.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Duration and Documents */}
                      <div className="flex flex-col lg:flex-row lg:flex-wrap items-start gap-5 pt-5 border-t border-slate-100">
                        <div className="flex items-center gap-3 flex-1 min-w-max">
                          <div className="p-2.5 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md shadow-blue-500/20">
                            <Calendar className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-500 font-medium">
                              Duration
                            </p>
                            <p className="font-semibold text-slate-800">
                              {emp.startDate} -{" "}
                              <span className="text-blue-600">
                                {emp.currentlyWorking ? "Present" : emp.endDate}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-1 min-w-max">
                          <div className="p-2.5 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md shadow-emerald-500/25">
                            <FileCheck className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-500 font-medium">
                              Documents
                            </p>
                            <p className="font-semibold text-slate-800">
                              {emp.documents.filter((d) => d.url).length}{" "}
                              <span className="text-emerald-600">Uploaded</span>
                            </p>
                          </div>
                        </div>

                        {/* Rejection Reason */}
                        {emp.verificationStatus === "rejected" &&
                          emp.rejectionReason && (
                            <div className="ml-auto p-4 bg-red-50 border border-red-200 rounded-xl flex-1">
                              <p className="text-red-700">
                                <span className="font-semibold">
                                  Rejection Reason:{" "}
                                </span>
                                {emp.rejectionReason}
                              </p>
                            </div>
                          )}
                      </div>

                      {/* Action Button */}
                      {emp.verificationStatus === "verified" && emp.documents.filter((d) => d.url).length > 0 && (
                        <div className="pt-4 border-t border-slate-100">
                          <button
                            onClick={() => toggleDocuments(emp.id)}
                            className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-800 transition-all group/btn w-full justify-between"
                          >
                            <span className="flex items-center gap-2">
                              <FileCheck className="w-4 h-4" />
                              View Documents ({emp.documents.filter((d) => d.url).length})
                            </span>
                            {expandedDocuments.has(emp.id) ? (
                              <ChevronUp className="w-4 h-4 transition-transform" />
                            ) : (
                              <ChevronDown className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
                            )}
                          </button>

                          {/* Documents List */}
                          {expandedDocuments.has(emp.id) && (
                            <div className="mt-4 space-y-2 animate-in slide-in-from-top-2 duration-300">
                              {emp.documents.filter((d) => d.url).map((doc) => (
                                <a
                                  key={doc.id}
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-indigo-300 hover:shadow-md transition-all group/doc"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="p-2 bg-linear-to-br from-blue-500 to-indigo-500 rounded-lg shadow-sm">
                                      <FileText className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-slate-800 truncate">
                                        {doc.name}
                                      </p>
                                      <p className="text-xs text-slate-500 font-medium">
                                        {doc.type === "application/pdf" ? "PDF Document" :
                                         doc.type.startsWith("image/") ? "Image" : "Document"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <ExternalLink className="w-4 h-4 text-indigo-600 group-hover/doc:scale-110 transition-transform" />
                                  </div>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        .passport-hero-mesh {
          background:
            radial-gradient(ellipse at 20% 50%, #1e40af44 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, #7c3aed33 0%, transparent 55%),
            radial-gradient(ellipse at 60% 80%, #0ea5e922 0%, transparent 50%);
        }
        .passport-hero-grid {
          background-image:
            linear-gradient(#fff 1px, transparent 1px),
            linear-gradient(90deg, #fff 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}