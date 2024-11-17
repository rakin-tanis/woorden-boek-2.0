import { Example } from "@/types";

// Validation function
export const validateExample = (example: Example) => {
  const { status, turkish, dutch, words, source, level, theme } = example;

  if (status === "published") {
    // All fields must be filled

    if (!turkish) {
      return {
        valid: false,
        error: "Turkish fields must be filled when status is published",
      };
    }

    if (!dutch) {
      return {
        valid: false,
        error: "Dutch fields must be filled when status is published",
      };
    }

    if (!words) {
      return {
        valid: false,
        error: "Words fields must be filled when status is published",
      };
    }
  } else if (status === "draft") {
    // At least one of Turkish or Dutch must be filled, others must be filled
    const atLeastOneFilled = !!turkish || !!dutch;
    if (!atLeastOneFilled) {
      return {
        valid: false,
        error:
          "At least one of Turkish or Dutch must be filled when status is draft",
      };
    }
  }

  if (!source) {
    return {
      valid: false,
      error: "Source is required",
    };
  }

  if (!level) {
    return {
      valid: false,
      error: "Level is required",
    };
  }

  if (!theme) {
    return {
      valid: false,
      error: "Theme is required",
    };
  }

  return { valid: true };
};
