"use client";

interface RecordingTimerProps {
  seconds: number;
  maxSeconds?: number;
}

export function RecordingTimer({
  seconds,
  maxSeconds = 180,
}: RecordingTimerProps) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formatted = `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  const maxFormatted = `${Math.floor(maxSeconds / 60)}:${(maxSeconds % 60).toString().padStart(2, "0")}`;

  const progress = (seconds / maxSeconds) * 100;
  const isNearLimit = progress > 80;

  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className={`text-3xl font-mono ${isNearLimit ? "text-red-500" : "text-[#2d2520]"}`}
      >
        {formatted}
      </span>
      <span className="text-sm text-[#5a5047]">max {maxFormatted}</span>

      {/* Progress bar */}
      <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300",
            isNearLimit ? "bg-red-500" : "bg-[#a89b7e]"
          )}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
