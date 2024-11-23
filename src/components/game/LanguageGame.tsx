"use client"

import React, { useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import JokerButton from './JokerButton';
import { useSession } from 'next-auth/react';
import { GameLoading } from './GameLoading';
import { GameFinished } from './GameFinished';
import { GameHeader } from './GameHeader';
import { GameQuestion } from './GameQuestion';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useGameExamplesFetch } from '@/hooks/useGameExamplesFetch';
import { usePlayerFetch } from '@/hooks/usePlayerFetch';
import { useJokers } from '@/hooks/useJokers';
import { Joker } from '@/types';

const LanguageGame: React.FC = () => {
  const { status: sessionStatus } = useSession();
  const { gameState, setGameState, showAnswer, nextQuestion, isAnswerCorrect } = useGameLogic();
  const { fetchGameExamples: fetchExamples } = useGameExamplesFetch();
  const { fetchPlayerDetails: fetchPlayer, updatePlayerDetails: updatePlayer } = usePlayerFetch();

  const { jokers } = useJokers(gameState, setGameState, showAnswer, isAnswerCorrect);

  // Fetch game examples
  const fetchGameExamples = useCallback(async (level?: string) => {
    try {
      // Only fetch if session is loaded
      if (sessionStatus === 'loading'
        || gameState.gameStatus === 'finished'
        || gameState.gameStatus === 'playing') return;

      const examples = await fetchExamples(level);

      if (examples && examples.length > 0) {
        setGameState(state => ({
          ...state,
          examples: examples,
          currentQuestion: examples[0],
          gameStatus: 'playing'
        }));
      } else {
        throw new Error('No examples found');
      }
    } catch (error) {
      console.error('Error fetching game examples:', error);
      setGameState(state => ({ ...state, gameStatus: 'finished' }));
    }
  }, [gameState.gameStatus, sessionStatus, fetchExamples, setGameState])

  // Fetch player details function
  const fetchPlayerDetails = useCallback(async () => {
    try {
      // Only fetch if session is authenticated
      if (sessionStatus !== 'authenticated') return;

      const playerDetails = await fetchPlayer();

      if (playerDetails) {
        // Update game state with player level
        setGameState(prevState => ({
          ...prevState,
          level: playerDetails.level.toString() || '',
          score: playerDetails.score || 0
        }));
        console.log(gameState)
        console.log(playerDetails.level.toString(), playerDetails.score)
        return playerDetails.level;
      }
    } catch (error) {
      console.error('Error fetching player details:', error);
    }
  }, [sessionStatus, fetchPlayer, setGameState]);

  // Initial fetch effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, fetch player details if authenticated
        const level = await fetchPlayerDetails();

        // Then, fetch game examples
        await fetchGameExamples(level?.toString());
      } catch (error) {
        console.error('Error fetching initial game data:', error);
        // Optionally set game status to finished in case of error
        setGameState(state => ({ ...state, gameStatus: 'finished' }));
      }
    };

    fetchData();
  }, [sessionStatus, fetchPlayerDetails, fetchGameExamples]);

  // Update player details when the game is finished
  useEffect(() => {
    const updatePlayerDetails = async () => {
      if (gameState.gameStatus === 'finished') {
        await updatePlayer({
          level: Number(gameState.level),
          score: gameState.score
        });
      }
    };

    updatePlayerDetails();
  }, [gameState.gameStatus, gameState.level, updatePlayer]);


  // Handler for play again
  const handlePlayAgain = () => {
    setGameState(prevState => ({
      ...prevState,
      examples: [],
      userAnswer: '',
      currentQuestionIndex: 0,
      currentQuestion: null,
      streak: 0,
      timeRemaining: 60,
      gameStatus: 'loading',
      report: [],
      feedback: [],
      progress: 0,
      isAnswerSubmitted: false,
      questionStatus: 'playing',
      isTimerRunning: true,
      isShaking: false,
    }));

    fetchGameExamples(gameState.level);
  };


  // Loading state
  if (sessionStatus === 'loading' || gameState.gameStatus === 'loading') {
    return <GameLoading />;
  }

  // Finished state
  if (gameState.gameStatus === 'finished') {
    return (
      <GameFinished
        score={gameState.score}
        level={gameState.level}
        report={gameState.report}
        onPlayAgain={handlePlayAgain}
      />
    );
  }


  return (
    <Card className={`max-w-2xl mx-auto p-6 space-y-6 bg-white dark:bg-gray-950 ${gameState.isShaking ? 'animate-shake' : ''}`}>

      {/* Jokers */}
      <div className="flex space-x-4 h-12">
        {Object.values(jokers)
          .sort((a: Joker, b: Joker) => a.order - b.order)
          .map((joker: Joker) => (
            <JokerButton
              key={joker.name}
              action={joker.action}
              count={joker.count ?? 0}
              disabled={joker.disabled}
              variant={joker.variant}
              animationVariant={joker.animationVariant}
            >
              {joker.icon}
            </JokerButton>
          ))}
      </div>


      {/* Level, Score and Time display */}
      <GameHeader
        level={gameState.level.toString()}
        score={gameState.score}
        timeRemaining={gameState.timeRemaining}
        progress={gameState.progress}
      />

      {/* Current Question */}
      {gameState.currentQuestion && (
        <GameQuestion
          currentQuestion={gameState.currentQuestion}
          questionStatus={gameState.questionStatus}
          feedback={gameState.feedback}
          onAnswerComplete={(answer) =>
            setGameState(state => ({ ...state, userAnswer: answer }))
          }
          onShowAnswer={() => showAnswer()}
          onNextQuestion={() => nextQuestion()}
        />
      )}

    </Card>
  );

};

export default LanguageGame;
