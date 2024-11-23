// hooks/useJokers.ts
import { Joker } from '@/types';
import { Eye, Shield, Zap } from 'lucide-react';
import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { GameState } from './useGameLogic';

interface JokersState {
  hint: Joker;
  eye: Joker;
  defender: Joker;
}

export const useJokers = (
  gameState: GameState,
  setGameState: Dispatch<SetStateAction<GameState>>,
  showAnswer: (message?: string) => void,
  isAnswerCorrect: () => boolean
) => {

  const [jokers, setJokers] = useState<JokersState>({
    hint: {
      order: 1,
      name: 'hint',
      action: () => hintJoker(),
      count: 3,
      disabled: gameState.isAnswerSubmitted,
      variant: 'yellow',
      animationVariant: 'bubbly',
      icon: <Zap className="w-6 h-6" />
    },
    eye: {
      order: 2,
      name: 'Oog',
      action: () => revealAnswerJoker(),
      count: 3,
      disabled: gameState.isAnswerSubmitted,
      variant: 'purple',
      animationVariant: 'bubbly',
      icon: <Eye className="w-6 h-6" />
    },
    defender: {
      order: 3,
      name: 'Beschermer',
      action: () => checkAnswer(),
      count: 10,
      disabled: gameState.isAnswerSubmitted,
      variant: 'lime',
      animationVariant: 'bubbly',
      icon: <Shield className="w-6 h-6" />
    },
  });

  const hintJoker = () => {
    if (gameState.isAnswerSubmitted || jokers.hint.count < 1) return;
    setJokers(prev => ({
      ...prev,
      hint: {
        ...prev.hint,
        count: prev.hint.count - 1,
      }
    }));
  };

  const revealAnswerJoker = () => {
    if (gameState.isAnswerSubmitted || jokers.eye.count < 1) return;
    setJokers(prev => ({
      ...prev,
      eye: {
        ...prev.eye,
        count: prev.eye.count - 1,
      }
    }));
  };

  const checkAnswer = useCallback(() => {
    if (gameState.isAnswerSubmitted || jokers.defender.count < 1) return;

    const isCorrect = isAnswerCorrect();

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
  }, [gameState, isAnswerCorrect]);

  return { jokers, setJokers };
};