// hooks/useJokers.ts
import { Joker } from '@/types';
import { Eye, Shield, Zap } from 'lucide-react';
import { useState, useCallback } from 'react';
import { GameState } from './useGameLogic';
import { getRandomSelections, getWrongLettersIndexes, getWrongWordsIndexes, groupBy } from '@/lib/game';

interface JokersState {
  hint: Joker;
  eye: Joker;
  defender: Joker;
}

export const useJokers = () => {

  const initialState = {
    hint: {
      order: 1,
      name: 'hint',
      action: (gameState: GameState) => revealWrongLetters(gameState),
      count: 3,
      disabled: false,
      variant: 'yellow' as "yellow" | "purple" | "lime" | "blue",
      animationVariant: 'bubbly' as "bubbly",
      icon: <Zap className="w-6 h-6" />
    },
    eye: {
      order: 2,
      name: 'Oog',
      action: (gameState: GameState) => revealWrongWords(gameState),
      count: 3,
      disabled: false,
      variant: 'purple' as "yellow" | "purple" | "lime" | "blue",
      animationVariant: 'bubbly' as "bubbly",
      icon: <Eye className="w-6 h-6" />
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
      variant: 'lime' as "yellow" | "purple" | "lime" | "blue",
      animationVariant: 'bubbly' as "bubbly",
      icon: <Shield className="w-6 h-6" />
    },
  }

  const [jokers, setJokers] = useState<JokersState>(initialState);

  const [jokerEffects, setJokerEffects] = useState<{ name: string, indexes: number[] }[]>([])

  const revealWrongLetters = (gameState: GameState) => {
    if (gameState.isAnswerSubmitted || jokers.hint.count < 1) return;

    const input = gameState.userAnswer.toLowerCase();
    const question = gameState.currentQuestion?.dutch.toLowerCase();

    const indexes = getWrongLettersIndexes(question!, input)

    setJokerEffects((prevEffects) => ([
      ...prevEffects.filter(j => j.name !== 'revealWrongLetters'),
      { name: "revealWrongLetters", indexes }
    ]))

    setJokers(prev => ({
      ...prev,
      hint: {
        ...prev.hint,
        count: prev.hint.count - 1,
      }
    }));
  };

  const revealWrongWords = (gameState: GameState) => {
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

    setJokerEffects((prevEffects) => ([
      ...prevEffects.filter(j => j.name !== 'revealWrongWords'),
      { name: "revealWrongWords", indexes }
    ]))

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
    setJokers(prevJokers => {
      const randomSelectedJokers = groupBy(getRandomSelections(['hint', 'eye', 'defender'], jokerNumber))
      return ({
        ...prevJokers,
        ...Object.entries(randomSelectedJokers)
          .filter(([key]) => ['hint', 'eye', 'defender'].includes(key))
          .reduce((acc, [key, value]) => {
            const typedKey = key as 'hint' | 'eye' | 'defender';
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


  return { jokers, setJokers, addNewJokers, reset, resetEffects, jokerEffects, setJokerEffects };
};
