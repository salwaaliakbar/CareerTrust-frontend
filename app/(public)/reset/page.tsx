import Image from "next/image";
import ResetPasswordForm from "@/components/forget-password/ResetPasswordForm";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ResetPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col">
      <Header />
      <main className="flex-1 flex items-stretch mt-2 mb-20">
        <div className="hidden md:flex md:w-1/2 items-start justify-center bg-white p-6 pt-2">
          <Image
            src="/assets/images/authImage - Copy.png"
            alt="Reset password illustration"
            width={900}
            height={900}
            className="w-full h-auto max-h-180 object-contain"
            priority
          />
        </div>

        <div className="w-full md:w-1/2 flex items-start justify-center px-4 pt-0 pb-12">
          <ResetPasswordForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
