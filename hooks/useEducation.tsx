"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { EducationRecord } from "@/types/jobseeker.types";
import { DocumentFile } from "@/types/jobseeker.types";
import { useRef } from "react";

export function useEducation(initialEducation: EducationRecord[] = []) {
  const [educationHistory, setEducationHistory] = useState<EducationRecord[]>(
    initialEducation
  );

  const [showAddEducation, setShowAddEducation] = useState(false);
  const documentInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const newEducationDocumentInputRef = useRef<HTMLInputElement | null>(null);
  const [newEducation, setNewEducation] = useState<Partial<EducationRecord>>({
    institution: "",
    degree: "",
    startDate: "",
    endDate: "",
    documents: [],
    verificationStatus: "pending",
    verified: false,
  });

  const toEducationIndex = (value: string) => {
    const trimmed = (value || "").trim();
    if (!trimmed) return null;

    if (/^\d{4}$/.test(trimmed)) {
      return Number(trimmed) * 12 + 1;
    }

    const monthYear = trimmed.match(/^(0[1-9]|1[0-2])\/(\d{4})$/);
    if (monthYear) {
      return Number(monthYear[2]) * 12 + Number(monthYear[1]);
    }

    return null;
  };

  const currentMonthIndex = () => {
    const now = new Date();
    return now.getFullYear() * 12 + (now.getMonth() + 1);
  };

  function handleNewEducationChange(
    field: keyof EducationRecord,
    value: EducationRecord[keyof EducationRecord]
  ) {
    setNewEducation((prev) => ({ ...prev, [field]: value }));
  }

  function addEducationRecord() {
    if (!newEducation.institution || !newEducation.degree || !newEducation.startDate) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in institution, degree, and start date.",
      });
      return;
    }

    const startIndex = toEducationIndex(newEducation.startDate || "");
    const endIndex = toEducationIndex(newEducation.endDate || "");

    if (!startIndex) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Start Date",
        text: "Use YYYY or MM/YYYY format for start date.",
      });
      return;
    }

    if (startIndex > currentMonthIndex()) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Start Date",
        text: "Education start date cannot be in the future.",
      });
      return;
    }

    if (newEducation.endDate && !endIndex) {
      Swal.fire({
        icon: "warning",
        title: "Invalid End Date",
        text: "Use YYYY or MM/YYYY format for end date.",
      });
      return;
    }

    if (startIndex && endIndex && endIndex < startIndex) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Date Range",
        text: "Education end date cannot be before start date.",
      });
      return;
    }

    const cryptoWithUuid = crypto as unknown as { randomUUID?: () => string };
    const id =
      typeof crypto !== "undefined" &&
      typeof cryptoWithUuid.randomUUID === "function"
        ? cryptoWithUuid.randomUUID()
        : `${Date.now()}`;

    const eduRecord: EducationRecord = {
      id,
      institution: newEducation.institution || "",
      degree: newEducation.degree || "",
      startDate: newEducation.startDate || "",
      endDate: newEducation.endDate || "",
      documents: (newEducation.documents || []) as DocumentFile[],
      verificationStatus: "pending",
      verified: false,
      rejectionReason: undefined,
    };

    setEducationHistory((prev) => [...prev, eduRecord]);
    setNewEducation({
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
      documents: [],
      verificationStatus: "pending",
      verified: false,
    });
    setShowAddEducation(false);
  }

  function handleNewEducationDocumentUpload(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs: DocumentFile[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      file,
    }));

    setNewEducation((prev) => ({
      ...prev,
      documents: [...((prev.documents || []) as DocumentFile[]), ...newDocs],
    }));

    if (newEducationDocumentInputRef.current) {
      newEducationDocumentInputRef.current.value = "";
    }
  }

  function removeNewEducationDocument(docId: string) {
    setNewEducation((prev) => ({
      ...prev,
      documents: ((prev.documents || []) as DocumentFile[]).filter(
        (doc) => doc.id !== docId,
      ),
    }));
  }

  function handleDocumentUpload(
    educationId: string | number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs: DocumentFile[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      file,
    }));

    setEducationHistory((prev) =>
      prev.map((edu) =>
        String(edu.id) === String(educationId)
          ? {
              ...edu,
              documents: [...(edu.documents || []), ...newDocs],
            }
          : edu,
      ),
    );

    const refKey = String(educationId);
    if (documentInputRefs.current[refKey]) {
      documentInputRefs.current[refKey]!.value = "";
    }
  }

  function removeDocument(educationId: string | number, docId: string) {
    setEducationHistory((prev) =>
      prev.map((edu) =>
        String(edu.id) === String(educationId)
          ? {
              ...edu,
              documents: (edu.documents || []).filter((doc) => doc.id !== docId),
            }
          : edu,
      ),
    );
  }

  function updateEducation(updatedEducation: EducationRecord) {
    setEducationHistory((prev) =>
      prev.map((education) =>
        String(education.id) === String(updatedEducation.id)
          ? updatedEducation
          : education,
      ),
    );
  }

  async function deleteEducation(id: string | number) {
    const target = educationHistory.find(
      (e) => String(e.id) === String(id),
    );

    if (!target) return;

    if (target.verificationStatus === "verified") {
      await Swal.fire({
        icon: "info",
        title: "Cannot Delete Verified Education",
        text: "Approved education records cannot be deleted.",
      });
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Education Record?",
      text: "This will remove the education record and its attached documents after you save profile changes.",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setEducationHistory((prev) =>
      prev.filter((e) => String(e.id) !== String(id)),
    );
  }

  return {
    educationHistory,
    setEducationHistory,
    showAddEducation,
    setShowAddEducation,
    newEducation,
    setNewEducation,
    documentInputRefs,
    newEducationDocumentInputRef,
    handleNewEducationChange,
    addEducationRecord,
    updateEducation,
    deleteEducation,
    handleNewEducationDocumentUpload,
    removeNewEducationDocument,
    handleDocumentUpload,
    removeDocument,
  };
}
