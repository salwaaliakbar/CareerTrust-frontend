"use client";

import React from "react";
import { EmploymentRecord } from "@/types/jobseeker.types";
import DigitalEmploymentPassport from "@/components/jobseekerDashboard/DigitalEmploymentPassport";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCallback, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { RefreshCw } from "lucide-react";
import { API_ENDPOINTS } from "@/constants/api";

const toMonthIndex = (value?: string | null) => {
  const raw = (value || "").trim();
  if (!raw) return 0;

  const mmYyyy = raw.match(/^(0[1-9]|1[0-2])\/(\d{4})$/);
  if (mmYyyy) {
    return Number(mmYyyy[2]) * 12 + Number(mmYyyy[1]);
  }

  const yyyyMm = raw.match(/^(\d{4})-(0[1-9]|1[0-2])$/);
  if (yyyyMm) {
    return Number(yyyyMm[1]) * 12 + Number(yyyyMm[2]);
  }

  if (/^\d{4}$/.test(raw)) {
    return Number(raw) * 12 + 1;
  }

  return 0;
};

const PassportPage = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [verifiedEmployment, setVerifiedEmployment] = useState<EmploymentRecord[]>([]);
  const [allEmployment, setAllEmployment] = useState<EmploymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobseekerProfile = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);

    if (!user?.id) {
      console.log("❌ Passport - No user ID available yet");
      setLoading(false);
      return;
    }

    try {
      const token = await getToken();
      const url = `${API_ENDPOINTS.JOBSEEKER_PROFILE_GET}?clerkId=${encodeURIComponent(user.id)}`;
      console.log("🔍 Passport - Fetching from URL:", url);
      console.log("🔑 Passport - Current user clerkId:", user.id);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store', // Prevent caching
      });

      console.log("📡 Passport - Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Passport - Full API response:", data);
        const employment: EmploymentRecord[] = Array.isArray(
          data?.data?.employmentHistory,
        )
          ? (data.data.employmentHistory as EmploymentRecord[])
          : [];
        console.log("📊 Passport - Employment history count:", employment.length);
        console.log("📋 Passport - Employment history:", employment);

        // Log each employment with verification details
        employment.forEach((emp: EmploymentRecord, idx: number) => {
          console.log(`Employment ${idx + 1}:`, {
            company: emp.company,
            position: emp.position,
            verified: emp.verified,
            verificationStatus: emp.verificationStatus,
            shouldShow: emp.verificationStatus === "verified"
          });
        });

        // Only show verified employment - check verificationStatus only
        const verified = employment
          .filter((emp: EmploymentRecord) => emp.verificationStatus === "verified")
          .sort((a: EmploymentRecord, b: EmploymentRecord) => {
            if (a.currentlyWorking && !b.currentlyWorking) return -1;
            if (!a.currentlyWorking && b.currentlyWorking) return 1;
            return toMonthIndex(b.startDate || "") - toMonthIndex(a.startDate || "");
          });
        console.log("✅ Passport - Verified employment count:", verified.length);
        console.log("✅ Passport - Verified employment:", verified);
        setVerifiedEmployment(verified);
        setAllEmployment(employment);
      } else {
        console.error("❌ Passport - Failed to fetch profile. Status:", response.status);
      }
    } catch (error) {
      console.error("❌ Passport - Error fetching profile:", error);
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  }, [getToken, user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchJobseekerProfile();
    }

    // Refresh when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && user?.id) {
        fetchJobseekerProfile();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user?.id, fetchJobseekerProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C2B4E]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <main className="flex-grow">
        {/* Refresh Button */}
        <div className="container mx-auto px-4 pt-6">
          <button
            onClick={() => fetchJobseekerProfile(true)}
            disabled={refreshing}
            className="mb-4 flex items-center gap-2 px-4 py-2 bg-[#0C2B4E] text-white rounded-lg hover:bg-[#1A3D64] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Verified Employment'}
          </button>
        </div>
        
        <DigitalEmploymentPassport
          verifiedEmployment={verifiedEmployment}
          allEmployment={allEmployment}
        />
      </main>
      <Footer />
    </div>
  );
};

export default PassportPage;
