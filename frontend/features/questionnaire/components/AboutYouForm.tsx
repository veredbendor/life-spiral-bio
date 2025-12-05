"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormInput } from "./FormInput";
import { saveAboutYou } from "../api";

export interface AboutYouData {
  fullName: string;
  dateOfBirth: string;
  birthPlace: string;
  currentLocation: string;
}

interface AboutYouFormProps {
  initialData?: AboutYouData;
  onSubmit?: (data: AboutYouData) => void;
}

export function AboutYouForm({ initialData, onSubmit }: AboutYouFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<AboutYouData>(
    initialData || {
      fullName: "",
      dateOfBirth: "",
      birthPlace: "",
      currentLocation: "",
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof AboutYouData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Call API to save data
      await saveAboutYou({
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth || undefined,
        birth_place: formData.birthPlace || undefined,
        current_location: formData.currentLocation || undefined,
      });

      if (onSubmit) {
        onSubmit(formData);
      }

      // Navigate to Early Years page
      router.push("/questionnaire/early-years");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = formData.fullName.trim() !== "";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <FormInput
        label="Full name (as you want it recorded)"
        name="fullName"
        value={formData.fullName}
        onChange={updateField("fullName")}
        placeholder="Enter your full name"
        required
      />

      <FormInput
        label="Date of birth"
        name="dateOfBirth"
        type="date"
        value={formData.dateOfBirth}
        onChange={updateField("dateOfBirth")}
      />

      <FormInput
        label="Where were you born?"
        name="birthPlace"
        value={formData.birthPlace}
        onChange={updateField("birthPlace")}
        placeholder="City, Country"
      />

      <FormInput
        label="Where do you live now?"
        name="currentLocation"
        value={formData.currentLocation}
        onChange={updateField("currentLocation")}
        placeholder="City, Country"
      />

      {/* Submit button */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full bg-[#a89b7e] hover:bg-[#968a6f] text-white rounded-full h-14 text-base font-medium shadow-sm transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Continue"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Privacy note */}
      <p className="text-xs text-center text-[#5a5047]">
        Your information is private and will only be used to personalize your
        biography.
      </p>
    </form>
  );
}
