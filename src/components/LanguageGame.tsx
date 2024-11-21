"use client"

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { Timer, Trophy, Lightbulb, Eye, Zap } from 'lucide-react';
import { LetterInput } from './LetterInput';
import { Example } from '@/types';
import JokerButton from './JokerButton';

type GameStatus = 'loading' | 'playing' | 'success' | 'failed';
type QuestionStatus = 'playing' | 'success' | 'failed'

const LanguageGame: React.FC = () => {
  const [examples, setExamples] = useState<Example[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Example | null>(null);

  const [userAnswer, setUserAnswer] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [feedback, setFeedback] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [questionStatus, setQuestionStatus] = useState<QuestionStatus>('playing');
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isShaking, setIsShaking] = useState(false);

  const [jokers, setJokers] = useState({
    hint: 3,
    revealAnswer: 2,
    skipQuestion: 10
  });

  // Fetch game examples when component mounts
  useEffect(() => {
    const fetchGameExamples = async () => {
      try {
        const response = await fetch(`/api/game`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch game examples');
        }

        const data = await response.json();

        if (data.examples && data.examples.length > 0) {
          setExamples(data.examples);
          setCurrentQuestion(data.examples[0]);
          setGameStatus('playing');
        } else {
          throw new Error('No examples found');
        }
      } catch (error) {
        console.error('Error fetching game examples:', error);
        setGameStatus('failed');
      }
    };

    fetchGameExamples();
  }, []);


  /* // Simulated difficulty adjustment
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
  }; */

  const useHintJoker = () => {
    return
    if (jokers.hint > 0 && currentQuestion) {
      // Reveal first few letters of the answer
      const partialAnswer = currentQuestion.dutch.slice(0, Math.ceil(currentQuestion.dutch.length / 2));
      setUserAnswer(partialAnswer);

      setJokers(prev => ({
        ...prev,
        hint: prev.hint - 1
      }));
    }
  };

  const useRevealAnswerJoker = () => {
    return
    if (jokers.revealAnswer > 0 && currentQuestion) {
      setUserAnswer(currentQuestion.dutch);

      setJokers(prev => ({
        ...prev,
        revealAnswer: prev.revealAnswer - 1
      }));

      // Automatically submit the answer
      showAnswer();
    }
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;

    if (!isAnswerSubmitted) {
      const cleanedInputAnswer = userAnswer.toLowerCase().trim();
      const cleanedCorrectAnswer = currentQuestion.dutch.toLowerCase().trim();

      const isCorrect = cleanedInputAnswer === cleanedCorrectAnswer;

      if (isCorrect) {
        showAnswer();
      } else {
        setIsShaking(true);

        // Remove shake animation after it completes
        setTimeout(() => {
          setIsShaking(false);
        }, 500); // Match the animation duration
        // vibrate button
      }
    }

  }

  const showAnswer = () => {
    if (!currentQuestion) return;

    // If answer hasn't been submitted yet, check the answer
    if (!isAnswerSubmitted) {
      const cleanedInputAnswer = userAnswer.toLowerCase().trim();
      const cleanedCorrectAnswer = currentQuestion.dutch.toLowerCase().trim();

      const isCorrect = cleanedInputAnswer === cleanedCorrectAnswer;
      console.log(isCorrect, userAnswer, currentQuestion.dutch)
      if (isCorrect) {
        setQuestionStatus("success");
        setScore((prev) => prev + 10 * (streak + 1));
        setStreak((prev) => prev + 1);
        setFeedback('Correct! Great job! 🎉');
      } else {
        setQuestionStatus("failed");
        setStreak(0);
        setFeedback(`The correct answer was: ${currentQuestion.dutch}`);
      }

      setProgress((prev) => Math.min(prev + 20, 100));
      setIsAnswerSubmitted(true);
      setIsTimerRunning(false);
    }
    // If answer has been submitted, move to next question
    else {
      // Move to next question
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < examples.length) {
        setCurrentQuestionIndex(nextIndex);
        setCurrentQuestion(examples[nextIndex]);

        // Reset states for new question
        setUserAnswer('');
        setFeedback('');
        setQuestionStatus("playing");
        setIsAnswerSubmitted(false);
        setTimeRemaining(60); // Reset timer
        setIsTimerRunning(true);
      } else {
        // All questions answered
        setGameStatus('success');
      }
    }
  };

  // Timer effect
  useEffect(() => {
    if (gameStatus !== 'playing' || !isTimerRunning) return;

    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      showAnswer()
    }
  }, [timeRemaining, gameStatus, isTimerRunning]);

  // Loading state
  if (gameStatus === 'loading') {
    return (
      <Card className="max-w-2xl mx-auto p-6 text-center">
        Loading game...
      </Card>
    );
  }

  // Game over states
  if (gameStatus === 'success' || gameStatus === 'failed') {
    return (
      <Card className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">
            {gameStatus === 'success' ? 'Congratulations! 🎉' : "Time's up! ⏰"}
          </h3>
          <p>Final Score: {score}</p>
          <Button
            onClick={() => {
              // Reset everything
              setGameStatus('loading');
              setScore(0);
              setStreak(0);
              setProgress(0);
              setTimeRemaining(60);
              setCurrentQuestionIndex(0);
              // Trigger a new game fetch
              window.location.reload();
            }}
            className="bg-green-500 hover:bg-green-600"
          >
            Play Again
          </Button>
        </div>
      </Card>
    );
  }

  // Main game render
  return (
    <Card className={`max-w-2xl mx-auto p-6 space-y-6 ${isShaking ? 'animate-shake' : ''}`}>
      <div className="flex space-x-4">
        {/* Hint Joker */}
        <JokerButton
          onClick={useHintJoker}
          count={jokers.hint}
          disabled={isAnswerSubmitted}
          variant={'blue'}
          animationVariant="bubbly"
        >
          <Lightbulb className="w-5 h-5" />
        </JokerButton>

        {/* Reveal Answer Joker */}
        <JokerButton
          onClick={useRevealAnswerJoker}
          count={jokers.revealAnswer}
          disabled={isAnswerSubmitted}
          variant={'purple'}
          animationVariant="bubbly"
        >
          <Eye className="w-5 h-5" />
        </JokerButton>

        {/* Skip Question Joker */}
        <JokerButton
          onClick={checkAnswer}
          disabled={isAnswerSubmitted}
          variant={'yellow'}
          animationVariant="bubbly"
        >
          <Zap className="w-5 h-5" />
        </JokerButton>
      </div>


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

      {currentQuestion && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">
              Level: {currentQuestion.level} - {currentQuestion.theme}
            </div>
            <div className="text-xl font-medium">{currentQuestion.turkish}</div>
          </div>

          <LetterInput
            expectedAnswer={currentQuestion.dutch}
            onAnswerComplete={setUserAnswer}
            questionStatus={questionStatus}
          />

          {feedback && (
            <div
              className={`text-center p-2 rounded ${feedback.startsWith('Correct') ? 'text-green-600' : 'text-red-600'
                }`}
            >
              {feedback}
            </div>
          )}

          <Button
            onClick={showAnswer}
            className="w-full"
          >
            {isAnswerSubmitted ? 'Next Question' : 'Show Answer'}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default LanguageGame;
