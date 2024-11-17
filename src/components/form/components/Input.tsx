import React, { ChangeEvent } from "react";
import { INPUT } from "./constants";

interface InputProps {
  type: "text" | "email" | "password" | "checkbox" | "datetime-local" | string; // Add other specific types as needed
  name: string;
  placeholder?: string;
  value?: string | number;
  error?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type,
  name,
  placeholder = "",
  value,
  error,
  onChange,
  className = "",
}) => {
  return (
    <div className="relative w-full">
      <div className="flex gap-4">
        {type === "checkbox" && (
          <span className="text-sm text-slate-400">{placeholder}</span>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${INPUT} ${type === "checkbox" || type === "datetime-local"
              ? "w-fit"
              : "w-full"
            } ${error ? "border-secondary" : ""} ${className}`}
        />
      </div>
      {error && (
        <div
          className={`absolute top-0 right-0 text-[10px] mt-1 transform translate-x-full bg-red-50 text-red-700 rounded-md px-3 py-2 shadow-lg pointer-events-none`}
        >
          {error}
        </div>
      )}
    </div>
  );
};
