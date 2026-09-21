import { ContextDefinition } from "@/types/context";

export const INTERVIEW_CONTEXTS: ContextDefinition[] = [
  {
    id: "f1",
    number: "01",
    code: "F-1",
    category: "Academic",
    headline: "Practice questions around your program, university, funding, and plans after graduation.",
    supporting:
      "Articulate your university choice, research focus, curriculum alignment, and long-term academic trajectory with calm conviction.",
    image: "/images/context-academic.jpg",
    topics: ["Institution Selection", "Funding Architecture", "Post-Study Intent", "Course Specifics"],
  },
  {
    id: "h1b",
    number: "02",
    code: "H-1B",
    category: "Professional",
    headline: "Practice explaining your role, employer, work, qualifications, and expertise clearly.",
    supporting:
      "Clarify your specialized knowledge, employer relationships, technical responsibilities, and wage structure under direct questioning.",
    image: "/images/visora-context-2.jpg",
    topics: ["Specialty Occupation", "Employer Relationship", "Project Architecture", "Technical Depth"],
  },
  {
    id: "b1b2",
    number: "03",
    code: "B1/B2",
    category: "Visitor",
    headline: "Practice explaining your travel purpose, plans, finances, and reasons for returning.",
    supporting:
      "Communicate your itinerary, professional obligations, home country ties, and precise duration without hesitation.",
    image: "/images/visora-context-3.jpg",
    topics: ["Itinerary Precision", "Domestic Ties", "Financial Independence", "Travel Intent"],
  },
];
