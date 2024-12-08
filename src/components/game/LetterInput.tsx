import { isAllowedLetter } from '@/lib/game';
import { AppliedJoker } from '@/types';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { OnScreenKeyboard } from './OnScreenKeyboard';
import { useIsMobile } from '@/hooks/useIsMobile';
import { JokerButtonVariantsDetail, jokerEffectIds, jokerIds, JOKERS } from './joker/jokerVariants';

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
  const isMobile = useIsMobile();
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
  }, [userAnswer]);

  const handleKeyPress = useCallback((key: string) => {
    if (questionStatus !== 'playing') return;

    // Allow only single alphabetic characters
    if (key.length === 1 && /^[a-zA-Z]$/i.test(key) && isAllowedLetter(expectedAnswer[focusedIndex])) {
      if (appliedJokers.filter(j => j.name === jokerEffectIds.SHOW_CORRECT_LETTERS).map(j => j.indexes).flat().includes(focusedIndex)) {
        focusNext()
        return
      }
      const newAnswer = [...userAnswer];
      newAnswer[focusedIndex] = key.toLowerCase();

      setUserAnswer(newAnswer);
      focusNext()
    }
  }, [expectedAnswer, focusedIndex, questionStatus, userAnswer]);

  const handleBackspace = useCallback(() => {
    if (questionStatus !== 'playing') return;
    const newAnswer = [...userAnswer];
    if (userAnswer[focusedIndex] === ' ') {
      focusPrevious();
    } else if (isAllowedLetter(expectedAnswer[focusedIndex])) {
      newAnswer[focusedIndex] = ' ';
    }
    setUserAnswer(newAnswer);
  }, [expectedAnswer, focusedIndex, questionStatus, userAnswer]);

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
    // hiddenInputRef.current?.focus();
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
      handleKeyPress(key)

      // Handle navigation and deletion
      if (key === 'ArrowRight') {
        focusNext()
      } else if (key === 'ArrowLeft') {
        focusPrevious()
      }

      // Handle backspace
      if (key === 'Backspace') {
        handleBackspace()
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

  useEffect(() => {
    appliedJokers
      .filter(j => j.name === jokerEffectIds.SHOW_CORRECT_LETTERS)
      .map(j => {
        j.indexes.map(index => {
          const newAnswer = [...userAnswer];
          newAnswer[index] = expectedAnswer[index].toLowerCase();
          setUserAnswer(newAnswer)
        })

      })
  }, [appliedJokers])

  const getInputStyle = useCallback((index: number) => {
    const jokerList = appliedJokers.filter(j => j.indexes.includes(index)).map(j => j.name);
    switch (true) {
      case questionStatus === "success":
        return 'text-black animate-turnAroundAndGreen';
      case questionStatus === 'failed' && userAnswer[index] !== expectedAnswer[index].toLowerCase():
        return 'bg-red-500 animate-shake';
      case jokerList.includes(jokerEffectIds.SHOW_CORRECT_LETTERS):
        const joker = JOKERS.find(j => j.id === jokerIds.SHOW_CORRECT_LETTERS);
        return joker?.variant ? JokerButtonVariantsDetail[joker?.variant].bgColor : ''
      case jokerList.includes(jokerEffectIds.SHOW_WRONG_LETTERS_PLACE):
        const joker1 = JOKERS.find(j => j.id === jokerIds.SHOW_WRONG_LETTERS);
        return joker1?.variant ? JokerButtonVariantsDetail[joker1?.variant].bgColor : ''
      case jokerList.includes(jokerEffectIds.SHOW_WRONG_WORDS_PLACE):
        const joker2 = JOKERS.find(j => j.id === jokerIds.SHOW_WRONG_WORDS);
        return joker2?.variant ? JokerButtonVariantsDetail[joker2?.variant].bgColor : ''
      default:
        return ''
    }
  }, [questionStatus, appliedJokers])


  const originalWords = expectedAnswer.split(/\s+/);
  let letterIndex = 0;

  return (
    <>
      <div
        ref={containerRef}
        tabIndex={0}
        className={`flex flex-wrap ${isMobile ? "gap-y-2" : 'gap-y-6'} gap-x-10 justify-start items-start outline-none w-full`}
      >
        {originalWords.map((word, wordIndex) => {
          const wordLetters = word.split('');
          const wordInputs = wordLetters.map(() => {
            const index = letterIndex;
            const letterIndexCopy = letterIndex;
            letterIndex++;
            return (
              <div
                key={index}
                ref={(el) => assignInputRef(el, letterIndexCopy)}
                tabIndex={letterIndex}
                onClick={() => {
                  setFocusedIndex(index);
                }}
                style={{
                  ...(questionStatus === 'success' && {
                    animationDelay: `${index * 30}ms`
                  }),
                  animationFillMode: 'forwards'
                }}
                className={`
                  relative flex-1 min-w-[2rem] h-12 border rounded flex items-center justify-center
                  transition-all duration-300 ease-in-out 
                  text-gray-950 dark:text-white text-xl font-medium uppercase
                  ${!isAllowedLetter(expectedAnswer[letterIndexCopy]) ? 'border-gray-800' : 'border-gray-600'} 
                  ${focusedIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}
                  ${getInputStyle(letterIndex - 1)}          
                  `}
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
              className="flex items-center justify-start gap-x-1 gap-y-6"
            >
              {wordInputs}
            </div>
          );
        })}
      </div>
      {/* Add the on-screen keyboard */}
      {
        isMobile && <OnScreenKeyboard
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onEnter={onEnter}
        />
      }
    </>
  );
}