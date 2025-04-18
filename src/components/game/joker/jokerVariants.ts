import { GameState } from "@/hooks/useGameLogic";
import {
  Clock,
  Eye,
  LucideIcon,
  Microscope,
  SearchCode,
  Shield,
} from "lucide-react";

export type JokerButtonVariantType =
  | "blue"
  | "purple"
  | "yellow"
  | "lime"
  | "cyan"
  | "orange"
  | "amber"
  | "green"
  | "emerald"
  | "teal"
  | "sky"
  | "indigo"
  | "violet"
  | "fuchsia"
  | "pink"
  | "rose"
  | "red";

type JokerButtonVariantsDetailType = {
  [key in JokerButtonVariantType]: JokerButtonVariantsDetailValueType;
};

export type JokerButtonVariantsDetailValueType = {
  enabled: string;
  disabled: string;
  textColor: string;
  bgColor: string;
  color: string;
  darkTextColor: string;
};

export const JokerButtonVariantsDetail: JokerButtonVariantsDetailType = {
  blue: {
    enabled:
      "text-white bg-blue-600 border-0 hover:text-blue-400 hover:bg-blue-200 hover:border-0",
    disabled: "bg-blue-300 text-white cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-blue-600",
    color: "blue-600",
    darkTextColor: "text-blue-600",
  },
  purple: {
    enabled:
      "text-white bg-purple-600 border-0 hover:text-purple-400 hover:bg-purple-200 hover:border-0",
    disabled:
      "border border-blue-300 text-blue-300 cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-purple-600",
    color: "purple-600",
    darkTextColor: "text-purple-600",
  },
  yellow: {
    enabled:
      "text-white bg-yellow-500 border-0 hover:text-yellow-400 hover:bg-yellow-200 hover:border-0",
    disabled: "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-yellow-500",
    color: "yellow-500",
    darkTextColor: "text-yellow-600",
  },
  lime: {
    enabled:
      "text-white bg-lime-600 border-0 hover:text-lime-400 hover:bg-lime-200 hover:border-0",
    disabled: "bg-lime-300 text-white cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-lime-600",
    color: "lime-600",
    darkTextColor: "text-lime-600",
  },
  cyan: {
    enabled:
      "text-white bg-cyan-600 border-0 hover:text-cyan-400 hover:bg-cyan-200 hover:border-0",
    disabled: "bg-cyan-300 text-white cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-cyan-600",
    color: "cyan-600",
    darkTextColor: "text-cyan-600",
  },
  orange: {
    enabled:
      "text-white bg-orange-600 border-0 hover:text-orange-400 hover:bg-orange-200 hover:border-0",
    disabled: "bg-orange-300 text-white cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-orange-600",
    color: "orange-600",
    darkTextColor: "text-orange-600",
  },
  amber: {
    enabled:
      "text-white bg-amber-500 border-0 hover:text-amber-400 hover:bg-amber-200 hover:border-0",
    disabled: "bg-amber-300 text-white cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-amber-500",
    color: "amber-500",
    darkTextColor: "text-amber-600",
  },
  green: {
    enabled:
      "text-white bg-green-600 border-0 hover:text-green-400 hover:bg-green-200 hover:border-0",
    disabled: "bg-green-300 text-white cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-green-600",
    color: "green-600",
    darkTextColor: "text-green-600",
  },
  emerald: {
    enabled:
      "text-white bg-emerald-600 border-0 hover:text-emerald-400 hover:bg-emerald-200 hover:border-0",
    disabled: "bg-emerald-300 text-white cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-emerald-600",
    color: "emerald-600",
    darkTextColor: "text-emerald-600",
  },
  teal: {
    enabled:
      "text-white bg-teal-600 border-0 hover:text-teal-400 hover:bg-teal-200 hover:border-0",
    disabled: "bg-teal-300 text-white cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-teal-600",
    color: "teal-600",
    darkTextColor: "text-teal-600",
  },
  sky: {
    enabled:
      "text-white bg-sky-600 border-0 hover:text-sky-400 hover:bg-sky-200 hover:border-0",
    disabled: "bg-sky-300 text-white cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-sky-600",
    color: "sky-600",
    darkTextColor: "text-sky-600",
  },
  indigo: {
    enabled:
      "text-white bg-indigo-600 border-0 hover:text-indigo-400 hover:bg-indigo-200 hover:border-0",
    disabled: "bg-indigo-300 text-white cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-indigo-600",
    color: "indigo-600",
    darkTextColor: "text-indigo-600",
  },
  violet: {
    enabled:
      "text-white bg-violet-600 border-0 hover:text-violet-400 hover:bg-violet-200 hover:border-0",
    disabled: "bg-violet-300 text-white cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-violet-600",
    color: "violet-600",
    darkTextColor: "text-violet-600",
  },
  fuchsia: {
    enabled:
      "text-white bg-fuchsia-600 border-0 hover:text-fuchsia-400 hover:bg-fuchsia-200 hover:border-0",
    disabled: "bg-fuchsia-300 text-white cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-fuchsia-600",
    color: "fuchsia-600",
    darkTextColor: "text-fuchsia-600",
  },
  pink: {
    enabled:
      "text-white bg-pink-600 border-0 hover:text-pink-400 hover:bg-pink-200 hover:border-0",
    disabled: "bg-pink-300 text-white cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-pink-600",
    color: "pink-600",
    darkTextColor: "text-pink-600",
  },
  rose: {
    enabled:
      "text-white bg-rose-600 border-0 hover:text-rose-400 hover:bg-rose-200 hover:border-0",
    disabled: "bg-rose-300 text-white cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-rose-600",
    color: "rose-600",
    darkTextColor: "text-rose-600",
  },
  red: {
    enabled:
      "text-white bg-red-600 border-0 hover:text-red-400 hover:bg-red-200 hover:border-0",
    disabled: "bg-red-300 text-white cursor-not-allowed opacity-50",
    textColor: "text-white",
    bgColor: "bg-red-600",
    color: "red-600",
    darkTextColor: "text-red-600",
  },
};

export const getJokerButtonVariantDetails = (
  variant: JokerButtonVariantType
) => {
  return JokerButtonVariantsDetail[variant];
};

export interface Joker {
  id: string;
  name: string;
  description: string;
  order: number;
  action: ((gameState: GameState, ...params: unknown[]) => void) | null;
  count: number;
  disabled: boolean;
  variant: JokerButtonVariantType;
  animationVariant: "bubbly";
  icon: LucideIcon;
}

export const jokerEffectIds = {
  SHOW_WRONG_LETTERS_PLACE: "showWrongLettersPlace",
  SHOW_WRONG_WORDS_PLACE: "showWrongWordsPlace",
  SHAKING: "shaking",
  SHOW_CORRECT_LETTERS: "showCorrectLetters",
};

export const jokerIds = {
  SHOW_WRONG_LETTERS: "showWrongLetters",
  SHOW_WRONG_WORDS: "showWrongWords",
  SHOW_ANSWER_IF_NOT_WRONG: "showAnswerIfNotWrong",
  TIME: "time",
  SHOW_CORRECT_LETTERS: "showCorrectLetters",
};

export const JOKERS: ReadonlyArray<Joker> = [
  {
    id: jokerIds.SHOW_WRONG_LETTERS,
    name: "Letterverkenner",
    description: "Deze joker vindt en toont de verkeerd geschreven letters.",
    order: 1,
    action: null,
    count: 3,
    disabled: false,
    variant: "rose",
    animationVariant: "bubbly",
    icon: Microscope,
  },
  {
    id: jokerIds.SHOW_WRONG_WORDS,
    name: "Woordenjager",
    description: "Deze joker vindt en toont de verkeerd geschreven woorden.",
    order: 2,
    action: null,
    count: 3,
    disabled: false,
    variant: "orange",
    animationVariant: "bubbly",
    icon: SearchCode,
  },
  {
    id: jokerIds.SHOW_ANSWER_IF_NOT_WRONG,
    name: "Veilige Beschermer",
    description:
      "Deze joker stelt je in staat om je antwoord veilig te testen. Als je een verkeerd antwoord geeft, verlies je niet.",
    order: 3,
    action: null,
    count: 3,
    disabled: false,
    variant: "amber",
    animationVariant: "bubbly",
    icon: Shield,
  },
  {
    id: jokerIds.TIME,
    name: "Tijdskluis",
    description: "Deze joker geeft je 15 extra seconden.",
    order: 4,
    action: null,
    count: 1,
    disabled: false,
    variant: "blue",
    animationVariant: "bubbly",
    icon: Clock,
  },
  {
    id: jokerIds.SHOW_CORRECT_LETTERS,
    name: "Oog van Correctie",
    description:
      "Deze joker corrigeert een van de verkeerde of ontbrekende letters voor jou.",
    order: 5,
    action: null,
    count: 9,
    disabled: false,
    variant: "green",
    animationVariant: "bubbly",
    icon: Eye,
  },
];
