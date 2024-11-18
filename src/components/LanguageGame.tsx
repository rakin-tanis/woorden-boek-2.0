"use client"

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { Timer, Trophy } from 'lucide-react';
import { LetterInput } from './LetterInput';

// Types for the game
type Question = {
  turkish: string;
  dutch: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  theme: string;
};

type GameStatus = 'playing' | 'success' | 'failed';

const LanguageGame: React.FC = () => {
  const [currentQuestion] = useState<Question>({
    turkish: 'Merhaba, nasılsın?',
    dutch: 'Hallo, hoe gaat het?',
    level: 'A1',
    theme: 'Greetings',
  });

  const [userAnswer] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [feedback, setFeedback] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  // Simulated difficulty adjustment
  const calculateNextDifficulty = (
    currentLevel: 'A1' | 'A2' | 'B1' | 'B2',
    success: boolean
  ): 'A1' | 'A2' | 'B1' | 'B2' => {
    const levels = ['A1', 'A2', 'B1', 'B2'] as const;
    const currentIndex = levels.indexOf(currentLevel);

    if (success && streak > 3) {
      return levels[Math.min(currentIndex + 1, levels.length - 1)];
    }

    if (!success && streak === 0) {
      return levels[Math.max(currentIndex - 1, 0)];
    }

    return currentLevel;
  };

  const checkAnswer = (inputAnswer: string) => {
    const cleanedInputAnswer = inputAnswer.toLowerCase().trim();
    const cleanedCorrectAnswer = currentQuestion.dutch.toLowerCase().replace(/\s+/g, '');

    const isCorrect = cleanedInputAnswer === cleanedCorrectAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 10 * (streak + 1));
      setStreak((prev) => prev + 1);
      setFeedback('Correct! Great job! 🎉');
    } else {
      setStreak(0);
      setFeedback(`The correct answer was: ${currentQuestion.dutch}`);
    }

    /* const newDifficulty = */ calculateNextDifficulty(currentQuestion.level, isCorrect);
    setProgress((prev) => Math.min(prev + 20, 100));

    // Simulate fetching a new question (replace this with real API logic)
    setTimeout(() => {
      setFeedback('');
    }, 2000);
  };

  useEffect(() => {
    if (timeRemaining > 0 && gameStatus === 'playing') {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeRemaining === 0) {
      setGameStatus('failed');
    }
  }, [timeRemaining, gameStatus]);

  return (
    <Card className="max-w-lg mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-bold">{score}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Timer className="w-5 h-5 text-blue-500" />
          <span className="font-medium">{timeRemaining}s</span>
        </div>
      </div>

      <Progress value={progress} className="w-full" />

      <div className="space-y-4">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-2">
            Level: {currentQuestion.level} - {currentQuestion.theme}
          </div>
          <div className="text-xl font-medium">{currentQuestion.turkish}</div>
        </div>

        <LetterInput
          expectedAnswer={currentQuestion.dutch}
          onAnswerComplete={checkAnswer}
        />

        {feedback && (
          <div
            className={`text-center p-2 rounded ${feedback.startsWith('Correct') ? 'text-green-600' : 'text-red-600'
              }`}
          >
            {feedback}
          </div>
        )}

        <Button onClick={checkAnswer} className="w-full" disabled={!userAnswer.trim()}>
          Check Answer
        </Button>

        {gameStatus !== 'playing' && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">
              {gameStatus === 'success' ? 'Congratulations! 🎉' : "Time's up! ⏰"}
            </h3>
            <p>Final Score: {score}</p>
            <Button
              onClick={() => {
                setGameStatus('playing');
                setTimeRemaining(60);
                setScore(0);
                setStreak(0);
                setProgress(0);
              }}
              className="bg-green-500 hover:bg-green-600"
            >
              Play Again
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LanguageGame;
