import { AppliedJoker, Example } from "@/types";
import { LetterInput } from "./LetterInput";
import { Button } from "../ui/Button";

interface GameQuestionProps {
  currentQuestion: Example;
  questionStatus: 'playing' | 'success' | 'failed';
  feedback: string[];
  appliedJokers: AppliedJoker[]
  onAnswerComplete: (answer: string) => void;
  onShowAnswer: () => void;
  onNextQuestion: () => void;
}

export const GameQuestion: React.FC<GameQuestionProps> = ({
  currentQuestion,
  questionStatus,
  feedback,
  appliedJokers,
  onAnswerComplete,
  onShowAnswer,
  onNextQuestion
}) => (
  <div className="space-y-4">
    <div className="text-center text-gray-950 dark:text-white">
      <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">
        Niveau: {currentQuestion.level} - {currentQuestion.theme}
      </div>
      <div className="text-xl font-medium">{currentQuestion.turkish}</div>
    </div>

    <LetterInput
      expectedAnswer={currentQuestion.dutch}
      questionStatus={questionStatus}
      appliedJokers={appliedJokers}
      onAnswerComplete={onAnswerComplete}
      onEnter={questionStatus === 'playing' ? onShowAnswer : onNextQuestion}
    />

    {feedback && feedback.length > 0 && (
      feedback.map((fb, index) => (
        <div
          key={index}
          className={`text-center px-2 rounded 
            ${feedback.some(fb => fb.startsWith('Correct'))
              ? 'text-green-600'
              : 'text-red-600'
            }`}
        >
          {fb}
        </div>
      ))
    )}

    <Button
      onClick={questionStatus === 'playing' ? onShowAnswer : onNextQuestion}
      className="w-full"
    >
      {questionStatus === 'playing' ? 'Show Answer' : 'Next Question'}
    </Button>
  </div>
);