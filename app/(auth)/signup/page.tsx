import SignupForm from "@/components/forms/SignupForm";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function Signup() {
	return (
		<div className="min-h-screen bg-[#F4F4F4] flex flex-col">
			{/* <Header /> */}
			<main className="flex-1 flex items-stretch">
				<div className="w-full flex items-center justify-center px-4 ">
				<SignupForm />
				</div>
			</main>
			{/* <Footer /> */}
		</div>
	);
}
