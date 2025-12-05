"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QuestionnaireLayout } from "@/features/questionnaire/components/QuestionnaireLayout";
import { QuestionCard } from "@/features/questionnaire/components/QuestionCard";
import { getSectionById } from "@/lib/prompts";

export default function EarlyYearsPage() {
  const section = getSectionById("early-years");

  if (!section) {
    return <div>Section not found</div>;
  }

  // TODO: Track which prompts have been recorded (will come from state/DB)
  const recordedPrompts: string[] = [];

  return (
    <QuestionnaireLayout
      title={section.title}
      backHref="/questionnaire/about"
    >
      <div className="flex flex-col gap-4">
        {section.prompts.map((prompt) => (
          <QuestionCard
            key={prompt.id}
            promptId={prompt.id}
            sectionId={section.id}
            text={prompt.text}
            hint={prompt.hint}
            isRecorded={recordedPrompts.includes(prompt.id)}
          />
        ))}
      </div>

      {/* Continue button */}
      <div className="mt-8">
        <Link href="/questionnaire/growing-up">
          <Button
            className="w-full bg-[#a89b7e] hover:bg-[#968a6f] text-white rounded-full h-14 text-base font-medium shadow-sm transition-all"
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>

        <p className="text-xs text-center text-[#5a5047] mt-4">
          You can skip questions and come back later
        </p>
      </div>
    </QuestionnaireLayout>
  );
}
