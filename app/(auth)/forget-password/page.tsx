import React from "react";
import ResetPasswordForm from "@/components/forget-password/ResetPasswordForm"; // Adjust path based on where you save the form component

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <ResetPasswordForm />
    </div>
  );
}
