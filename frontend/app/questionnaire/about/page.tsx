"use client";

import { QuestionnaireLayout } from "@/features/questionnaire/components/QuestionnaireLayout";
import { AboutYouForm } from "@/features/questionnaire/components/AboutYouForm";

export default function AboutYouPage() {
  return (
    <QuestionnaireLayout
      title="About You"
      backHref="/"
    >
      <AboutYouForm />
    </QuestionnaireLayout>
  );
}
