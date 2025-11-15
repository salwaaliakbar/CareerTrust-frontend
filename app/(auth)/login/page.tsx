import Image from "next/image";
import LoginForm from "@/components/forms/LoginForm";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function Login() {
  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col">
      {/* <Header /> */}

      {/* Main split area: image (half) + form (half). On small screens the image is hidden and form fills */}
      <main className="flex-1 flex items-stretch mt-5 mb-20">
        {/* Image column - visible from md and up */}
        <div className="hidden md:block md:w-1/2 relative">
          <Image
            src="/assets/images/authImage - Copy.png"
            alt="Authentication background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Form column */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-12">
          <LoginForm />
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
