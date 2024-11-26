import { Clock, LucideIcon, Shield, ShieldCheck, ShieldHalf } from 'lucide-react';
import { useState, useCallback } from 'react';
import { GameState } from './useGameLogic';
import { getRandomSelections, getWrongLettersIndexes, getWrongWordsIndexes, groupBy } from '@/lib/game';
import { JokerWinAnimation } from '@/components/game/joker/JokerWinAnimation';
import { AnimatePresence } from 'framer-motion';
import { JokerButtonVariantType } from '@/components/game/joker/jokerVariants';

const jokerTypes = ['showWrongLetter', 'showWrongWords', 'answerIfNotWrong', 'time'] as const;
type jokerType = typeof jokerTypes[number]
export interface Joker {
  order: number;
  name: string;
  action: (gameState: GameState, ...params: unknown[]) => void;
  count: number;
  disabled: boolean;
  variant: JokerButtonVariantType;
  animationVariant: "bubbly";
  icon: LucideIcon;
}

type JokersState = {
  [key in jokerType]: Joker;
}

interface NewJoker {
  name: string,
  icon: LucideIcon,
  count: number,
  variant: JokerButtonVariantType
}

export const useJokers = () => {

  const initialState: JokersState = {
    showWrongLetter: {
      order: 1,
      name: 'hint',
      action: (gameState: GameState, ...params: unknown[]) => {
        // Ensure the first param is a function that matches the showAnswer signature
        const showAnswer = params[0] as (message?: string) => void;
        return revealWrongLetters(gameState, showAnswer);
      },
      count: 3,
      disabled: false,
      variant: 'yellow',
      animationVariant: 'bubbly' as "bubbly",
      icon: ShieldCheck
    },
    showWrongWords: {
      order: 2,
      name: 'Oog',
      action: (gameState: GameState, ...params: unknown[]) => {
        // Ensure the first param is a function that matches the showAnswer signature
        const showAnswer = params[0] as (message?: string) => void;
        return revealWrongWords(gameState, showAnswer);
      },
      count: 3,
      disabled: false,
      variant: 'purple',
      animationVariant: 'bubbly' as "bubbly",
      icon: ShieldHalf
    },
    answerIfNotWrong: {
      order: 3,
      name: 'Beschermer',
      action: (gameState: GameState, ...params: unknown[]) => {
        // Ensure the first param is a function that matches the showAnswer signature
        const showAnswer = params[0] as (message?: string) => void;
        return checkAnswer(gameState, showAnswer);
      },
      count: 3,
      disabled: false,
      variant: 'lime',
      animationVariant: 'bubbly' as "bubbly",
      icon: Shield
    },
    time: {
      order: 4,
      name: 'clock',
      action: (_, ...params: unknown[]) => {
        // Ensure the first param is a function that matches the showAnswer signature
        const addExtraTime = params[0] as (seconds: number) => void;
        return addTime(addExtraTime);
      },
      count: 1,
      disabled: false,
      variant: 'blue',
      animationVariant: 'bubbly' as "bubbly",
      icon: Clock
    }
  }

  const [jokers, setJokers] = useState<JokersState>(initialState);
  const [newJokers, setNewJokers] = useState<NewJoker[]>([]);

  const [jokerEffects, setJokerEffects] = useState<{ name: string, indexes: number[] }[]>([])

  const revealWrongLetters = (gameState: GameState, showAnswer: (message?: string) => void) => {
    if (gameState.isAnswerSubmitted || jokers.showWrongLetter.count < 1) return;

    const input = gameState.userAnswer.toLowerCase();
    const question = gameState.currentQuestion?.dutch.toLowerCase();

    const indexes = getWrongLettersIndexes(question!, input)

    if (indexes.length > 0) {
      setJokerEffects((prevEffects) => ([
        ...prevEffects.filter(j => j.name !== 'revealWrongLetters'),
        { name: "revealWrongLetters", indexes }
      ]))
    } else {
      showAnswer()
    }

    setJokers(prev => ({
      ...prev,
      showWrongLetter: {
        ...prev.showWrongLetter,
        count: prev.showWrongLetter.count - 1,
      }
    }));
  };

  const revealWrongWords = (gameState: GameState, showAnswer: (message?: string) => void) => {
    if (gameState.isAnswerSubmitted || jokers.showWrongWords.count < 1) return;

    const input = gameState.userAnswer.toLowerCase();
    const question = gameState.currentQuestion?.dutch.toLowerCase();

    const indexes = getWrongWordsIndexes(question!, input)
      .map(({ start, end }) => {
        const idx = [];
        for (let i = start; i <= end; i++) {
          idx.push(i);
        }
        return idx;
      }).flat()

    if (indexes.length > 0) {
      setJokerEffects((prevEffects) => ([
        ...prevEffects.filter(j => j.name !== 'revealWrongWords'),
        { name: "revealWrongWords", indexes }
      ]))
    } else {
      showAnswer()
    }


    setJokers(prev => ({
      ...prev,
      showWrongWords: {
        ...prev.showWrongWords,
        count: prev.showWrongWords.count - 1,
      }
    }));
  };

  const checkAnswer = useCallback((
    gameState: GameState,
    showAnswer: (message?: string) => void,
  ) => {
    if (gameState.isAnswerSubmitted || jokers.answerIfNotWrong.count < 1) return;

    const cleanedInput = gameState.userAnswer.toLowerCase().trim();
    const cleanedCorrect = gameState.currentQuestion?.dutch.toLowerCase().trim();
    const isCorrect = cleanedInput === cleanedCorrect;

    if (isCorrect) {
      showAnswer();
    } else {
      setJokerEffects((prevEffects) => ([
        ...prevEffects.filter(j => j.name !== 'shaking'),
        { name: "shaking", indexes: [] }
      ]))
      setTimeout(() => {
        setJokerEffects((prevEffects) => ([
          ...prevEffects.filter(j => j.name !== 'shaking'),
        ]))
      }, 500);
    }

    setJokers(prev => ({
      ...prev,
      answerIfNotWrong: {
        ...prev.answerIfNotWrong,
        count: prev.answerIfNotWrong.count - 1,
      }
    }));
  }, []);

  const addTime = useCallback((addExtraTime: (seconds: number) => void) => {
    console.log('add 15 seconds')
    addExtraTime(15)

    setJokers(prev => ({
      ...prev,
      time: {
        ...prev.time,
        count: prev.time.count - 1,
      }
    }));
  }, [])

  const addNewJokers = (userLevel: number, questionLevel: number) => {
    let jokerNumber
    if (questionLevel > userLevel) {
      jokerNumber = 3
    } else if (questionLevel === userLevel) {
      jokerNumber = 2
    } else {
      jokerNumber = 1
    }
    const randomSelectedJokers = groupBy(getRandomSelections([...jokerTypes], jokerNumber, { allowDuplicates: true }))
    setNewJokers(Object.entries(randomSelectedJokers).map(([key, value]) => ({
      name: key,
      icon: initialState[key as jokerType].icon,
      count: value,
      variant: initialState[key as jokerType].variant
    })))

    setTimeout(() => {
      setNewJokers([]); // Assign an empty array after 3 seconds
    }, 2000);

    setJokers(prevJokers => {
      return ({
        ...prevJokers,
        ...Object.entries(randomSelectedJokers)
          .filter(([key]) => jokerTypes.includes(key as jokerType))
          .reduce((acc, [key, value]) => {
            const typedKey = key as jokerType;
            return {
              ...acc,
              [typedKey]: {
                ...prevJokers[typedKey],
                count: prevJokers[typedKey].count + value
              }
            };
          }, prevJokers)
      })
    });
  }

  const resetEffects = () => {
    console.log('resetEffects')
    setJokerEffects([]);
  }

  const reset = useCallback(() => {
    console.log('Resetting jokers')
    setJokers(initialState);
    setJokerEffects([]);
  }, []);

  const newJokersAnimation = () => {
    return (
      <AnimatePresence>
        {newJokers.length > 0 && (
          <JokerWinAnimation
            jokers={newJokers}
          />
        )}
      </AnimatePresence>
    )
  }


  return { jokers, setJokers, addNewJokers, reset, resetEffects, jokerEffects, setJokerEffects, newJokersAnimation };
};
