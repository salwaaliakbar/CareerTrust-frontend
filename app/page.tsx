export const LOGIN = "/login";
export const SIGNUP = "/signup";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HomePage from "./(public)/homePage/page";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <HomePage />
      </main>
      <Footer />
    </>
  );
}
