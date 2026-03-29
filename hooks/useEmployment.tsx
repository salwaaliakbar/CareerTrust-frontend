"use client";

import { useState, useRef } from "react";
import { EmploymentRecord, DocumentFile } from "@/types/jobseeker.types";
import Swal from "sweetalert2";

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

  const currentMonthIndex = () => {
    const now = new Date();
    return now.getFullYear() * 12 + (now.getMonth() + 1);
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

      if (startIndex && startIndex > currentMonthIndex()) {
        return;
      }

      if (
        !currentlyWorking &&
        startIndex &&
        endIndex &&
        endIndex < startIndex
      ) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Date Range",
          text: "Employment end date cannot be before start date.",
        });
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

  const deleteEmployment = async (id: string) => {
    const target = employmentHistory.find((emp) => String(emp.id) === String(id));

    if (!target) return;

    if (target.verificationStatus === "verified") {
      await Swal.fire({
        icon: "info",
        title: "Cannot Delete Verified Experience",
        text: "Approved employment records cannot be deleted.",
      });
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Work Experience?",
      text: "This will remove the experience and its attached documents after you save profile changes.",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setEmploymentHistory((prev) => prev.filter((emp) => String(emp.id) !== String(id)));
  };

  const updateEmployment = (updatedEmployment: EmploymentRecord) => {
    setEmploymentHistory((prev) =>
      prev.map((emp) =>
        String(emp.id) === String(updatedEmployment.id) ? updatedEmployment : emp,
      ),
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
        if (String(emp.id) === String(empId)) {
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
        if (String(emp.id) === String(empId)) {
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