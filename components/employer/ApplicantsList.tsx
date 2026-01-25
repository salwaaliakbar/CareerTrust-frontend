"use client";

import React from "react";
import { JobApplication, ApplicationStatus } from "@/types/application.types";
import ApplicantCard from "./ApplicantCard";

interface ApplicantsListProps {
  applications: JobApplication[];
  onStatusUpdate: (applicationId: string, newStatus: ApplicationStatus) => void;
}

export default function ApplicantsList({
  applications,
  onStatusUpdate,
}: ApplicantsListProps) {
  return (
    <div className="space-y-4">
      {applications.map((application, index) => (
        <ApplicantCard
          key={application.id}
          application={application}
          onStatusUpdate={onStatusUpdate}
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </div>
  );
}
