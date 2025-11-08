import Link from "next/link";
import Image from "next/image";
import { Mail, Linkedin, Twitter } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/assets/images/whiteLogo.png"
                alt="CareerTrust Logo"
                width={90}
                height={90}
              />
            </div>
            <p className="text-gray-400 text-sm">
              Smart Employment & Review Platform for Pakistan job market
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-white transition-colors"
                >
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/companies"
                  className="hover:text-white transition-colors"
                >
                  Browse Companies
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link
                  href="#about"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#blog"
                  className="hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#careers"
                  className="hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link
                  href="#privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 CareerTrust. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#linkedin"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#twitter"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@careertrust.pk"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
