export type JokerButtonVariantType = "blue" | "purple" | "yellow" | "lime";

type JokerButtonVariantsDetailType = {
  [key in JokerButtonVariantType]: JokerButtonVariantsDetailValueType;
};

export type JokerButtonVariantsDetailValueType = {
  enabled: string;
  disabled: string;
  textColor: string;
  bgColor: string;
  color: string;
};

export const JokerButtonVariantsDetail: JokerButtonVariantsDetailType = {
  blue: {
    enabled:
      "text-white bg-blue-600 border-0 hover:text-blue-400 hover:bg-blue-200 hover:border-0",
    disabled: "bg-blue-300 text-white cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-blue-600",
    color: 'blue-600',
  },
  purple: {
    enabled:
      "text-white bg-purple-600 border-0 hover:text-purple-400 hover:bg-purple-200 hover:border-0",
    disabled:
      "border border-blue-300 text-blue-300 cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-purple-600",
    color: 'purple-600',
  },
  yellow: {
    enabled:
      "text-white bg-yellow-500 border-0 hover:text-yellow-400 hover:bg-yellow-200 hover:border-0",
    disabled: "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-yellow-500",
    color: 'yellow-500',
  },
  lime: {
    enabled:
      "text-white bg-lime-600 border-0 hover:text-lime-400 hover:bg-lime-200 hover:border-0",
    disabled: "bg-lime-300 text-white cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-lime-600",
    color: 'lime-600',
  },
};

export const getJokerButtonVariantDetails = (
  variant: JokerButtonVariantType
) => {
  return JokerButtonVariantsDetail[variant];
};
