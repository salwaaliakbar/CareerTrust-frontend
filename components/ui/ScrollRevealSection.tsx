"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type ScrollRevealSectionProps = {
	children: ReactNode;
	className?: string;
	threshold?: number;
	rootMargin?: string;
	once?: boolean;
};

export default function ScrollRevealSection({
	children,
	className = "",
	threshold = 0.2,
	rootMargin = "0px 0px -12% 0px",
	once = true,
}: ScrollRevealSectionProps) {
	const sectionRef = useRef<HTMLDivElement | null>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const node = sectionRef.current;
		if (!node) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (!entry) return;

				if (entry.isIntersecting) {
					setIsVisible(true);
					if (once) {
						observer.disconnect();
					}
				} else if (!once) {
					setIsVisible(false);
				}
			},
			{ threshold, rootMargin }
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, [once, rootMargin, threshold]);

	return (
		<div
			ref={sectionRef}
			className={`reveal-on-scroll ${isVisible ? "is-visible" : ""} ${className}`.trim()}
		>
			<div className="smooth-enter">{children}</div>
		</div>
	);
}
