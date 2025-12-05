"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useRecorder } from "@/features/recording/hooks/useRecorder";
import { RecordButton } from "@/features/recording/components/RecordButton";
import { RecordingTimer } from "@/features/recording/components/RecordingTimer";
import { AudioPreview } from "@/features/recording/components/AudioPreview";
import { LoadingSpinner } from "@/features/shared/components/LoadingSpinner";
import { processRecording } from "@/features/recording/api";
import { ProcessResponse } from "@/lib/api-client";
import { getPromptById } from "@/lib/prompts";

type PageState = "record" | "preview" | "processing" | "result";

export default function RecordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get prompt from URL params
  const sectionId = searchParams.get("section");
  const promptId = searchParams.get("prompt");
  const prompt = sectionId && promptId ? getPromptById(sectionId, promptId) : null;

  // Determine back URL
  const backUrl = sectionId ? `/questionnaire/${sectionId}` : "/";
  const {
    state: recorderState,
    audioBlob,
    audioUrl,
    duration,
    error: recorderError,
    startRecording,
    stopRecording,
    resetRecording,
  } = useRecorder();

  const [pageState, setPageState] = useState<PageState>("record");
  const [result, setResult] = useState<ProcessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!audioBlob) return;

    setPageState("processing");
    setError(null);

    try {
      const response = await processRecording(audioBlob);
      setResult(response);
      setPageState("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPageState("preview");
    }
  };

  const handleReset = () => {
    resetRecording();
    setResult(null);
    setError(null);
    setPageState("record");
  };

  const isRecording = recorderState === "recording";
  const hasRecording = recorderState === "stopped" && audioUrl;

  return (
    <main className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-br from-[#EBE0C9] via-[#E0D0D2] to-[#D3BFE0]">
      {/* Header */}
      <div className="w-full max-w-md mb-8">
        <Link
          href={backUrl}
          className="inline-flex items-center text-[#5a5047] hover:text-[#2d2520] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col items-center">
        {/* Processing State */}
        {pageState === "processing" && (
          <div className="flex flex-col items-center justify-center flex-1 gap-6">
            <LoadingSpinner size="lg" message="Creating your story..." />
            <p className="text-sm text-[#5a5047] text-center max-w-xs">
              We&apos;re transcribing your recording and crafting it into a
              beautiful narrative.
            </p>
          </div>
        )}

        {/* Result State */}
        {pageState === "result" && result && (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-serif text-[#2d2520]">
                {result.title}
              </h1>
              <p className="text-sm text-[#5a5047]">
                {result.word_count} words
              </p>
            </div>

            <div className="w-full bg-white/60 rounded-xl p-6 shadow-sm">
              <p className="text-[#2d2520] leading-relaxed whitespace-pre-wrap">
                {result.story}
              </p>
            </div>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => navigator.clipboard.writeText(result.story)}
                className="flex-1 h-12 border border-[#a89b7e] text-[#2d2520] rounded-lg hover:bg-[#a89b7e]/10 transition-colors"
              >
                Copy Story
              </button>
              <button
                onClick={handleReset}
                className="flex-1 h-12 bg-[#a89b7e] text-white rounded-lg hover:bg-[#968a6f] transition-colors"
              >
                Record Another
              </button>
            </div>
          </div>
        )}

        {/* Record/Preview State */}
        {(pageState === "record" || pageState === "preview") && (
          <>
            <div className="text-center space-y-3 mb-8">
              <h1 className="text-3xl font-serif text-[#2d2520]">
                {prompt ? prompt.text : "Share Your Memory"}
              </h1>
              {prompt?.hint && (
                <p className="text-[#5a5047] italic text-sm">{prompt.hint}</p>
              )}
              <p className="text-[#5a5047]">
                {hasRecording
                  ? "Review your recording or re-record"
                  : "Press the button and start speaking"}
              </p>
            </div>

            {/* Error message */}
            {(error || recorderError) && (
              <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 text-sm">{error || recorderError}</p>
              </div>
            )}

            {/* Recording UI */}
            {!hasRecording && (
              <div className="flex flex-col items-center gap-8">
                <RecordButton
                  isRecording={isRecording}
                  onStart={startRecording}
                  onStop={stopRecording}
                />
                <RecordingTimer seconds={duration} />

                {isRecording && (
                  <p className="text-[#5a5047] text-sm animate-pulse">
                    Recording... Click to stop
                  </p>
                )}
              </div>
            )}

            {/* Preview UI */}
            {hasRecording && audioUrl && (
              <AudioPreview
                audioUrl={audioUrl}
                onReset={handleReset}
                onSubmit={handleSubmit}
                isSubmitting={pageState === "processing"}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
