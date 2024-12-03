// hooks/gameHooks.ts
import { useState, useCallback, useEffect } from 'react';
import { Example } from '@/types';
import { calculateLevel } from '@/lib/game';

type ExcludeField = {
  [key: string]: string | number | boolean | null | undefined
}

export interface GameState {
  mode: 'competition' | 'training'
  trainingSource?: string,
  trainingLevel?: string,
  trainingThemes?: string[],
  examples: Example[],
  userAnswer: string;
  currentQuestionIndex: number;
  currentQuestion: Example | null;
  score: number;
  streak: number;
  timeRemaining: number;
  gameStatus: 'loading' | 'playing' | 'finished';
  level: string;
  oldLevel: string;
  report: { example: Example, result: string }[];
  feedback: string[];
  progress: number;
  isAnswerSubmitted: boolean;
  questionStatus: 'playing' | 'success' | 'failed'
  isTimerRunning: boolean;

}

const initialState = {
  mode: 'training',
  trainingSource: 'blue',
  trainingLevel: '1',
  trainingThemes: ['1'],
  examples: [] as Example[],
  userAnswer: '',
  currentQuestionIndex: 0,
  currentQuestion: null as Example | null,
  score: 0,
  streak: 0,
  timeRemaining: 60,
  gameStatus: 'loading' as 'loading' | 'playing' | 'finished',
  level: '',
  oldLevel: '',
  report: [] as { example: Example, result: string }[],
  feedback: [] as string[],
  progress: 0,
  isAnswerSubmitted: false,
  questionStatus: 'playing' as 'playing' | 'success' | 'failed',
  isTimerRunning: false,
}

export interface useGameLogicProps {
  mode: 'training' | 'competition';
  trainingSource?: string;
  trainingLevel?: string;
  trainingThemes?: string[];
}

export const useGameLogic = ({ mode, trainingSource, trainingLevel, trainingThemes }: useGameLogicProps) => {
  const [gameState, setGameState] = useState<GameState>({ ...initialState, mode, trainingSource, trainingLevel, trainingThemes });

  const isAnswerCorrect = useCallback(() => {
    const cleanedInput = gameState.userAnswer.toLowerCase().trim();
    const cleanedCorrect = gameState.currentQuestion?.dutch.toLowerCase().trim();
    return cleanedInput === cleanedCorrect;
  }, [gameState.userAnswer, gameState.currentQuestion]);

  const showAnswer = useCallback((message?: string) => {
    setGameState(prevState => {
      if (!gameState.currentQuestion) return prevState;

      const isCorrect = isAnswerCorrect();
      const feedbackMessage = isCorrect ?
        ['Correct! Great job! 🎉'] :
        [message || "Incorrect", `The correct answer was: ${gameState.currentQuestion.dutch}`];

      return {
        ...prevState,
        questionStatus: isCorrect ? "success" : "failed",
        score: isCorrect ? prevState.score + (10 * (prevState.streak + 0.2)) : prevState.score,
        streak: isCorrect ? prevState.streak + 0.2 : 0,
        report: [
          ...prevState.report,
          { example: gameState.currentQuestion, result: isCorrect ? "success" : "failed" }
        ],
        feedback: feedbackMessage,
        progress: Math.min(prevState.progress + 10, 100),
        isAnswerSubmitted: true,
        isTimerRunning: false,
      };
    });
  }, [gameState, isAnswerCorrect]);

  const nextQuestion = useCallback(() => {
    setGameState(prevState => {
      const nextIndex = prevState.currentQuestionIndex + 1;
      const isFinished = nextIndex === prevState.examples.length;
      return {
        ...prevState,
        questionStatus: isFinished ? prevState.questionStatus : 'playing',
        currentQuestionIndex: nextIndex,
        currentQuestion: isFinished ? prevState.currentQuestion : prevState.examples[nextIndex],
        userAnswer: '',
        timeRemaining: 60,
        feedback: [],
        isAnswerSubmitted: false,
        isTimerRunning: !isFinished,
        gameStatus: isFinished ? 'finished' : prevState.gameStatus,
        level: isFinished
          ? mode === 'competition'
            ? `${calculateLevel(prevState.report.map(r => ({
              themeLevel: Number(r.example.theme),
              isCorrect: r.result === "success"
            })), Number(prevState.level))}`
            : prevState.level
          : prevState.level,
        oldLevel: prevState.level,
      };
    })
  }, [])

  const reset = useCallback((exclude?: ExcludeField) => {
    setGameState({ ...initialState, mode, trainingSource, trainingLevel, trainingThemes, ...exclude })
  }, [])

  const addExtraTime = useCallback((seconds: number) => {
    setGameState(prevState => {
      return {
        ...prevState,
        timeRemaining: prevState.timeRemaining + seconds
      }
    })
  }, [])

  // Timer effect
  useEffect(() => {
    if (gameState.gameStatus !== 'playing' || !gameState.isTimerRunning) return;

    let timer: NodeJS.Timeout;
    if (gameState.timeRemaining > 0) {
      timer = setInterval(() => {
        setGameState((prev) => {
          return { ...prev, timeRemaining: prev.timeRemaining - 1 }
        });
      }, 1000);
    } else {
      showAnswer("Time's up! ⏰");
    }

    return () => clearInterval(timer);
  }, [gameState.timeRemaining, gameState.gameStatus, gameState.isTimerRunning, showAnswer]);

  return {
    gameState,
    setGameState,
    showAnswer,
    nextQuestion,
    reset,
    addExtraTime
  };
};