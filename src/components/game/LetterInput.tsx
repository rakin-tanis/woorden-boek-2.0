import { isAllowedLetter } from '@/lib/game';
import { AppliedJoker } from '@/types';
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface LetterInputProps {
  expectedAnswer: string;
  questionStatus: 'playing' | 'success' | 'failed';
  appliedJokers: AppliedJoker[]
  onAnswerComplete: (answer: string) => void;
  onEnter: () => void
}

export const LetterInput: React.FC<LetterInputProps> = ({
  expectedAnswer,
  questionStatus,
  appliedJokers,
  onAnswerComplete,
  onEnter,
}) => {
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prepare input fields based on expected answer
  useEffect(() => {
    setUserAnswer(expectedAnswer.split('').map(c => !isAllowedLetter(c) ? c : ' '));
    const firstAllowedInput = inputRefs.current.find((ref, index) => ref !== null && isAllowedLetter(expectedAnswer[index]));

    if (firstAllowedInput) {
      firstAllowedInput.focus();
      setFocusedIndex(inputRefs.current.indexOf(firstAllowedInput));
    }
  }, [expectedAnswer]);

  // Check if answer is complete
  useEffect(() => {
    onAnswerComplete(userAnswer.join(''));
    // }
  }, [userAnswer]);


  const focusNext = useCallback(() => {
    let index = focusedIndex;
    do {
      if (index + 1 > inputRefs.current.length - 1) {
        break;
      }
      index++
    } while (!isAllowedLetter(expectedAnswer[index]))
    setFocusedIndex(index);
    inputRefs.current[index]?.focus();
  }, [expectedAnswer, focusedIndex])

  const focusPrevious = useCallback(() => {
    let index = focusedIndex;
    do {
      if (index - 1 < 0) {
        break;
      }
      index--
    } while (!isAllowedLetter(expectedAnswer[index]))

    setFocusedIndex(index);
    inputRefs.current[index]?.focus();
  }, [expectedAnswer, focusedIndex])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ensure the container is focused
      if (!containerRef.current?.contains(document.activeElement)) return;

      const key = e.key;
      // Allow only single alphabetic characters
      if (key.length === 1 && /^[a-zA-Z]$/i.test(key) && isAllowedLetter(expectedAnswer[focusedIndex])) {
        if (questionStatus !== 'playing') return;
        const newAnswer = [...userAnswer];
        newAnswer[focusedIndex] = key.toLowerCase();
        setUserAnswer(newAnswer);
        focusNext()
      }

      // Handle navigation and deletion
      if (key === 'ArrowRight') {
        focusNext()
      } else if (key === 'ArrowLeft') {
        focusPrevious()
      }

      // Handle backspace
      if (key === 'Backspace') {
        if (questionStatus !== 'playing') return;
        const newAnswer = [...userAnswer];
        if (userAnswer[focusedIndex] === ' ') {
          // If current input is empty, move to previous and delete
          focusPrevious();
        } else if (isAllowedLetter(expectedAnswer[focusedIndex])) {
          // Clear current input
          newAnswer[focusedIndex] = ' ';
        }
        setUserAnswer(newAnswer);
      }

      if (key === "Enter") {
        onEnter()
      }
    };

    // Add event listener to document
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userAnswer, focusedIndex, questionStatus, expectedAnswer, focusNext, focusPrevious, onEnter]);



  const assignInputRef = (el: HTMLDivElement | null, letterIndex: number) => {
    if (el) {
      if (isAllowedLetter(expectedAnswer[letterIndex])) {
        inputRefs.current[letterIndex] = el;
      }
    }
  }

  const originalWords = expectedAnswer.split(/\s+/);
  let letterIndex = 0;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="flex flex-wrap gap-y-6 gap-x-14 justify-start items-start outline-none w-fit"
    >
      {originalWords.map((word, wordIndex) => {
        const wordLetters = word.split('');
        const wordInputs = wordLetters.map(() => {
          const index = letterIndex;
          const letterIndexCopy = letterIndex;
          letterIndex++;
          // console.log(letterIndex, expectedAnswer[letterIndex-1], isAllowedLetter(expectedAnswer[letterIndex-1]))
          return (
            <div
              key={index}
              ref={(el) => assignInputRef(el, letterIndexCopy)}
              tabIndex={letterIndex}
              onClick={() => setFocusedIndex(index)}
              style={{
                ...(questionStatus === 'success' && {
                  animationDelay: `${index * 30}ms`
                }),
                animationFillMode: 'forwards'
              }}
              className={`relative w-10 h-12 border rounded flex items-center justify-center
                transition-all duration-300 ease-in-out
                ${!isAllowedLetter(expectedAnswer[letterIndexCopy]) ? 'border-gray-800' : 'border-gray-600'} 
                ${focusedIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}
                ${appliedJokers?.map(aj => {
                return aj.indexes.includes(letterIndexCopy)
                  ? aj.name === 'revealWrongWords'
                    ? 'bg-purple-600'
                    : aj.name === "revealWrongLetters"
                      ? "bg-yellow-600"
                      : "bg-transparent"
                  : "bg-transparent"
              }).join(' ')}
                ${questionStatus === 'success'
                  ? `text-black animate-turnAround`
                  : questionStatus === 'failed' && userAnswer[letterIndexCopy] !== expectedAnswer[letterIndexCopy].toLowerCase()
                    ? 'bg-red-500 animate-shake'
                    : 'text-gray-950 dark:text-white'}
                text-xl font-medium uppercase`}
            >
              {userAnswer[index]}
            </div>
          );
        });
        if (letterIndex < expectedAnswer.length) {
          letterIndex++
        }
        return (
          <div
            key={wordIndex}
            className="flex items-center justify-start gap-x-2 gap-y-6"
          >
            {wordInputs}
          </div>
        );
      })}


    </div>
  );

};
