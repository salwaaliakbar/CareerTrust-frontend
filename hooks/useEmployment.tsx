"use client";

import { useState, useRef } from "react";
import { EmploymentRecord, DocumentFile } from "@/types/jobseeker.types";

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
    verificationStatus: "pending",
    documents: [],
  });

  const documentInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const isValidMonthYear = (value: string) => /^(0[1-9]|1[0-2])\/\d{4}$/.test(value);

  const monthYearToIndex = (value: string) => {
    const match = value.match(/^(0[1-9]|1[0-2])\/(\d{4})$/);
    if (!match) return null;

    const month = Number(match[1]);
    const year = Number(match[2]);
    return year * 12 + month;
  };

  const addEmploymentRecord = () => {
    if (
      newEmployment.company &&
      newEmployment.position &&
      newEmployment.startDate &&
      isValidMonthYear(newEmployment.startDate)
    ) {
      const currentlyWorking = newEmployment.currentlyWorking || false;
      const validEndDate =
        currentlyWorking ||
        !newEmployment.endDate ||
        isValidMonthYear(newEmployment.endDate);

      if (!validEndDate) {
        return;
      }

      const startIndex = monthYearToIndex(newEmployment.startDate);
      const endIndex = newEmployment.endDate
        ? monthYearToIndex(newEmployment.endDate)
        : null;

      if (
        !currentlyWorking &&
        startIndex &&
        endIndex &&
        endIndex < startIndex
      ) {
        return;
      }

      const record: EmploymentRecord = {
        id: Date.now().toString(),
        company: newEmployment.company,
        position: newEmployment.position,
        startDate: newEmployment.startDate,
        endDate: newEmployment.endDate || "",
        currentlyWorking: newEmployment.currentlyWorking || false,
        description: newEmployment.description || "",
        verified: false,
        verificationStatus: "pending",
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
        verificationStatus: "pending",
        documents: [],
      });
      setShowAddEmployment(false);
    }
  };

  const deleteEmployment = (id: string) => {
    setEmploymentHistory((prev) => prev.filter((emp) => emp.id !== id));
  };

  const updateEmployment = (updatedEmployment: EmploymentRecord) => {
    setEmploymentHistory((prev) =>
      prev.map((emp) => (emp.id === updatedEmployment.id ? updatedEmployment : emp)),
    );
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
          return {
            ...emp,
            documents: updatedDocs,
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
          return {
            ...emp,
            documents: updatedDocs,
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
    updateEmployment,
    deleteEmployment,
    handleDocumentUpload,
    handleNewEmploymentChange,
    removeDocument,
    getVerifiedEmployment,
  };
}