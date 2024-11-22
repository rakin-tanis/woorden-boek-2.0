"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { Timer, Eye, Zap, Coins, Award, Shield } from 'lucide-react';
import { LetterInput } from './LetterInput';
import { Example } from '@/types';
import JokerButton from './JokerButton';
import { calculateLevel, getMotivationPhrase } from '@/lib/game';
import { useSession } from 'next-auth/react';

interface GameState {
  examples: Example[],
  userAnswer: string;
  currentQuestionIndex: number;
  currentQuestion: Example | null;
  score: number;
  streak: number;
  timeRemaining: number;
  gameStatus: 'loading' | 'playing' | 'finished';
  level: string;
  report: Record<string, { level: string, result: string }>;
  feedback: string[];
  progress: number;
  isAnswerSubmitted: boolean;
  questionStatus: 'playing' | 'success' | 'failed'
  isTimerRunning: boolean;
  isShaking: boolean;
}

const LanguageGame: React.FC = () => {
  const { data: session, update: updateSession, status: sessionStatus } = useSession();
  // Consolidate state management
  const [gameState, setGameState] = useState<GameState>({
    examples: [],
    userAnswer: '',
    currentQuestionIndex: 0,
    currentQuestion: null,
    score: 0,
    streak: 0,
    timeRemaining: 60,
    gameStatus: 'loading',
    level: session?.user?.level || '',
    report: {},
    feedback: [],
    progress: 0,
    isAnswerSubmitted: false,
    questionStatus: 'playing',
    isTimerRunning: true,
    isShaking: false,
  });


  const [jokers, setJokers] = useState({
    hint: 5,
    revealAnswer: 7,
    skipQuestion: 20
  });

  // Fetch game examples
  const fetchGameExamples = useCallback(async () => {
    try {

      // Only fetch if session is loaded
      if (sessionStatus === 'loading') return;

      const url = gameState.level
        ? `/api/game?level=${gameState.level}`
        : `/api/game`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch game examples');
      }

      const data = await response.json();

      if (data.examples && data.examples.length > 0) {
        setGameState(state => ({
          ...state,
          examples: data.examples,
          currentQuestion: data.examples[0],
          gameStatus: 'playing'
        }));
      } else {
        throw new Error('No examples found');
      }
    } catch (error) {
      console.error('Error fetching game examples:', error);
      setGameState(state => ({ ...state, gameStatus: 'finished' }));
    }
  }, [gameState.level, session, sessionStatus])

  // Fetch player details function
  const fetchPlayerDetails = useCallback(async () => {
    try {
      // Only fetch if session is authenticated
      if (sessionStatus !== 'authenticated') return;

      const response = await fetch('/api/player', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch player details');
      }

      const data = await response.json();
      // Update game state with player level
      setGameState(prevState => ({
        ...prevState,
        level: data.player.level
      }));
    } catch (error) {
      console.error('Error fetching player details:', error);
    }
  }, [sessionStatus, session, updateSession]);

  // Initial fetch effect
  useEffect(() => {
    // Only fetch when session is not loading
    if (sessionStatus != 'loading') {
      fetchGameExamples();
    }
  }, [sessionStatus, fetchGameExamples]);


  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      fetchPlayerDetails();
    }
  }, [sessionStatus, fetchPlayerDetails]);

  // Main game logic methods
  const updatePlayer = useCallback(async (newLevel: string) => {
    console.log("updatePlayer: ", newLevel)
    try {
      await fetch('/api/player', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level: newLevel }),
      });

    } catch (error) {
      console.error('Error updating player level:', error);
    }
  }, []);

  const useHintJoker = () => {
    if (jokers.hint > 0 && gameState.currentQuestion) {
      // Reveal first few letters of the answer
      // const partialAnswer = currentQuestion.dutch.slice(0, Math.ceil(currentQuestion.dutch.length / 2));
      // setUserAnswer(partialAnswer);

      setJokers(prev => ({
        ...prev,
        hint: prev.hint - 1
      }));
    }
  };

  const useRevealAnswerJoker = () => {
    if (jokers.revealAnswer > 0 && gameState.currentQuestion) {
      // setUserAnswer(currentQuestion.dutch);

      setJokers(prev => ({
        ...prev,
        revealAnswer: prev.revealAnswer - 1
      }));

      // Automatically submit the answer
      // showAnswer();
    }
  };

  const isAnswerCorrect = (userAnswer: string, correctAnswer: string) => {
    const cleanedInput = userAnswer.toLowerCase().trim();
    const cleanedCorrect = correctAnswer.toLowerCase().trim();
    console.log(cleanedInput, cleanedCorrect)

    return cleanedInput === cleanedCorrect;
  };

  const checkAnswer = () => {
    if (!gameState.currentQuestion) return;

    if (!gameState.isAnswerSubmitted) {
      const cleanedInputAnswer = gameState.userAnswer.toLowerCase().trim();
      const cleanedCorrectAnswer = gameState.currentQuestion.dutch.toLowerCase().trim();

      const isCorrect = cleanedInputAnswer === cleanedCorrectAnswer;

      if (isCorrect) {
        showAnswer();
      } else {
        setGameState(state => ({ ...state, isShaking: true }))

        // Remove shake animation after it completes
        setTimeout(() => {
          setGameState(state => ({ ...state, isShaking: false }))
        }, 500); // Match the animation duration
        // vibrate button
      }
    }

  }

  const showAnswer = useCallback((message?: string) => {
    setGameState(prevState => {
      if (!gameState.currentQuestion) return prevState;

      if (!prevState.isAnswerSubmitted) {
        const isCorrect = isAnswerCorrect(gameState.userAnswer, gameState.currentQuestion.dutch);
        if (isCorrect) {
          return {
            ...prevState,
            questionStatus: "success",
            score: (prevState.score + 10) * (prevState.streak + 1),
            streak: prevState.streak + 1,
            report: {
              ...prevState.report,
              [gameState.currentQuestion!._id!]: {
                level: gameState.currentQuestion!.theme, result: "success"

              }
            },
            feedback: ['Correct! Great job! 🎉'],
            progress: Math.min(prevState.progress + 10, 100),
            isAnswerSubmitted: true,
            isTimerRunning: false,
          }
        } else {
          return {
            ...prevState,
            questionStatus: "failed",
            streak: 0,
            report: {
              ...prevState.report,
              [gameState.currentQuestion!._id!]: {
                level: gameState.currentQuestion!.theme, result: "failed"

              }
            },
            feedback: [
              message ? message : "Incorrect",
              "The correct answer was:",
              `${gameState.currentQuestion!.dutch}`],
            progress: Math.min(prevState.progress + 10, 100),
            isAnswerSubmitted: true,
            isTimerRunning: false,
          }
        }
      } else {
        const nextIndex = gameState.currentQuestionIndex + 1;
        if (nextIndex < gameState.examples.length) {
          return {
            ...prevState,
            questionStatus: 'playing',
            currentQuestionIndex: nextIndex,
            currentQuestion: gameState.examples[nextIndex],
            userAnswer: '',
            timeRemaining: 60,
            feedback: [],
            isAnswerSubmitted: false,
            isTimerRunning: true,
          };

          // Reset states for new question
        } else {
          // All questions answered
          const result = calculateLevel(Object.values(gameState.report).map(({ level, result }) => ({ themeLevel: Number(level), isCorrect: result === "success" })))
          console.log("level: ", result)

          return {
            ...prevState,
            level: `${result}`,
            gameStatus: 'finished'
          }
        }
      }
    })

    // Move session update outside of setGameState
    if (gameState.currentQuestionIndex === gameState.examples.length) {
      const result = calculateLevel(Object.values(gameState.report).map(({ level, result }) => ({ themeLevel: Number(level), isCorrect: result === "success" })))

      updatePlayer(`${result}`);
    }
  }, [gameState.currentQuestion, gameState.currentQuestionIndex, gameState.examples, gameState.report, gameState.userAnswer, updatePlayer]);



  // Timer effect
  useEffect(() => {
    if (gameState.gameStatus !== 'playing' || !gameState.isTimerRunning) return;

    if (gameState.timeRemaining > 0) {
      const timer = setInterval(() => {
        setGameState((prev) => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
      }, 1000);

      return () => clearInterval(timer);
    } else {
      showAnswer("Time's up! ⏰")
    }
  }, [gameState.timeRemaining, gameState.gameStatus, gameState.isTimerRunning, showAnswer]);


  const renderLoadingState = () => (
    <Card className="max-w-2xl mx-auto p-6 text-center text-gray-950 dark:text-white">
      Loading game...
    </Card>
  );


  const renderFinishedState = () => (
    <Card className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4 text-gray-950 dark:text-white">
        <h3 className="text-xl font-bold">
          {'Gefeliciteerd! 🎉'}
        </h3>
        <p>Eindscore: {gameState.score}</p>
        <p>{getMotivationPhrase(Object.values(gameState.report).map(({ result }) => (result === "success")).filter(r => r).length)}</p>
        <p>Je nieuwe niveau is {gameState.level}</p>
        <Button
          onClick={() => {
            // Reset everything
            setGameState(state => ({
              ...state,
              currentQuestionIndex: 0,
              score: 0,
              streak: 0,
              timeRemaining: 60,
              gameStatus: 'loading',
              progress: 0
            }));
            // Trigger a new game fetch
            window.location.reload();
          }}
          className="bg-green-500 hover:bg-green-600"
        >
          Play Again
        </Button>
      </div>
    </Card>
  )

  const renderGamePlay = () => (
    <Card className={`max-w-2xl mx-auto p-6 space-y-6 bg-white dark:bg-gray-950 ${gameState.isShaking ? 'animate-shake' : ''}`}>
      <div className="flex space-x-4">
        {/* Hint Joker */}
        <JokerButton
          onClick={useHintJoker}
          count={jokers.hint}
          disabled={gameState.isAnswerSubmitted}
          variant={'yellow'}
          animationVariant="bubbly"
        >
          <Zap className="w-5 h-5" />
        </JokerButton>

        {/* Reveal Answer Joker */}
        <JokerButton
          onClick={useRevealAnswerJoker}
          count={jokers.revealAnswer}
          disabled={gameState.isAnswerSubmitted}
          variant={'purple'}
          animationVariant="bubbly"
        >
          <Eye className="w-5 h-5" />
        </JokerButton>

        {/* Check answer Joker */}
        <JokerButton
          onClick={checkAnswer}
          count={jokers.skipQuestion}
          disabled={gameState.isAnswerSubmitted}
          variant={'lime'}
          animationVariant="bubbly"
        >
          <Shield className="w-5 h-5" />
        </JokerButton>
      </div>


      {/* Level, Score and Time display */}
      <div className="flex justify-between items-center text-gray-950 dark:text-white">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold">Level:</span>
          <span className="text-lg font-bold">{gameState.level}</span>
          <Award className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="flex items-center space-x-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="font-bold">{gameState.score}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">{gameState.timeRemaining}s</span>
          <Timer className="w-5 h-5 text-blue-500" />
        </div>
      </div>

      <Progress value={gameState.progress} className="w-full" />

      {gameState.currentQuestion && (
        <div className="space-y-4">
          <div className="text-center text-gray-950 dark:text-white">
            <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">
              Level: {gameState.currentQuestion.level} - {gameState.currentQuestion.theme}
            </div>
            <div className="text-xl font-medium">{gameState.currentQuestion.turkish}</div>
          </div>

          <LetterInput
            expectedAnswer={gameState.currentQuestion.dutch}
            onAnswerComplete={(answer) => setGameState(state => ({ ...state, userAnswer: answer }))}
            questionStatus={gameState.questionStatus}
            onEnter={showAnswer}
          />

          {gameState.feedback && gameState.feedback.length > 0 && (
            gameState.feedback.map((fb, index) => (
              <div
                key={index}
                className={`text-center px-2 rounded 
                  ${gameState.feedback.some(fb => fb.startsWith('Correct'))
                    ? 'text-green-600'
                    : 'text-red-600'
                  }`}
              >
                {fb}
              </div>
            ))

          )}

          <Button
            onClick={() => showAnswer()}
            className="w-full"
          >
            {gameState.isAnswerSubmitted ? 'Next Question' : 'Show Answer'}
          </Button>
        </div>
      )}
    </Card>
  );

  // Main render method
  const renderGame = () => {
    switch (gameState.gameStatus) {
      case 'loading':
        return renderLoadingState();
      case 'finished':
        return renderFinishedState();
      case 'playing':
      default:
        return renderGamePlay();
    }
  };

  // Conditional rendering for loading session
  if (sessionStatus === 'loading') {
    return renderLoadingState();
  }

  return (
    <div>
      {renderGame()}
    </div>
  );

};

export default LanguageGame;
