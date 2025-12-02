"use client";

import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecordButtonProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export function RecordButton({
  isRecording,
  onStart,
  onStop,
  disabled,
}: RecordButtonProps) {
  return (
    <button
      onClick={isRecording ? onStop : onStart}
      disabled={disabled}
      className={cn(
        "relative w-24 h-24 rounded-full flex items-center justify-center transition-all",
        "focus:outline-none focus:ring-4 focus:ring-offset-2",
        isRecording
          ? "bg-red-500 hover:bg-red-600 focus:ring-red-300 animate-pulse"
          : "bg-[#a89b7e] hover:bg-[#968a6f] focus:ring-[#a89b7e]/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
    >
      {isRecording ? (
        <Square className="h-8 w-8 text-white" fill="white" />
      ) : (
        <Mic className="h-10 w-10 text-white" />
      )}

      {/* Pulse ring when recording */}
      {isRecording && (
        <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25" />
      )}
    </button>
  );
}
