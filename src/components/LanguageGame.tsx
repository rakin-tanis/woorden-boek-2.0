"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { Timer, Lightbulb, Eye, Zap, Coins, Award } from 'lucide-react';
import { LetterInput } from './LetterInput';
import { Example } from '@/types';
import JokerButton from './JokerButton';
import { calculateLevel, getMotivationPhrase } from '@/lib/game';
import { useSession } from 'next-auth/react';

type GameStatus = 'loading' | 'playing' | 'finished';
type QuestionStatus = 'playing' | 'success' | 'failed'

const LanguageGame: React.FC = () => {
  const { data: session } = useSession();
  const [examples, setExamples] = useState<Example[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Example | null>(null);
  const [report, setReport] = useState<Record<string, { level: string, result: string }>>({})
  const [userAnswer, setUserAnswer] = useState<string>('');

  const [level, setLevel] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [feedback, setFeedback] = useState<string[]>([]);
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
        const url = session?.user.level || level
          ? `/api/game?level=${session?.user?.level || level}`
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
          setExamples(data.examples);
          setCurrentQuestion(data.examples[0]);
          setGameStatus('playing');
        } else {
          throw new Error('No examples found');
        }
      } catch (error) {
        console.error('Error fetching game examples:', error);
        setGameStatus('finished');
      }
    };

    fetchGameExamples();
  }, []);

  const useHintJoker = () => {
    if (jokers.hint > 0 && currentQuestion) {
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
    if (jokers.revealAnswer > 0 && currentQuestion) {
      // setUserAnswer(currentQuestion.dutch);

      setJokers(prev => ({
        ...prev,
        revealAnswer: prev.revealAnswer - 1
      }));

      // Automatically submit the answer
      // showAnswer();
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

  const showAnswer = useCallback((message?: string) => {
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
        setFeedback(['Correct! Great job! 🎉']);
        setReport(prev => ({ ...prev, [currentQuestion._id!]: { level: currentQuestion.theme, result: "success" } }))
      } else {
        setQuestionStatus("failed");
        setStreak(0);
        setFeedback([message ? message : "", `The correct answer was: ${currentQuestion.dutch}`]);
        setReport(prev => ({ ...prev, [currentQuestion._id!]: { level: currentQuestion.theme, result: "failed" } }))
      }

      setProgress((prev) => Math.min(prev + 10, 100));
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
        setFeedback([]);
        setQuestionStatus("playing");
        setIsAnswerSubmitted(false);
        setTimeRemaining(60); // Reset timer
        setIsTimerRunning(true);
      } else {
        // All questions answered
        const result = calculateLevel(Object.values(report).map(({ level, result }) => ({ themeLevel: Number(level), isCorrect: result === "success" })))
        setLevel(`${result}`)
        console.log("level: ", result)
        updatePlayer(result)
        setGameStatus('finished');
      }
    }
  }, [currentQuestion, currentQuestionIndex, examples, isAnswerSubmitted, report, streak, userAnswer]);


  const updatePlayer = async (level: number) => {

    try {
      const response = await fetch('/api/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level }),
      });

      if (!response.ok) {
        throw new Error('Failed to update player');
      }
      setLevel(`${level}`)
      const result = await response.json();
      console.log('Player updated successfully:', result);
    } catch (error) {
      console.error('Error updating player:', error);
    }
  }

  // Timer effect
  useEffect(() => {
    if (gameStatus !== 'playing' || !isTimerRunning) return;

    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      showAnswer("Time's up! ⏰")
    }
  }, [timeRemaining, gameStatus, isTimerRunning, showAnswer]);

  useEffect(() => {
    setLevel(session?.user?.level || '')
  }, [session])

  // Loading state
  if (gameStatus === 'loading') {
    return (
      <Card className="max-w-2xl mx-auto p-6 text-center">
        Loading game...
      </Card>
    );
  }

  // Game over states "Time's up! ⏰"
  if (gameStatus === 'finished') {
    return (
      <Card className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">
            {'Congratulations! 🎉'}
          </h3>
          <p>Final Score: {score}</p>
          <p>{getMotivationPhrase(Object.values(report).map(({ result }) => (result === "success")).filter(r => r).length)}</p>
          <p>Your level is {level}</p>
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

        {/* Check answer Joker */}
        <JokerButton
          onClick={checkAnswer}
          disabled={isAnswerSubmitted}
          variant={'yellow'}
          animationVariant="bubbly"
        >
          <Zap className="w-5 h-5" />
        </JokerButton>
      </div>


      {/* Level, Score and Time display */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold">Level:</span>
          <span className="text-lg font-bold">{level}</span>
          <Award className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="flex items-center space-x-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="font-bold">{score}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">{timeRemaining}s</span>
          <Timer className="w-5 h-5 text-blue-500" />
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
            onEnter={showAnswer}
          />

          {feedback && feedback.length > 0 && (
            feedback.map(fb => (
              <div
                className={`text-center px-2 rounded ${feedback.some(fb => fb.startsWith('Correct')) ? 'text-green-600' : 'text-red-600'
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
            {isAnswerSubmitted ? 'Next Question' : 'Show Answer'}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default LanguageGame;
