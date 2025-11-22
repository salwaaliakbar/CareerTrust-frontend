"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Linkedin, Twitter } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsLoading(false);
    
    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "support@careertrust.com",
      description: "We'll respond within 24 hours",
      link: "mailto:support@careertrust.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+92 (300) 123-4567",
      description: "Monday to Friday, 9AM-6PM PKT",
      link: "tel:+923001234567",
    },
    {
      icon: MapPin,
      label: "Office",
      value: "Karachi, Pakistan",
      description: "CareerTrust Headquarters",
      link: null,
    },
    {
      icon: Clock,
      label: "Response Time",
      value: "Within 24 hours",
      description: "Average response time",
      link: null,
    },
  ];

  const faqs = [
    {
      question: "How long does it take to verify my employment?",
      answer: "Employment verification typically takes 2-5 business days. Both the employer and employee need to confirm the employment record.",
    },
    {
      question: "Can I delete my account?",
      answer: "Yes, you can request account deletion from your settings. Your verified employment records will remain for transparency, but personal data will be removed.",
    },
    {
      question: "Is CareerTrust available outside Pakistan?",
      answer: "Currently, CareerTrust operates in Pakistan. We're planning to expand internationally in the coming months.",
    },
    {
      question: "How do I report inappropriate reviews?",
      answer: "You can report reviews through the review page. Our moderation team reviews all reports within 48 hours.",
    },
    {
      question: "What is your data privacy policy?",
      answer: "We follow strict data protection standards. Your data is encrypted and never shared with third parties without consent.",
    },
    {
      question: "How can I become a verified employer?",
      answer: "Complete the employer verification process in your company settings. We'll verify your company through official registrations.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-linear-to-br from-[#0C2B4E] via-[#1D546C] to-[#0C2B4E] text-white py-20 px-4 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-blob animation-delay-0"></div>
            <div className="absolute bottom-0 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 fade-in-down">Get in Touch</h1>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto fade-in animation-delay-100">
                Have questions about CareerTrust? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <div
                  key={idx}
                  className="card-base p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl hover:shadow-sky-200/50 transition-all duration-300 fade-in hover:-translate-y-1"
                  style={{ animationDelay: `${200 + idx * 100}ms` }}
                >
                  <Link href={info.link || "#"} className={info.link ? "block group" : "block"}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-sky-200 group-hover:scale-110">
                        <Icon className="w-6 h-6 text-sky-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover:text-sky-700">
                          {info.label}
                        </h3>
                        <p className="text-gray-900 font-medium text-sm transition-colors duration-300 group-hover:text-sky-700">
                          {info.value}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">{info.description}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2 fade-in animation-delay-200">
              <div className="card-base p-8 rounded-2xl border border-gray-200 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 fade-in">Send us a Message</h2>

                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg fade-in">
                    <p className="text-green-800 font-medium flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-green-600 text-white rounded-full text-xs">✓</span>
                      Thank you! We've received your message and will get back to you soon.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 fade-in animation-delay-300">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                      placeholder="What is this about?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-linear-to-r from-sky-600 to-sky-700 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    We respect your privacy. Your information will not be shared with third parties.
                  </p>
                </form>
              </div>
            </div>

            {/* Sidebar - Quick Links & Social */}
            <div className="space-y-6 fade-in animation-delay-400">
              {/* Quick Links */}
              <div className="card-base p-6 rounded-2xl border border-gray-200 shadow-lg">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-sky-700" />
                  Quick Links
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/help"
                    className="flex items-center gap-2 text-sky-700 hover:text-sky-900 font-medium text-sm transition-all duration-300 hover:translate-x-1 group"
                  >
                    <span>→</span>
                    <span>Help Center</span>
                  </Link>
                  <Link
                    href="/features"
                    className="flex items-center gap-2 text-sky-700 hover:text-sky-900 font-medium text-sm transition-all duration-300 hover:translate-x-1 group"
                  >
                    <span>→</span>
                    <span>Features</span>
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center gap-2 text-sky-700 hover:text-sky-900 font-medium text-sm transition-all duration-300 hover:translate-x-1 group"
                  >
                    <span>→</span>
                    <span>About Us</span>
                  </Link>
                  <Link
                    href="/blogs"
                    className="flex items-center gap-2 text-sky-700 hover:text-sky-900 font-medium text-sm transition-all duration-300 hover:translate-x-1 group"
                  >
                    <span>→</span>
                    <span>Blog</span>
                  </Link>
                </div>
              </div>

              {/* Social Media */}
              <div className="card-base p-6 rounded-2xl border border-gray-200 shadow-lg fade-in animation-delay-500">
                <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="space-y-3">
                  <a
                    href="https://linkedin.com"
                    className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 hover:scale-105 group"
                  >
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">LinkedIn</span>
                  </a>
                  <a
                    href="https://twitter.com"
                    className="flex items-center gap-2 p-3 bg-sky-50 hover:bg-sky-100 rounded-lg transition-all duration-300 hover:scale-105 group"
                  >
                    <Twitter className="w-5 h-5 text-sky-600" />
                    <span className="text-sm font-medium text-sky-900">Twitter</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 fade-in animation-delay-100">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 text-lg fade-in animation-delay-200">
                Find answers to common questions about CareerTrust
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="card-base p-6 rounded-2xl border border-gray-200 hover:border-sky-200 shadow-md hover:shadow-lg transition-all duration-300 fade-in hover:-translate-y-1"
                  style={{ animationDelay: `${300 + idx * 100}ms` }}
                >
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg transition-colors duration-300 hover:text-sky-700">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center fade-in animation-delay-700">
              <p className="text-gray-600 mb-4">Didn't find your answer?</p>
              <Link
                href="/contact"
                className="inline-block px-8 py-3 bg-sky-700 text-white font-semibold rounded-lg hover:bg-sky-800 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-linear-to-br from-[#0C2B4E] to-[#1D546C] text-white py-16 px-4 fade-in">
          <div className="max-w-4xl mx-auto text-center fade-in animation-delay-100">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join CareerTrust?</h2>
            <p className="text-blue-100 text-lg mb-8">
              Start building your verified professional profile today and discover verified opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in animation-delay-200">
              <Link
                href="/signup?role=jobseeker"
                className="inline-block px-8 py-3 bg-white text-sky-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Sign Up as Job Seeker
              </Link>
              <Link
                href="/signup?role=employer"
                className="inline-block px-8 py-3 bg-sky-600 text-white font-semibold rounded-lg border border-white/30 hover:bg-sky-700 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Post a Job
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
