"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface QuestionnaireLayoutProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  children: React.ReactNode;
}

export function QuestionnaireLayout({
  title,
  subtitle,
  backHref = "/",
  children,
}: QuestionnaireLayoutProps) {
  return (
    <main className="min-h-screen flex flex-col p-6 bg-gradient-to-br from-[#EBE0C9] via-[#E0D0D2] to-[#D3BFE0]">
      {/* Header */}
      <div className="w-full max-w-md mx-auto mb-6">
        <Link
          href={backHref}
          className="inline-flex items-center text-[#5a5047] hover:text-[#2d2520] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
      </div>

      {/* Content */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-[#2d2520] mb-2">{title}</h1>
          {subtitle && (
            <p className="text-[#5a5047] text-sm leading-relaxed">{subtitle}</p>
          )}
        </div>

        {/* Form content */}
        {children}
      </div>
    </main>
  );
}
