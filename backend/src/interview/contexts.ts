import type { InterviewDifficulty, InterviewSetup, InterviewContextId } from "./types";

export interface TopicDefinition {
  id: string;
  label: string;
  /** What a consular officer is trying to establish. Used in LLM prompts. */
  focus: string;
  /** Primary questions used by the demo provider. */
  questions: (setup: InterviewSetup) => string[];
  /** Topic-specific probe for answers that lack concrete detail. */
  specificsProbe: string;
}

export interface ContextDefinition {
  id: InterviewContextId;
  label: string;
  officerBrief: string;
  topics: TopicDefinition[];
  opening: (setup: InterviewSetup) => string;
  closing: string;
}

export interface DifficultyPolicy {
  maxQuestions: number;
  maxFollowUpsPerTopic: number;
  /** Answers shorter than this are treated as incomplete. */
  minAnswerWords: number;
  /** Whether hedging language ("maybe", "I think") triggers a probe. */
  probeHedging: boolean;
  tone: string;
}

export const DIFFICULTY_POLICIES: Record<InterviewDifficulty, DifficultyPolicy> = {
  comfortable: {
    maxQuestions: 6,
    maxFollowUpsPerTopic: 1,
    minAnswerWords: 8,
    probeHedging: false,
    tone: "Warm and patient. Rephrase gently and give the candidate room to think.",
  },
  realistic: {
    maxQuestions: 8,
    maxFollowUpsPerTopic: 1,
    minAnswerWords: 12,
    probeHedging: true,
    tone: "Neutral, efficient and professional, like a typical consular window interview.",
  },
  strict: {
    maxQuestions: 9,
    maxFollowUpsPerTopic: 2,
    minAnswerWords: 15,
    probeHedging: true,
    tone: "Formal and exacting. Expect precise, documented answers and question anything vague.",
  },
  pressure: {
    maxQuestions: 10,
    maxFollowUpsPerTopic: 2,
    minAnswerWords: 18,
    probeHedging: true,
    tone: "Brisk and skeptical. Short questions, quick follow-ups, little tolerance for hesitation.",
  },
};

function profileValue(setup: InterviewSetup, key: string, fallback: string): string {
  const value = (setup.profile as Record<string, string>)[key];
  return value && value.trim() ? value.trim() : fallback;
}

const F1: ContextDefinition = {
  id: "f1",
  label: "F-1 student visa",
  officerBrief:
    "You are a US consular officer conducting an F-1 student visa interview. Establish that the applicant is a genuine student, can fund their studies, and intends to return home after completing them.",
  opening: (s) => {
    const university = profileValue(s, "university", "");
    return university
      ? `Good morning. I see you've been admitted to ${university}. What will you be studying there?`
      : "Good morning. You're applying for an F-1 student visa. Which university will you be attending, and what will you study there?";
  },
  closing: "Thank you. That's all the questions I have for today.",
  topics: [
    {
      id: "program",
      label: "Course specifics",
      focus: "Program content, how it builds on prior education, and why it requires study in the US.",
      questions: (s) => [
        `Tell me about the ${profileValue(s, "program", "program")} you'll be studying. What will you learn?`,
        `How does ${profileValue(s, "program", "this program")} connect to what you studied before?`,
      ],
      specificsProbe: "Which specific courses or subjects in the curriculum are most relevant to you?",
    },
    {
      id: "institution",
      label: "Institution selection",
      focus: "Why this specific university; what other schools were considered; how the applicant chose it.",
      questions: (s) => [
        `Why did you choose ${profileValue(s, "university", "this university")} over other universities?`,
        `Which other universities did you apply to, and why did you pick ${profileValue(s, "university", "this one")}?`,
      ],
      specificsProbe: "Name something specific about the university — a professor, lab, course or facility — that influenced your decision.",
    },
    {
      id: "background",
      label: "Academic background",
      focus: "Previous degree, grades, test scores, and any gaps in education.",
      questions: (s) =>
        profileValue(s, "academicBackground", "")
          ? [`You mentioned your background is in ${profileValue(s, "academicBackground", "")}. What was your final grade or GPA?`]
          : ["What is your most recent degree, and when did you complete it?"],
      specificsProbe: "What were your exact grades or scores?",
    },
    {
      id: "funding",
      label: "Funding",
      focus: "Who pays tuition and living costs, total amount, sources (savings, loans, scholarships), sponsor's occupation and income.",
      questions: () => [
        "Who is sponsoring your education, and how much will the first year cost in total?",
        "How will you pay for tuition and living expenses?",
      ],
      specificsProbe: "What is the approximate amount, and what does your sponsor do for a living?",
    },
    {
      id: "intent",
      label: "Post-study plans",
      focus: "Plans after graduation, ties to home country, intent to return.",
      questions: () => [
        "What do you plan to do after you complete your degree?",
        "Why would you return home after your studies instead of staying in the US?",
      ],
      specificsProbe: "Which specific role or employer are you aiming for back home?",
    },
  ],
};

const H1B: ContextDefinition = {
  id: "h1b",
  label: "H-1B work visa",
  officerBrief:
    "You are a US consular officer conducting an H-1B specialty occupation visa interview. Establish that the role is a genuine specialty occupation, the employer relationship is real, and the applicant is qualified.",
  opening: (s) =>
    `Good morning. You're applying for an H-1B visa${
      profileValue(s, "employer", "") ? ` to work at ${profileValue(s, "employer", "")}` : ""
    }. What position will you be working in?`,
  closing: "Thank you. That's all the questions I have for today.",
  topics: [
    {
      id: "role",
      label: "Specialty occupation",
      focus: "Job title, day-to-day duties, and why the role requires specialized knowledge.",
      questions: (s) => [
        `What will your day-to-day responsibilities be as ${profileValue(s, "role", "an employee")}?`,
        "Why does this position require a specialized degree?",
      ],
      specificsProbe: "Describe one specific project or system you will be responsible for.",
    },
    {
      id: "employer",
      label: "Employer relationship",
      focus: "What the company does, size, where the applicant will work, client vs. employer site, how they were hired.",
      questions: (s) => [
        `What does ${profileValue(s, "employer", "your employer")} do, and how were you hired?`,
        "Where exactly will you be working, and who will you report to?",
      ],
      specificsProbe: "What is the name and title of your manager, and where is the office located?",
    },
    {
      id: "qualifications",
      label: "Qualifications",
      focus: "Degree, relevant experience, and how they match the role.",
      questions: (s) => [
        profileValue(s, "experience", "")
          ? `You mentioned ${profileValue(s, "experience", "")} of experience. How does that prepare you for this role?`
          : "What degree do you hold, and how does it qualify you for this role?",
      ],
      specificsProbe: "Which specific technologies or methods have you worked with professionally?",
    },
    {
      id: "compensation",
      label: "Compensation",
      focus: "Offered salary and whether it matches the role.",
      questions: () => ["What is your annual salary for this position?"],
      specificsProbe: "What is the exact figure stated in your offer?",
    },
    {
      id: "plans",
      label: "Long-term plans",
      focus: "Career plans and duration of stay.",
      questions: () => ["How long do you plan to work in the United States?"],
      specificsProbe: "What would you plan to do when your authorized stay ends?",
    },
  ],
};

const B1B2: ContextDefinition = {
  id: "b1b2",
  label: "B1/B2 visitor visa",
  officerBrief:
    "You are a US consular officer conducting a B1/B2 visitor visa interview. Establish the purpose and length of the trip, that the applicant can fund it, and that they have strong ties requiring them to return home.",
  opening: (s) =>
    `Good morning. What is the purpose of your trip${
      profileValue(s, "destination", "") ? ` to ${profileValue(s, "destination", "")}` : " to the United States"
    }?`,
  closing: "Thank you. That's all the questions I have for today.",
  topics: [
    {
      id: "purpose",
      label: "Travel purpose",
      focus: "Exact reason for the visit (business meetings, conference, tourism, family) and any invitation.",
      questions: (s) => [
        profileValue(s, "purpose", "")
          ? `You said the purpose is ${profileValue(s, "purpose", "")}. Can you tell me more about that?`
          : "Why do you want to visit the United States?",
      ],
      specificsProbe: "Who invited you, or which event or organisation is this visit connected to?",
    },
    {
      id: "itinerary",
      label: "Itinerary",
      focus: "Trip length, dates, cities, and where the applicant will stay.",
      questions: (s) => [
        `How long will you stay${profileValue(s, "duration", "") ? " — you mentioned " + profileValue(s, "duration", "") : ""}, and where will you be staying?`,
      ],
      specificsProbe: "What are your exact travel dates and accommodation?",
    },
    {
      id: "finances",
      label: "Finances",
      focus: "Who pays for the trip, estimated cost, and the applicant's income.",
      questions: () => ["Who is paying for this trip, and roughly how much will it cost?"],
      specificsProbe: "What do you do for work, and what is your monthly income?",
    },
    {
      id: "ties",
      label: "Home ties",
      focus: "Job, family, property or studies that require the applicant to return.",
      questions: () => ["What will bring you back home after your trip?"],
      specificsProbe: "Who is expecting you back, and what commitment do you have on your return date?",
    },
    {
      id: "history",
      label: "Travel history",
      focus: "Previous international travel and prior US visas.",
      questions: () => ["Have you travelled internationally before? Where to?"],
      specificsProbe: "Which countries, and when was your most recent trip?",
    },
  ],
};

export const CONTEXTS: Record<InterviewContextId, ContextDefinition> = {
  f1: F1,
  h1b: H1B,
  b1b2: B1B2,
};

export function getContext(id: InterviewContextId): ContextDefinition {
  return CONTEXTS[id];
}
