// components/LetterInput.tsx
import React, { useState, useRef, useEffect } from 'react';

interface LetterInputProps {
  expectedAnswer: string;
  onAnswerComplete: (answer: string) => void;
}

export const LetterInput: React.FC<LetterInputProps> = ({
  expectedAnswer,
  onAnswerComplete
}) => {
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prepare input fields based on expected answer
  useEffect(() => {
    const cleanedAnswer = expectedAnswer.replace(/\s+/g, '');
    const inputLength = cleanedAnswer.length;
    setUserAnswer(new Array(inputLength).fill(''));
    setFocusedIndex(0);
  }, [expectedAnswer]);

  // Check if answer is complete
  useEffect(() => {
    if (userAnswer.every(letter => letter !== '')) {
      onAnswerComplete(userAnswer.join(''));
    }
  }, [userAnswer]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ensure the container is focused
      if (!containerRef.current?.contains(document.activeElement)) return;

      const key = e.key;

      // Allow only single alphabetic characters
      if (key.length === 1 && /^[a-zA-Z]$/i.test(key)) {
        const newAnswer = [...userAnswer];
        newAnswer[focusedIndex] = key.toLowerCase();
        setUserAnswer(newAnswer);

        // Move to next input if current is filled
        if (focusedIndex < inputRefs.current.length - 1) {
          setFocusedIndex(prev => prev + 1);
          inputRefs.current[focusedIndex + 1]?.focus();
        }
      }

      // Handle navigation and deletion
      if (key === 'ArrowRight') {
        setFocusedIndex(prev => Math.min(prev + 1, userAnswer.length - 1));
        inputRefs.current[Math.min(focusedIndex + 1, userAnswer.length - 1)]?.focus();
      } else if (key === 'ArrowLeft') {
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        inputRefs.current[Math.max(focusedIndex - 1, 0)]?.focus();
      }

      // Handle backspace
      if (key === 'Backspace') {
        const newAnswer = [...userAnswer];
        if (userAnswer[focusedIndex] === '') {
          // If current input is empty, move to previous and delete
          if (focusedIndex > 0) {
            newAnswer[focusedIndex - 1] = '';
            setFocusedIndex(prev => prev - 1);
          }
        } else {
          // Clear current input
          newAnswer[focusedIndex] = '';
        }
        setUserAnswer(newAnswer);
      }
    };

    // Add event listener to document
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userAnswer, focusedIndex]);

  // Split the original answer into words to create word gaps
  const originalWords = expectedAnswer.split(/\s+/);
  let letterIndex = 0;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="flex flex-wrap gap-y-4 justify-center items-center space-x-4 outline-none focus:ring-2 focus:ring-blue-500"
    >
      {originalWords.map((word, wordIndex) => {
        const wordLetters = word.split('');
        const wordInputs = wordLetters.map(() => {
          const index = letterIndex;
          letterIndex++;
          return (
            <div
              key={index}
              ref={(el) => inputRefs.current[index] = el}
              tabIndex={0}
              onClick={() => setFocusedIndex(index)}
              className={`w-10 h-12 border rounded flex items-center justify-center 
                ${focusedIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}
                text-xl font-medium uppercase`}
            >
              {userAnswer[index]}
            </div>
          );
        });

        return (
          <div
            key={wordIndex}
            className="flex items-center space-x-2"
          >
            {wordInputs}
          </div>
        );
      })}
    </div>
  );
};

/* const isAllowedLetter = (key: string) => {
  return /^[a-zA-Z]$/i.test(key)
} */