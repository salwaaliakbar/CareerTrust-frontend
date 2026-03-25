"use client";

import React from "react";
import { JobApplication, ApplicationStatus } from "@/types/application.types";
import ApplicantCard from "./ApplicantCard";

interface ApplicantsListProps {
  applications: JobApplication[];
  onStatusUpdate: (applicationId: string, newStatus: ApplicationStatus) => void;
  getToken?: () => Promise<string | null>;
}

export default function ApplicantsList({
  applications,
  onStatusUpdate,
  getToken,
}: ApplicantsListProps) {
  return (
    <div className="space-y-4">
      {applications.map((application, index) => (
        <ApplicantCard
          key={application.id}
          application={application}
          onStatusUpdate={onStatusUpdate}
          getToken={getToken}
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </div>
  );
}
