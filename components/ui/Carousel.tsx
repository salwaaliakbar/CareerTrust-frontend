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
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="relative h-full w-full">
          <div
            className={`absolute inset-0 transition-opacity ease-in-out duration-3000 ${active === 0 ? 'opacity-100 z-0' : 'opacity-0 z-0'}`}
          >
            <Image
              src={leftSrc}
              alt="decorative background"
              fill
              priority
              sizes="(min-width: 768px) 100vw"
              className="object-cover brightness-35"
              aria-hidden
            />
          </div>

          <div
            className={`absolute inset-0 transition-opacity ease-in-out duration-3000 ${active === 0 ? 'opacity-0 z-0' : 'opacity-100 z-0'}`}
          >
            <Image
              src={rightSrc}
              alt="decorative background"
              fill
              priority
              sizes="(min-width: 768px) 100vw"
              className="object-cover brightness-35"
              aria-hidden
            />
          </div>
          {/* dark overlay to dim background images (below hero content) */}
          <div className="absolute inset-0 bg-blue-900 opacity-40 z-10 pointer-events-none" />
        </div>
      </div>
    </>
  )
}
