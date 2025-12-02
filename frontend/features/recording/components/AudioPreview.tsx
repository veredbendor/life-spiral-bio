"use client";

import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPreviewProps {
  audioUrl: string;
  onReset: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function AudioPreview({
  audioUrl,
  onReset,
  onSubmit,
  isSubmitting,
}: AudioPreviewProps) {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      {/* Audio player */}
      <div className="w-full">
        <audio src={audioUrl} controls className="w-full" />
      </div>

      {/* Actions */}
      <div className="flex gap-4 w-full">
        <Button
          variant="outline"
          onClick={onReset}
          disabled={isSubmitting}
          className="flex-1 h-12 border-[#a89b7e] text-[#2d2520] hover:bg-[#a89b7e]/10"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Re-record
        </Button>

        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 h-12 bg-[#a89b7e] hover:bg-[#968a6f] text-white"
        >
          {isSubmitting ? (
            "Processing..."
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Create Story
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
