"use client";

import React from "react";
import Link from "next/link";
import { EmployerJob } from "@/types/application.types";
import EmployerJobCard from "./EmployerJobCard";

interface EmployerJobsListProps {
  jobs: EmployerJob[];
  onJobDeleted: (jobId: string | number) => void;
  onJobUpdated: (job: EmployerJob) => void;
  getToken?: () => Promise<string | null>;
}

export default function EmployerJobsList({
  jobs,
  onJobDeleted,
  onJobUpdated,
  getToken,
}: EmployerJobsListProps) {
  return (
    <div className="space-y-4 animate-smooth-enter">
      {jobs.map((job, index) => (
        <EmployerJobCard
          key={job.id}
          job={job}
          onJobDeleted={onJobDeleted}
          onJobUpdated={onJobUpdated}
          getToken={getToken}
        />
      ))}
    </div>
  );
}
