"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  message?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
  message,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-solid border-[#a89b7e] border-t-transparent",
          sizeClasses[size]
        )}
      />
      {message && (
        <p className="text-sm text-[#5a5047] animate-pulse">{message}</p>
      )}
    </div>
  );
}
