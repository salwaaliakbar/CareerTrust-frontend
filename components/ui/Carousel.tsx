"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import React from "react"

type CarouselProps = {
  leftSrc?: string
  rightSrc?: string
  intervalMs?: number
}

export default function Carousel({
  leftSrc = "/assets/images/general1 - Copy.png",
  rightSrc = "/assets/images/general2.png",
  intervalMs = 6000,
}: CarouselProps) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setActive((s) => (s === 0 ? 1 : 0)), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return (
    <>
      <div className="hidden md:block absolute inset-0 overflow-hidden z-0">
        <div className="relative h-full w-full">
          <div
            className={`absolute inset-0 transition-opacity ease-in-out duration-1000 ${active === 0 ? 'opacity-100 z-0' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 transition-smooth">
              <Image
                src={leftSrc}
                alt="decorative background"
                fill
                priority
                sizes="(min-width: 768px) 100vw"
                className="object-cover brightness-35 transform will-change-transform animate-slow-pan pointer-events-none"
                aria-hidden
              />
            </div>
          </div>

          <div
            className={`absolute inset-0 transition-opacity ease-in-out duration-1000 ${active === 0 ? 'opacity-0 z-0' : 'opacity-100 z-0'}`}
          >
            <div className="absolute inset-0 transition-smooth">
              <Image
                src={rightSrc}
                alt="decorative background"
                fill
                priority
                sizes="(min-width: 768px) 100vw"
                className="object-cover brightness-35 transform will-change-transform animate-slow-pan pointer-events-none"
                aria-hidden
              />
            </div>
          </div>
          {/* Pagination dots (visible and clickable) */}
          <div className="absolute left-0 right-0 bottom-6 z-20 flex justify-center items-center gap-3 pointer-events-auto">
            <button
              onClick={() => setActive(0)}
              aria-label="Show image 1"
              aria-pressed={active === 0 ? 'true' : 'false'}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${active === 0 ? 'bg-white scale-110 shadow-lg' : 'bg-white/40'}`}
            />
            <button
              onClick={() => setActive(1)}
              aria-label="Show image 2"
              aria-pressed={active === 1 ? 'true' : 'false'}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${active === 1 ? 'bg-white scale-110 shadow-lg' : 'bg-white/40'}`}
            />
          </div>
          {/* dark overlay to dim background images (below hero content) */}
          <div className="absolute inset-0 bg-blue-900 opacity-40 z-10 pointer-events-none" />
        </div>
      </div>
      {/* Mobile: show a lightweight static decorative image so hero isn't empty on small screens */}
      <div className="md:hidden absolute left-0 right-0 top-0 h-full overflow-hidden pointer-events-none z-0">
        <div className="relative h-full w-full">
          <div className={`absolute inset-0 z-0 opacity-100`}>
            <Image
              src={leftSrc}
              alt="decorative background mobile"
              fill
              priority
              className="object-cover brightness-35"
              aria-hidden
            />
          </div>
          <div className="absolute inset-0 bg-blue-900 opacity-40 z-10 pointer-events-none" />
        </div>
      </div>
    </>
  )
}
