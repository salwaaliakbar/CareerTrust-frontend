export type Candidate = {
  id: string;
  name: string;
  title?: string;
  location?: string;
  skills?: string[];
  avatar?: string;
  verified?: boolean;
};

export const DEMO_CANDIDATE: Candidate[] = [
  {
    id: "c1",
    name: "Aisha Khan",
    title: "Frontend Engineer",
    location: "Lagos, NG",
    skills: ["React", "TypeScript"],
    avatar: "/assets/images/profile1.jpg",
    verified: true,
  },
  {
    id: "c2",
    name: "Daniel Mensah",
    title: "Backend Engineer",
    location: "Accra, GH",
    skills: ["Node", "Postgres"],
    avatar: "/assets/images/profile2.jpg",
    verified: true,
  },
  {
    id: "c3",
    name: "Grace O.",
    title: "Product Designer",
    location: "Nairobi, KE",
    skills: ["Figma", "UX"],
    avatar: "/assets/images/profile3.jpg",
  },
];