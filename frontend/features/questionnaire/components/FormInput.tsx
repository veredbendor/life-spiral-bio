"use client";

import { cn } from "@/lib/utils";

interface FormInputProps {
  label: string;
  name: string;
  type?: "text" | "date";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-[#2d2520]"
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-3 rounded-xl",
          "bg-white/60 border border-[#d4c8b8]",
          "text-[#2d2520] placeholder:text-[#a89b7e]",
          "focus:outline-none focus:ring-2 focus:ring-[#a89b7e]/50 focus:border-[#a89b7e]",
          "transition-all"
        )}
      />
    </div>
  );
}
