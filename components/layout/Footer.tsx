import Link from "next/link";
import Image from "next/image";
import { Mail, Linkedin, Twitter } from "lucide-react";
import Test from "@/app/Test";

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Find Jobs", href: "/jobs" },
      { label: "Browse Companies", href: "/companies" },
      { label: "Features", href: "/features" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Blogs", href: "/blogs" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 animate-fade-in">
          {/* Brand Column */}
          <div className="flex flex-col animate-fade-in-up">
            <div className="flex items-center gap-2 mb-6 hover:scale-105 transition-transform duration-300">
              <Image
                src="/assets/images/whiteLogo.png"
                alt="CareerTrust Logo"
                width={90}
                height={90}
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Smart Employment & Review Platform for Pakistan job market
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 hover:scale-110 hover:-translate-y-1"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-300 transition-colors duration-300 hover:scale-110 hover:-translate-y-1"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@careertrust.pk"
                className="text-gray-400 hover:text-red-400 transition-colors duration-300 hover:scale-110 hover:-translate-y-1"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            <h3 className="font-semibold text-white mb-6 text-lg">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li
                  key={link.href}
                  style={{ animationDelay: `${100 + index * 50}ms` }}
                  className="animate-fade-in"
                >
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            <h3 className="font-semibold text-white mb-6 text-lg">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li
                  key={link.href}
                  style={{ animationDelay: `${200 + index * 50}ms` }}
                  className="animate-fade-in"
                >
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "300ms" }}
          >
            <h3 className="font-semibold text-white mb-6 text-lg">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li
                  key={link.href}
                  style={{ animationDelay: `${300 + index * 50}ms` }}
                  className="animate-fade-in"
                >
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800"></div>

        {/* Bottom Section */}
        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 animate-fade-in-up"
          style={{ animationDelay: "400ms" }}
        >
          <p className="text-gray-500 text-sm">
            © {currentYear} CareerTrust. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href="/sitemap"
              className="text-gray-400 hover:text-white transition-all duration-300"
            >
              Sitemap
            </Link>
            <span className="text-gray-700">•</span>
            <Link
              href="/accessibility"
              className="text-gray-400 hover:text-white transition-all duration-300"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
      <Test />
    </footer>
  );
}

export default Footer;
