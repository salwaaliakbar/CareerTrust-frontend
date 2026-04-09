
import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { testimonials } from "@/data/home/testimonials";
import { Testimonial } from "@/types/home.types";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const delayClass = ["animation-delay-100", "animation-delay-300", "animation-delay-500"];

const TestimonialSection = () => {
  return (
    <section className="py-20 px-4 bg-linear-to-br from-[#f6fbff] via-[#eaf4fc] to-[#f4f8fc] relative overflow-hidden">
      <div className="absolute -left-16 top-0 w-80 h-80 rounded-full blur-3xl bg-[#0c2b4e]/10 pointer-events-none" />
      <div className="absolute -right-16 bottom-0 w-80 h-80 rounded-full blur-3xl bg-[#1d546c]/10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#d3e3f1] mb-5 fade-in-up">
            <Star className="w-4 h-4 text-[#d2a24e]" />
            <span className="text-sm font-semibold text-[#0c2b4e]">Client Voices</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0c2b4e] fade-in">
            Success Stories from Real Users
          </h2>
          <p className="text-lg sm:text-xl text-[#4b627a] fade-in animation-delay-100">
            Hear from job seekers and employers who improved hiring outcomes through trusted data.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial: Testimonial, index: number) => (
            <div
              key={testimonial.name}
              className={`bg-white rounded-2xl p-8 shadow-[0_20px_45px_-26px_rgba(10,34,63,0.55)] border border-[#d9e6f2] relative fade-in-up hover:-translate-y-1 hover:shadow-[0_26px_54px_-26px_rgba(10,34,63,0.58)] transition-all duration-500 ${delayClass[index % delayClass.length]}`}
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[#b9d7ef]" />

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#d2a24e] text-[#d2a24e]" />
                ))}
              </div>

              <p className="text-[#173a61] mb-6 leading-relaxed italic">
                “{testimonial.message}”
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-[#dfebf6]">
                {testimonial.image && testimonial.image.startsWith("/") ? (
                  <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-[#bdddf4]">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#0c2b4e] flex items-center justify-center text-white font-bold text-lg">
                    {getInitials(testimonial.name)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-[#0f2f52]">{testimonial.name}</p>
                  <p className="text-sm text-[#5a738c]">
                    {testimonial.role}{testimonial.company && ` at ${testimonial.company}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
