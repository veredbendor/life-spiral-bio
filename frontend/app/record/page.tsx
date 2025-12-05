import { Suspense } from "react";
import { LoadingSpinner } from "@/features/shared/components/LoadingSpinner";
import RecordPageContent from "./RecordPageContent";

export default function RecordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EBE0C9] via-[#E0D0D2] to-[#D3BFE0]">
          <LoadingSpinner size="lg" message="Loading..." />
        </main>
      }
    >
      <RecordPageContent />
    </Suspense>
  );
}
