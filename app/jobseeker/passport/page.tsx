"use client";

import React from "react";
import { EmploymentRecord } from "@/types/jobseeker.types";
import DigitalEmploymentPassport from "@/components/jobseekerDashboard/DigitalEmploymentPassport";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Mock employment data
const mockVerifiedEmployment: EmploymentRecord[] = [
  {
    id: "1",
    company: "TechCore Solutions",
    position: "Senior Frontend Developer",
    startDate: "Jan 2022",
    endDate: "Dec 2023",
    currentlyWorking: false,
    description:
      "Led development of customer-facing React applications, mentored junior developers, and implemented responsive designs using modern frontend technologies. Improved application performance by 40% through optimization techniques.",
    verified: true,
    verificationStatus: "verified",
    documents: [
      { id: "doc1", name: "Employment Letter", verified: true },
      { id: "doc2", name: "Performance Review", verified: true },
      { id: "doc3", name: "Project Certificate", verified: true },
    ],
    rejectionReason: null,
  },
  {
    id: "2",
    company: "Digital Innovations Inc.",
    position: "Full Stack Developer",
    startDate: "Jun 2021",
    endDate: "Dec 2021",
    currentlyWorking: false,
    description:
      "Developed and maintained full-stack web applications using Node.js and React. Collaborated with cross-functional teams to deliver features on schedule. Implemented automated testing and CI/CD pipelines.",
    verified: true,
    verificationStatus: "verified",
    documents: [
      { id: "doc4", name: "Offer Letter", verified: true },
      { id: "doc5", name: "Work Certificate", verified: true },
    ],
    rejectionReason: null,
  },
  {
    id: "3",
    company: "StartupHub Technologies",
    position: "Junior Developer",
    startDate: "Mar 2020",
    endDate: "May 2021",
    currentlyWorking: false,
    description:
      "Started as a junior developer working on bug fixes and feature implementations. Graduated to taking ownership of small to medium features. Gained experience in Vue.js, JavaScript, and web standards.",
    verified: true,
    verificationStatus: "verified",
    documents: [
      { id: "doc6", name: "Joining Letter", verified: true },
      { id: "doc7", name: "Exit Certificate", verified: true },
    ],
    rejectionReason: null,
  },
  {
    id: "4",
    company: "Enterprise Systems Co.",
    position: "Software Engineer",
    startDate: "Aug 2023",
    endDate: null,
    currentlyWorking: true,
    description:
      "Currently working as a Software Engineer focused on building scalable backend services and microservices architecture. Contributing to product strategy and architectural decisions.",
    verified: true,
    verificationStatus: "verified",
    documents: [
      { id: "doc8", name: "Current Employment Letter", verified: true },
      { id: "doc9", name: "Project Documentation", verified: true },
    ],
    rejectionReason: null,
  },
];

const PassportPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <main className="flex-grow">
        <DigitalEmploymentPassport
          verifiedEmployment={mockVerifiedEmployment}
        />
      </main>
      <Footer />
    </div>
  );
};

export default PassportPage;
