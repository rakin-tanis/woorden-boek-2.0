"use client"

import React, { useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import JokerButton from './joker/JokerButton';
import { useSession } from 'next-auth/react';
import { GameLoading } from './GameLoading';
import { GameFinished } from './GameFinished';
import { GameHeader } from './GameHeader';
import { GameQuestion } from './GameQuestion';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useGameExamplesFetch } from '@/hooks/useGameExamplesFetch';
import { usePlayerFetch } from '@/hooks/usePlayerFetch';
import { Joker, useJokers } from '@/hooks/useJokers';


const LanguageGame: React.FC = () => {
  const { status: sessionStatus } = useSession();
  const { gameState, setGameState, showAnswer, nextQuestion, reset } = useGameLogic();
  const { fetchGameExamples: fetchExamples } = useGameExamplesFetch();
  const { fetchPlayerDetails: fetchPlayer, updatePlayerDetails: updatePlayer } = usePlayerFetch();

  const { jokers, addNewJokers, reset: resetJokers, jokerEffects, resetEffects, newJokersAnimation } = useJokers();

  // Fetch game examples
  const fetchGameExamples = useCallback(async (level?: string) => {
    try {
      // Only fetch if session is loaded
      if (sessionStatus === 'loading') {
        console.log('session loading, cannot fetch examples');
        return;
      }
      if (gameState.gameStatus === 'finished' || gameState.gameStatus === 'playing') {
        console.log(`gameStatus is ${gameState.gameStatus}, cannot fetch examples`);
        return;
      }

      const examples = await fetchExamples(level);

      if (examples && examples.length > 0) {
        setGameState(state => ({
          ...state,
          examples: examples,
          currentQuestion: examples[0],
          gameStatus: 'playing',
          isTimerRunning: true
        }));
      } else {
        console.log('No examples found');
        setGameState(state => ({
          ...state,
          gameStatus: 'finished'
        }));
      }
    } catch (error) {
      console.error('Error fetching game examples:', error);
      setGameState(state => ({ ...state, gameStatus: 'finished' }));
    }
  }, [sessionStatus, fetchExamples])

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
          level: playerDetails.level?.toString() || '1',
          score: playerDetails.score || 0
        }));
        return playerDetails.level;
      }
    } catch (error) {
      console.error('Error fetching player details:', error);
    }
  }, [sessionStatus]);

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
  }, [sessionStatus]);

  // Update player details when the game is finished
  useEffect(() => {
    let isMounted = true;
    const updatePlayerDetails = async () => {
      if (gameState.gameStatus === 'finished' && isMounted) {
        try {
          await updatePlayer({
            level: Number(gameState.level),
            score: gameState.score
          });
        } catch (error) {
          console.error('Error updating player details:', error);
        }
      };
    }

    updatePlayerDetails();
    return () => {
      isMounted = false;
    };
  }, [gameState.gameStatus, gameState.level, gameState.score]);

  useEffect(() => {
    if (gameState.questionStatus === "success") {
      const userLevel = Number(gameState.level)
      const questionLevel = Number(gameState.currentQuestion?.level)
      addNewJokers(userLevel, questionLevel)
    }
  }, [gameState.questionStatus])

  const goToNextQuestion = () => {
    resetEffects()
    nextQuestion()
  }

  // Handler for play again
  const handlePlayAgain = useCallback(async () => {
    // Reset game state
    reset({ level: gameState.level, score: gameState.score })

    // Reset jokers
    resetJokers();

    try {
      await fetchGameExamples(gameState.level);
    } catch (error) {
      console.error('Error fetching game examples:', error);
      setGameState(state => ({ ...state, gameStatus: 'finished' }));
    }
  }, [fetchGameExamples, gameState.level, gameState.score, reset, resetJokers, setGameState]);

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
    <Card
      className={`
          relative
          w-full
          max-w-2xl 
          mx-auto 
          p-6 
          space-y-6 
          bg-white 
          dark:bg-gray-950 
          ${jokerEffects.filter(j => j.name === 'shaking')[0] ? 'animate-shake' : ''}
          `}
    >

      {/* Jokers */}
      <div className="flex space-x-4 h-12">
        {Object.values(jokers)
          .sort((a: Joker, b: Joker) => a.order - b.order)
          .map((joker: Joker) => (
            <JokerButton
              key={joker.name}
              action={() => {
                console.log(joker.name)
                if (['Beschermer', 'Oog', 'hint'].some(i => i === joker.name))
                  joker.action(gameState, showAnswer);
              }}
              count={joker.count ?? 0}
              disabled={joker.count === 0 || gameState.questionStatus !== 'playing'}
              variant={joker.variant}
              animationVariant={joker.animationVariant}
              name={''}
            >
              {React.createElement(joker.icon)}
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
          appliedJokers={jokerEffects}
          onAnswerComplete={(answer) =>
            setGameState(state => ({ ...state, userAnswer: answer }))
          }
          onShowAnswer={() => showAnswer()}
          onNextQuestion={() => goToNextQuestion()}
        />
      )}

      {/* Joker win animation */}
      {newJokersAnimation()}

    </Card>

  );

};

export default LanguageGame;
