import Link from "next/link"
import Image from 'next/image'
import { LOGIN, SIGNUP } from "../../app/page"
import DropdownMenu from '../ui/dropdown-menu'

function Header() {
  return (
    <header className="bg-[#F4F4F4] border-b border-gray-300 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {/* Use public asset path with next/image for optimization. */}
          <Image
            src="/assets/images/Logo.png"
            alt="CareerTrust Logo"
            width={90}
            height={90}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/jobs" className="text-gray-600 hover:text-primary font-medium transition-colors">
            Find Jobs
          </Link>
          <Link href="/companies" className="text-gray-600 hover:text-primary font-medium transition-colors">
            Companies
          </Link>
          <Link href="#features" className="text-gray-600 hover:text-primary font-medium transition-colors">
            Features
          </Link>
          <Link href="#about" className="text-gray-600 hover:text-primary font-medium transition-colors">
            About
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={LOGIN}
            className="px-3 py-1.5 border border-[#0C2B4E] text-[#1D546C] rounded-md text-sm hover:bg-blue-50 transition"
          >
            Login
          </Link>
          <Link
            href={SIGNUP}
            className="px-3 py-1.5 bg-[#0C2B4E] text-white rounded-md text-sm hover:bg-[#1D546C] transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile dropdown (client) */}
        <DropdownMenu login={LOGIN} signup={SIGNUP} />
      </nav>
    </header>
  )
}

export default Header
