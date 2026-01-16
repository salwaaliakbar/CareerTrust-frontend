"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { EducationRecord } from "@/types/jobseeker.types";

export function useEducation(initialEducation: EducationRecord[] = []) {
  const [educationHistory, setEducationHistory] = useState<EducationRecord[]>(
    initialEducation
  );

  const [showAddEducation, setShowAddEducation] = useState(false);
  const [newEducation, setNewEducation] = useState<Partial<EducationRecord>>({
    institution: "",
    degree: "",
    startDate: "",
    endDate: "",
  });

  function handleNewEducationChange(
    field: keyof EducationRecord,
    value: EducationRecord[keyof EducationRecord]
  ) {
    setNewEducation((prev) => ({ ...prev, [field]: value }));
  }

  function addEducationRecord() {
    if (!newEducation.institution || !newEducation.degree) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in at least the institution and degree.",
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
    };

    setEducationHistory((prev) => [...prev, eduRecord]);
    setNewEducation({
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
    });
    setShowAddEducation(false);
  }

  function deleteEducation(id: string) {
    setEducationHistory((prev) => prev.filter((e) => e.id !== id));
  }

  return {
    educationHistory,
    setEducationHistory,
    showAddEducation,
    setShowAddEducation,
    newEducation,
    setNewEducation,
    handleNewEducationChange,
    addEducationRecord,
    deleteEducation,
  };
}
