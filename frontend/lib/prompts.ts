export interface Prompt {
  id: string;
  text: string;
  hint?: string; // Optional helper text
}

export interface Section {
  id: string;
  title: string;
  prompts: Prompt[];
}

export const sections: Section[] = [
  {
    id: "early-years",
    title: "Early Years",
    prompts: [
      {
        id: "earliest-memory",
        text: "What is one of your earliest memories?",
      },
      {
        id: "childhood-atmosphere",
        text: "How would you describe the atmosphere of your childhood home?",
        hint: "e.g., warm, busy, unpredictable, loving, structured…",
      },
      {
        id: "important-people",
        text: "Who were the important people in your early life?",
      },
    ],
  },
  {
    id: "growing-up",
    title: "Growing Up",
    prompts: [
      {
        id: "teenage-interests",
        text: "As a teenager, what interested you most?",
      },
      {
        id: "shaping-experience",
        text: "Was there a moment or experience in youth that shaped who you became?",
      },
    ],
  },
  // Future sections can be added here:
  // {
  //   id: "education",
  //   title: "Education & Learning",
  //   prompts: [...],
  // },
  // {
  //   id: "career",
  //   title: "Career & Work",
  //   prompts: [...],
  // },
];

// Helper functions
export function getSectionById(sectionId: string): Section | undefined {
  return sections.find((s) => s.id === sectionId);
}

export function getPromptById(
  sectionId: string,
  promptId: string
): Prompt | undefined {
  const section = getSectionById(sectionId);
  return section?.prompts.find((p) => p.id === promptId);
}

export function getAllPrompts(): { section: Section; prompt: Prompt }[] {
  return sections.flatMap((section) =>
    section.prompts.map((prompt) => ({ section, prompt }))
  );
}
