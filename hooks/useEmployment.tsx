"use client";

import { useState, useRef } from "react";
import { EmploymentRecord, DocumentFile, VerificationStatus } from "@/types/jobseeker.types";

export function useEmployment(initialEmployment: EmploymentRecord[] = []) {
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentRecord[]>(initialEmployment);
  const [showAddEmployment, setShowAddEmployment] = useState(false);
  const [newEmployment, setNewEmployment] = useState<Partial<EmploymentRecord>>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
    verified: false,
    verificationStatus: "draft",
    documents: [],
  });

  const documentInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const addEmploymentRecord = () => {
    if (newEmployment.company && newEmployment.position && newEmployment.startDate) {
      const record: EmploymentRecord = {
        id: Date.now().toString(),
        company: newEmployment.company,
        position: newEmployment.position,
        startDate: newEmployment.startDate,
        endDate: newEmployment.endDate || "",
        currentlyWorking: newEmployment.currentlyWorking || false,
        description: newEmployment.description || "",
        verified: false,
        verificationStatus: "draft",
        documents: [],
      };
      setEmploymentHistory((prev) => [record, ...prev]);
      setNewEmployment({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        description: "",
        verified: false,
        verificationStatus: "draft",
        documents: [],
      });
      setShowAddEmployment(false);
    }
  };

  const deleteEmployment = (id: string) => {
    setEmploymentHistory((prev) => prev.filter((emp) => emp.id !== id));
  };

  const handleDocumentUpload = (empId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs: DocumentFile[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      file: file, // Store the actual File object
    }));

    setEmploymentHistory((prev) =>
      prev.map((emp) => {
        if (emp.id === empId) {
          const updatedDocs = [...emp.documents, ...newDocs];
          const newStatus =
            emp.verificationStatus === "draft" && updatedDocs.length > 0
              ? "pending"
              : emp.verificationStatus;
          return {
            ...emp,
            documents: updatedDocs,
            verificationStatus: newStatus as VerificationStatus,
          };
        }
        return emp;
      })
    );

    if (documentInputRefs.current[empId]) {
      documentInputRefs.current[empId]!.value = "";
    }
  };

  const removeDocument = (empId: string, docId: string) => {
    setEmploymentHistory((prev) =>
      prev.map((emp) => {
        if (emp.id === empId) {
          const updatedDocs = emp.documents.filter((doc) => doc.id !== docId);
          const newStatus =
            updatedDocs.length === 0 && emp.verificationStatus === "pending"
              ? "draft"
              : emp.verificationStatus;
          return {
            ...emp,
            documents: updatedDocs,
            verificationStatus: newStatus as VerificationStatus,
          };
        }
        return emp;
      })
    );
  };

   function handleNewEmploymentChange<K extends keyof EmploymentRecord>(
    field: K,
    value: EmploymentRecord[K]
  ) {
    setNewEmployment((prev) => ({ ...prev, [field]: value }));
  }

  const getVerifiedEmployment = () => {
    return employmentHistory.filter((emp) => emp.verificationStatus === "verified");
  };

  return {
    employmentHistory,
    setEmploymentHistory,
    showAddEmployment,
    setShowAddEmployment,
    newEmployment,
    setNewEmployment,
    documentInputRefs,
    addEmploymentRecord,
    deleteEmployment,
    handleDocumentUpload,
    handleNewEmploymentChange,
    removeDocument,
    getVerifiedEmployment,
  };
}