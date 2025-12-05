"use client";

import { Mic, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  promptId: string;
  sectionId: string;
  text: string;
  hint?: string;
  isRecorded?: boolean;
}

export function QuestionCard({
  promptId,
  sectionId,
  text,
  hint,
  isRecorded = false,
}: QuestionCardProps) {
  const recordUrl = `/record?section=${sectionId}&prompt=${promptId}`;

  return (
    <div
      className={cn(
        "bg-white/60 rounded-xl p-5 shadow-sm",
        "border border-transparent",
        isRecorded && "border-green-200 bg-green-50/30"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-[#2d2520] font-medium leading-relaxed">{text}</p>
          {hint && (
            <p className="text-sm text-[#5a5047] mt-1 italic">{hint}</p>
          )}
        </div>

        <Link
          href={recordUrl}
          className={cn(
            "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full",
            "text-sm font-medium transition-all",
            isRecorded
              ? "bg-green-100 text-green-700"
              : "bg-[#a89b7e] text-white hover:bg-[#968a6f]"
          )}
        >
          {isRecorded ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Done
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Record
            </>
          )}
        </Link>
      </div>
    </div>
  );
}
