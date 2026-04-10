"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollRevealSection from "@/components/ui/ScrollRevealSection";
import {
  ArrowRight,
  Clock,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Twitter,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      delayClass: "animation-delay-100",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+92 (300) 123-4567",
      description: "Monday to Friday, 9AM-6PM PKT",
      link: "tel:+923001234567",
      delayClass: "animation-delay-200",
    },
    {
      icon: MapPin,
      label: "Office",
      value: "Karachi, Pakistan",
      description: "CareerTrust Headquarters",
      link: null,
      delayClass: "animation-delay-300",
    },
    {
      icon: Clock,
      label: "Response Time",
      value: "Within 24 hours",
      description: "Average response time",
      link: null,
      delayClass: "animation-delay-400",
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

  const faqDelayClasses = [
    "animation-delay-100",
    "animation-delay-200",
    "animation-delay-300",
    "animation-delay-400",
    "animation-delay-500",
    "animation-delay-600",
  ];

  return (
    <div className="min-h-screen bg-[#f4f8fc] flex flex-col">
      <Header />

      <main className="flex-1 overflow-hidden">
        <ScrollRevealSection threshold={0.08} rootMargin="0px 0px -8% 0px">
          <section className="relative overflow-hidden border-b border-white/10 bg-linear-to-br from-[#0C2B4E] via-[#123B66] to-[#1D546C] px-4 pb-20 pt-24 sm:pt-28 text-white">
            <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-[#0C2B4E]/45 via-[#0C2B4E]/55 to-[#123B66]/85" />
            <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />

            <div className="relative z-20 mx-auto max-w-7xl text-center">
              <span className="smooth-enter inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-100">
                <ShieldCheck className="h-4 w-4" />
                Fast & Trusted Support
              </span>
              <h1 className="smooth-enter animation-delay-100 mx-auto mt-6 max-w-5xl text-4xl font-extrabold leading-tight sm:text-5xl">
                Let&apos;s Start a Conversation
              </h1>
              <p className="fade-in-up animation-delay-200 mx-auto mt-5 max-w-3xl text-lg text-blue-100">
                Have a question about verification, hiring workflows, or your
                profile? Our team is here to help.
              </p>

              <div className="fade-in-up animation-delay-300 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="mailto:support@careertrust.com"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0C2B4E] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50"
                >
                  Email Support
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/50 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </section>
        </ScrollRevealSection>

        <ScrollRevealSection threshold={0.14}>
          <section className="relative border-b border-slate-200/80 bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {contactInfo.map((info) => {
                  const Icon = info.icon;

                  const content = (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-sky-200 group-hover:scale-110">
                        <Icon className="w-6 h-6 text-sky-700" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 mb-1 transition-colors duration-300 group-hover:text-sky-700">
                          {info.label}
                        </h3>
                        <p className="text-slate-900 font-medium text-sm transition-colors duration-300 group-hover:text-sky-700 wrap-break-word">
                          {info.value}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          {info.description}
                        </p>
                      </div>
                    </>
                  );

                  return (
                    <article
                      key={info.label}
                      className={`fade-in-up ${info.delayClass} card-base rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-sky-100/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-200/60`}
                    >
                      {info.link ? (
                        <Link href={info.link} className="group flex items-start gap-4">
                          {content}
                        </Link>
                      ) : (
                        <div className="group flex items-start gap-4">{content}</div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        </ScrollRevealSection>

        <ScrollRevealSection threshold={0.14}>
          <section className="bg-slate-50 py-16 border-b border-slate-200">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="fade-in-up lg:col-span-7 xl:col-span-8">
                  <div className="card-base rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-lg">
                    <h2 className="fade-in-up text-2xl font-bold text-slate-900">
                      Send us a Message
                    </h2>
                    <p className="fade-in animation-delay-100 mt-2 text-sm text-slate-600">
                      Share your question and our team will get back to you
                      shortly.
                    </p>

                    {submitted && (
                      <div className="mt-5 mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 fade-in-up">
                        <p className="flex items-center gap-2 text-emerald-800 text-sm font-medium">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                            ✓
                          </span>
                          Thank you! We&apos;ve received your message and will
                          respond soon.
                        </p>
                      </div>
                    )}

                    <form
                      onSubmit={handleSubmit}
                      className="mt-6 space-y-4 fade-in animation-delay-200"
                    >
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-slate-700"
                          >
                            Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="Your name"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-slate-700"
                          >
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="subject"
                          className="mb-2 block text-sm font-medium text-slate-700"
                        >
                          Subject *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
                          placeholder="What is this about?"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="mb-2 block text-sm font-medium text-slate-700"
                        >
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={4}
                          className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
                          placeholder="Tell us more about your inquiry..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#0C2B4E] to-[#1A4F8B] py-2.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-75"
                      >
                        {isLoading ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </button>

                      <p className="text-center text-xs text-slate-500">
                        We respect your privacy. Your information is never
                        shared without consent.
                      </p>
                    </form>
                  </div>
                </div>

                <aside className="space-y-5 fade-in-up animation-delay-100 lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 lg:self-start">
                  <div className="card-base rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
                    <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                      <MessageCircle className="h-5 w-5 text-sky-700" />
                      Quick Links
                    </h3>
                    <div className="space-y-3">
                      <Link
                        href="/help"
                        className="group flex items-center gap-2 text-sm font-medium text-sky-700 transition-all duration-300 hover:translate-x-1 hover:text-sky-900"
                      >
                        <span>→</span>
                        <span>Help Center</span>
                      </Link>
                      <Link
                        href="/features"
                        className="group flex items-center gap-2 text-sm font-medium text-sky-700 transition-all duration-300 hover:translate-x-1 hover:text-sky-900"
                      >
                        <span>→</span>
                        <span>Features</span>
                      </Link>
                      <Link
                        href="/about"
                        className="group flex items-center gap-2 text-sm font-medium text-sky-700 transition-all duration-300 hover:translate-x-1 hover:text-sky-900"
                      >
                        <span>→</span>
                        <span>About Us</span>
                      </Link>
                      <Link
                        href="/blogs"
                        className="group flex items-center gap-2 text-sm font-medium text-sky-700 transition-all duration-300 hover:translate-x-1 hover:text-sky-900"
                      >
                        <span>→</span>
                        <span>Blog</span>
                      </Link>
                    </div>
                  </div>

                  <div className="card-base rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
                    <h3 className="mb-4 font-semibold text-slate-900">Follow Us</h3>
                    <div className="space-y-3">
                      <a
                        href="https://linkedin.com"
                        className="group flex items-center gap-2 rounded-lg bg-blue-50 p-3 transition-all duration-300 hover:scale-[1.02] hover:bg-blue-100"
                      >
                        <Linkedin className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          LinkedIn
                        </span>
                      </a>
                      <a
                        href="https://twitter.com"
                        className="group flex items-center gap-2 rounded-lg bg-sky-50 p-3 transition-all duration-300 hover:scale-[1.02] hover:bg-sky-100"
                      >
                        <Twitter className="h-5 w-5 text-sky-600" />
                        <span className="text-sm font-medium text-sky-900">
                          Twitter
                        </span>
                      </a>
                    </div>
                  </div>

                  <div className="card-base rounded-2xl border border-[#1f4f74]/25 bg-linear-to-br from-[#0f3558] to-[#1a4f8b] p-5 shadow-md">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-sky-100">
                      Support Window
                    </h3>
                    <p className="mt-2 text-xl font-bold text-white">Mon-Fri, 9AM-6PM</p>
                    <p className="mt-1 text-sm text-blue-100">
                      Urgent query? Mention &quot;Priority&quot; in subject for faster triage.
                    </p>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        </ScrollRevealSection>

        <ScrollRevealSection threshold={0.14}>
          <section className="bg-white py-16 border-b border-slate-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 fade-in-up">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Frequently Asked Questions
                </h2>
                <p className="mt-4 text-slate-600 text-lg fade-in animation-delay-100">
                  Find quick answers to common CareerTrust questions.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {faqs.map((faq, idx) => (
                  <article
                    key={faq.question}
                    className={`card-base rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg fade-in-up ${faqDelayClasses[idx] ?? "animation-delay-100"}`}
                  >
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {faq.answer}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </ScrollRevealSection>

        <ScrollRevealSection threshold={0.14}>
          <section className="relative overflow-hidden bg-[#f4f8fc] py-20 px-4">
            <div className="mx-auto max-w-7xl rounded-4xl border border-[#1f4f74]/40 bg-linear-to-br from-[#0b253f] via-[#0f3558] to-[#1d546c] shadow-[0_28px_70px_-30px_rgba(7,26,46,0.8)]">
              <div className="pointer-events-none absolute inset-0 opacity-20">
                <div className="float absolute right-10 top-8 h-64 w-64 rounded-full bg-[#8ad2ff] blur-3xl" />
                <div className="float-delayed absolute bottom-6 left-8 h-72 w-72 rounded-full bg-[#7db7ff] blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[34px_34px]" />
              </div>

              <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center sm:px-10 smooth-enter">
                <h2 className="text-3xl md:text-4xl font-bold text-white fade-in-up animation-delay-100">
                  Ready to Join CareerTrust?
                </h2>
                <p className="mt-4 text-white/85 text-lg fade-in animation-delay-200">
                  Build your verified profile and connect with trusted hiring
                  opportunities today.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center fade-in animation-delay-300">
                  <Link
                    href="/signup?role=jobseeker"
                    className="inline-flex items-center justify-center rounded-xl bg-[#8ad2ff] px-8 py-3 font-semibold text-[#0C2B4E] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a1dcff]"
                  >
                    Sign Up as Job Seeker
                  </Link>
                  <Link
                    href="/signup?role=employer"
                    className="inline-flex items-center justify-center rounded-xl border border-white/45 bg-transparent px-8 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    Post a Job
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </ScrollRevealSection>
      </main>

      <Footer />
    </div>
  );
}
