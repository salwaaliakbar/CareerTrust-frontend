
import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { testimonials } from "@/data/home/testimonials";
import { Testimonial } from "@/types/home.types";



const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

const TestimonialSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-sky-50 via-sky-100 to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0C2B4E] fade-in">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 fade-in animation-delay-100">
            Hear from job seekers and employers who found success with CareerTrust
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial: Testimonial, index: number) => (
            <div
              key={testimonial.name}
              className="bg-gradient-to-br from-sky-100 via-white to-sky-50 rounded-2xl p-8 shadow-lg border border-sky-100/80 relative animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-sky-300" />

              {/* Content */}
              <p className="text-sky-900 mb-6 leading-relaxed italic">
                “{testimonial.message}”
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-sky-100">
                {testimonial.image && testimonial.image.startsWith('/') ? (
                  <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-sky-300">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-lg">
                    {getInitials(testimonial.name)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sky-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">
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
