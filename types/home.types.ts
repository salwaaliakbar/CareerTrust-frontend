import React from "react";

export interface statsData {
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
        value: string;
        label: string;
        description: string;
}

export interface Testimonial {
    name: string;
    role: string;
    company?: string;
    image: string;
    message: string;
}