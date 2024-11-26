// hooks/useJokers.ts
import { Eye, LucideIcon, Shield, Zap } from 'lucide-react';
import { useState, useCallback } from 'react';
import { GameState } from './useGameLogic';
import { getRandomSelections, getWrongLettersIndexes, getWrongWordsIndexes, groupBy } from '@/lib/game';
import { JokerWinAnimation } from '@/components/game/joker/JokerWinAnimation';
import { AnimatePresence } from 'framer-motion';
import { JokerButtonVariantType } from '@/components/game/joker/jokerVariants';

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

interface JokersState {
  hint: Joker;
  eye: Joker;
  defender: Joker;
}

interface NewJoker {
  name: string,
  icon: LucideIcon,
  count: number,
  variant: JokerButtonVariantType
}

type jokerType = 'hint' | 'eye' | 'defender'

export const useJokers = () => {

  const initialState: JokersState = {
    hint: {
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
      icon: Zap
    },
    eye: {
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
      icon: Eye
    },
    defender: {
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
  }

  const [jokers, setJokers] = useState<JokersState>(initialState);
  const [newJokers, setNewJokers] = useState<NewJoker[]>([]);

  const [jokerEffects, setJokerEffects] = useState<{ name: string, indexes: number[] }[]>([])

  const revealWrongLetters = (gameState: GameState, showAnswer: (message?: string) => void) => {
    if (gameState.isAnswerSubmitted || jokers.hint.count < 1) return;

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
      hint: {
        ...prev.hint,
        count: prev.hint.count - 1,
      }
    }));
  };

  const revealWrongWords = (gameState: GameState, showAnswer: (message?: string) => void) => {
    if (gameState.isAnswerSubmitted || jokers.eye.count < 1) return;

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
      eye: {
        ...prev.eye,
        count: prev.eye.count - 1,
      }
    }));
  };

  const checkAnswer = useCallback((
    gameState: GameState,
    showAnswer: (message?: string) => void,
  ) => {
    if (gameState.isAnswerSubmitted || jokers.defender.count < 1) return;

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
      defender: {
        ...prev.defender,
        count: prev.defender.count - 1,
      }
    }));
  }, []);

  const addNewJokers = (userLevel: number, questionLevel: number) => {
    let jokerNumber
    if (questionLevel > userLevel) {
      jokerNumber = 3
    } else if (questionLevel === userLevel) {
      jokerNumber = 2
    } else {
      jokerNumber = 1
    }
    const randomSelectedJokers = groupBy(getRandomSelections(['hint', 'eye', 'defender'], jokerNumber, { allowDuplicates: true }))
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
          .filter(([key]) => ['hint', 'eye', 'defender'].includes(key))
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
