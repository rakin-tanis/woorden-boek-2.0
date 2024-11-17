import { useState } from "react";

type ValidationFunction = (value: string, formData: Record<string, any>) => string;

interface Validation {
  field: string;
  fn: ValidationFunction[];
}

interface UseFormReturn {
  formData: Record<string, any>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  errors: Record<string, any>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  validate: () => boolean;
  reset: () => void;
}

export const useForm = (validations: Validation[]): UseFormReturn => {
  // Initialize state with empty strings for each validation field.
  const initialState = validations.reduce<Record<string, string>>((acc, validation) => {
    const { field } = validation;
    return { ...acc, [field]: "" };
  }, {});

  const [formData, setFormData] = useState<Record<string, string>>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>(initialState);

  const reset = (): void => {
    setFormData(initialState);
    setErrors(initialState);
  };

  const validate = (): boolean => {
    let isInvalid = false;
    validations.forEach((validation) => {
      const { field, fn } = validation;
      let errorMessage = "";
      for (const validator of fn) {
        if (errorMessage) break; // Exit early if an error message is already found.
        errorMessage = validator(formData[field], formData);
      }
      setErrors((prevErrors) => ({ ...prevErrors, [field]: errorMessage }));
      if (errorMessage) isInvalid = true;
    });
    return !isInvalid; // Return true if there are no validation errors.
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    validate,
    reset,
  };
};
