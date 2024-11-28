import { useState, useCallback } from 'react';
import { GameState } from './useGameLogic';
import { getRandomSelections, getWrongLettersIndexes, getWrongWordsIndexes, groupBy } from '@/lib/game';
import { JokerWinAnimation } from '@/components/game/joker/JokerWinAnimation';
import { AnimatePresence } from 'framer-motion';
import { Joker, jokerEffectIds, jokerIds, JOKERS } from '@/components/game/joker/jokerVariants';

interface NewJoker {
  id: string,
  count: number,
}

export const useJokers = () => {
  const initialState: Joker[] = [
    ...JOKERS.map(joker => {
      if (joker.id === jokerIds.SHOW_WRONG_LETTERS) {
        joker.action = (gameState: GameState, ...params: unknown[]) => {
          // Ensure the first param is a function that matches the showAnswer signature
          const showAnswer = params[0] as (message?: string) => void;
          return revealWrongLetters(gameState, showAnswer);
        }
      } else if (joker.id === jokerIds.SHOW_WRONG_WORDS) {
        joker.action = (gameState: GameState, ...params: unknown[]) => {
          // Ensure the first param is a function that matches the showAnswer signature
          const showAnswer = params[0] as (message?: string) => void;
          return revealWrongWords(gameState, showAnswer);
        }
      } else if (joker.id === jokerIds.SHOW_ANSWER_IF_NOT_WRONG) {
        joker.action = (gameState: GameState, ...params: unknown[]) => {
          // Ensure the first param is a function that matches the showAnswer signature
          const showAnswer = params[0] as (message?: string) => void;
          return checkAnswer(gameState, showAnswer);
        }
      } else if (joker.id === jokerIds.TIME) {
        joker.action = (gameState: GameState, ...params: unknown[]) => {
          // Ensure the first param is a function that matches the showAnswer signature
          const addExtraTime = params[0] as (seconds: number) => void;
          return addTime(gameState, addExtraTime);
        }
      } else if (joker.id === jokerIds.SHOW_CORRECT_LETTERS) {
        joker.action = (gameState: GameState, ...params: unknown[]) => {
          // Ensure the first param is a function that matches the showAnswer signature
          const showAnswer = params[0] as (message?: string) => void;
          return showLetter(gameState, showAnswer);
        }
      }
      return joker
    })
  ]

  const [jokers, setJokers] = useState<Joker[]>(initialState);
  const [newJokers, setNewJokers] = useState<NewJoker[]>([]);
  const [jokerEffects, setJokerEffects] = useState<{ name: string, indexes: number[] }[]>([])


  const revealWrongLetters = (gameState: GameState, showAnswer: (message?: string) => void) => {
    const joker = jokers.find(j => j.id === jokerIds.SHOW_WRONG_LETTERS)
    if (gameState.isAnswerSubmitted || !joker || joker.count < 1) return;

    const input = gameState.userAnswer.toLowerCase();
    const question = gameState.currentQuestion?.dutch.toLowerCase();

    const indexes = getWrongLettersIndexes(question!, input)

    if (indexes.length > 0) {
      setJokerEffects((prevEffects) => ([
        ...prevEffects.filter(j => j.name !== jokerEffectIds.SHOW_WRONG_LETTERS_PLACE),
        { name: jokerEffectIds.SHOW_WRONG_LETTERS_PLACE, indexes }
      ]))
    } else {
      showAnswer()
    }
    decreaseJokerCount(jokerIds.SHOW_WRONG_LETTERS, 1)

  };

  const revealWrongWords = (gameState: GameState, showAnswer: (message?: string) => void) => {
    const joker = jokers.find(j => j.id === jokerIds.SHOW_WRONG_WORDS)
    if (gameState.isAnswerSubmitted || !joker || joker.count < 1) return;

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

    if (indexes.length > 0) {
      setJokerEffects((prevEffects) => ([
        ...prevEffects.filter(j => j.name !== jokerEffectIds.SHOW_WRONG_WORDS_PLACE),
        { name: jokerEffectIds.SHOW_WRONG_WORDS_PLACE, indexes }
      ]))
    } else {
      showAnswer()
    }

    decreaseJokerCount(jokerIds.SHOW_WRONG_WORDS, 1)
  };

  const checkAnswer = useCallback((gameState: GameState, showAnswer: (message?: string) => void) => {
    const joker = jokers.find(j => j.id === jokerIds.SHOW_ANSWER_IF_NOT_WRONG)
    if (gameState.isAnswerSubmitted || !joker || joker.count < 1) return;

    const cleanedInput = gameState.userAnswer.toLowerCase().trim();
    const cleanedCorrect = gameState.currentQuestion?.dutch.toLowerCase().trim();
    const isCorrect = cleanedInput === cleanedCorrect;

    if (isCorrect) {
      showAnswer();
    } else {
      setJokerEffects((prevEffects) => ([
        ...prevEffects.filter(j => j.name !== jokerEffectIds.SHAKING),
        { name: jokerEffectIds.SHAKING, indexes: [] }
      ]))
      setTimeout(() => {
        setJokerEffects((prevEffects) => ([
          ...prevEffects.filter(j => j.name !== jokerEffectIds.SHAKING),
        ]))
      }, 500);
    }

    decreaseJokerCount(jokerIds.SHOW_ANSWER_IF_NOT_WRONG, 1)

  }, []);

  const addTime = useCallback((gameState: GameState, addExtraTime: (seconds: number) => void) => {
    const joker = jokers.find(j => j.id === jokerIds.TIME)
    if (gameState.isAnswerSubmitted || !joker || joker.count < 1) return;

    addExtraTime(15)
    decreaseJokerCount(jokerIds.TIME, 1)

  }, [])

  const showLetter = useCallback((gameState: GameState, showAnswer: (message?: string) => void) => {
    const joker = jokers.find(j => j.id === jokerIds.SHOW_CORRECT_LETTERS)
    if (gameState.isAnswerSubmitted || !joker || joker.count < 1) return;

    const input = gameState.userAnswer.toLowerCase();
    const question = gameState.currentQuestion?.dutch.toLowerCase();

    const indexes = getWrongLettersIndexes(question!, input)
    const randomIndexes = getRandomSelections(indexes, 1, { allowDuplicates: false })

    if (indexes.length > 0) {
      setJokerEffects((prevEffects) => {
        const jokerEffect = prevEffects.find(j => j.name === jokerEffectIds.SHOW_CORRECT_LETTERS);
        // console.log(jokerEffect)
        const newEffect = !!jokerEffect
          ? {
            name: jokerEffectIds.SHOW_CORRECT_LETTERS,
            indexes: [
              ...jokerEffect.indexes,
              ...randomIndexes
            ]
          } : {
            name: jokerEffectIds.SHOW_CORRECT_LETTERS,
            indexes: randomIndexes
          }
        return ([
          ...prevEffects.filter(j => j.name !== jokerEffectIds.SHOW_CORRECT_LETTERS),
          newEffect
        ])
      })
    } else {
      showAnswer()
    }

    decreaseJokerCount(jokerIds.SHOW_CORRECT_LETTERS, 1)

  }, [])

  const addNewJokers = (userLevel: number, questionLevel: number) => {
    const jokerNumber = questionLevel > userLevel ? 3 : questionLevel === userLevel ? 2 : 1
    const jokerPool = [...JOKERS.map(j => j.id)]

    const randomSelectedJokers = getRandomSelections(jokerPool, jokerNumber, { allowDuplicates: true })
    const groupedByJokers = groupBy(randomSelectedJokers)

    setNewJokers(Object.entries(groupedByJokers).map(([key, value]) => ({
      id: key,
      count: value,
    })))

    setTimeout(() => {
      setNewJokers([]);
    }, 2000);

    setJokers(prevJokers => {
      return ([
        ...prevJokers.filter(j => !randomSelectedJokers.includes(j.id)),
        ...prevJokers.filter(j => randomSelectedJokers.includes(j.id))
          .map(joker => {
            return ({
              ...joker,
              count: joker.count + groupedByJokers[joker.id]
            })
          })
      ])
    });
  }

  const decreaseJokerCount = useCallback((id: string, count: number) => {
    setJokers((prev) => {
      const joker = prev.find(j => j.id === id)!
      return [
        ...prev.filter(j => j.id !== id),
        {
          ...joker,
          count: joker.count - count,
        }
      ]
    });
  }, [])

  const resetEffects = () => {
    console.log('Resetting joker effects')
    setJokerEffects([]);
  }

  const reset = useCallback(() => {
    console.log('Resetting jokers')
    setJokers(initialState);
    setJokerEffects([]);
  }, []);

  const newJokersAnimation = () => {
    return (
      <AnimatePresence>
        {newJokers.length > 0 && (
          <JokerWinAnimation
            jokers={newJokers}
          />
        )}
      </AnimatePresence>
    )
  }


  return { jokers, setJokers, addNewJokers, reset, resetEffects, jokerEffects, setJokerEffects, newJokersAnimation };
};
