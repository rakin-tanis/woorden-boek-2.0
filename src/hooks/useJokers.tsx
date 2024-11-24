// hooks/useJokers.ts
import { Joker } from '@/types';
import { Eye, Shield, Zap } from 'lucide-react';
import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { GameState } from './useGameLogic';
import { getWrongLettersIndexes, getWrongWordsIndexes } from '@/lib/game';

interface JokersState {
  hint: Joker;
  eye: Joker;
  defender: Joker;
}

export const useJokers = (setGameState: Dispatch<SetStateAction<GameState>>) => {

  const initialState = {
    hint: {
      order: 1,
      name: 'hint',
      action: (gameState: GameState) => revealWrongLetters(gameState),
      count: 10,
      disabled: false,
      variant: 'yellow' as "yellow" | "purple" | "lime" | "blue",
      animationVariant: 'bubbly' as "bubbly",
      icon: <Zap className="w-6 h-6" />
    },
    eye: {
      order: 2,
      name: 'Oog',
      action: (gameState: GameState) => revealWrongWords(gameState),
      count: 10,
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
      count: 10,
      disabled: false,
      variant: 'lime' as "yellow" | "purple" | "lime" | "blue",
      animationVariant: 'bubbly' as "bubbly",
      icon: <Shield className="w-6 h-6" />
    },
  }

  const [jokers, setJokers] = useState<JokersState>(initialState);

  const revealWrongLetters = (gameState: GameState) => {
    if (gameState.isAnswerSubmitted || jokers.hint.count < 1) return;

    const input = gameState.userAnswer.toLowerCase();
    const question = gameState.currentQuestion?.dutch.toLowerCase();

    const indexes = getWrongLettersIndexes(question!, input)

    setGameState((prevGameState) => ({
      ...prevGameState,
      appliedJokers: [
        ...prevGameState.appliedJokers.filter(j => j.name !== 'revealWrongLetters'),
        { name: "revealWrongLetters", indexes }
      ],
    }))

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

    setGameState((prevGameState) => ({
      ...prevGameState,
      appliedJokers: [
        ...prevGameState.appliedJokers.filter(j => j.name !== 'revealWrongWords'),
        { name: "revealWrongWords", indexes }
      ],
    }))

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
      setGameState((state: GameState) => ({ ...state, isShaking: true }));
      setTimeout(() => {
        setGameState((state: GameState) => ({ ...state, isShaking: false }));
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


  const reset = () => setJokers(prev => ({ ...prev, initialState }))


  return { jokers, setJokers, reset };
};
