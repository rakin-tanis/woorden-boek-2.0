interface QuestionDistribution {
  theme: number;
  questionCount: number;
}

interface AnswerResult {
  themeLevel: number;
  isCorrect: boolean;
}

interface LevelCalculationResult {
  level: number; // Calculated player level
  confidence: number; // Confidence score of the level calculation (0-1)
}

interface WordDifference {
  start: number;
  end: number;
}

const motivationPhrases = [
  {
    correctCount: 0,
    phrases: [
      "Geen antwoord goed, maar je bent een expert in doorzetten. De echte kampioenen beginnen hier!",
      "Alles fout, maar je hebt wel een perfecte score in positiviteit.",
      "Niks goed, maar geen stress. De enige kant die je nu op kunt, is omhoog!",
      "Alles fout? Nou ja, iemand moet de statistieken naar beneden trekken.",
    ],
  },
  {
    correctCount: 1,
    phrases: [
      "Je hebt één goed antwoord én een goed humeur. Winnen zit 'm in de mindset!",
      "Één antwoord goed, maar je inzet verdient een staande ovatie!",
      "Één goed! Hé, je hebt er eentje gevonden, dat is iets!",
      "Eén goed! Je hebt in ieder geval bewezen dat gokken een kunst is.",
    ],
  },
  {
    correctCount: 2,
    phrases: [
      "Twee goede antwoorden... je bent een meester in het spotten van moeilijke vragen.",
      "Twee goed! Laten we zeggen dat je voor de gezelligheid meedoet.",
      "Twee goed! Dat is al dubbel zoveel als ik verwacht had!",
      "Twee goed? Dat is al dubbel zoveel als ik ooit scoor!",
    ],
  },
  {
    correctCount: 3,
    phrases: [
      "Kijk, je hebt drie antwoorden én een goed gevoel voor humor!",
      "Drie goed! Je hebt in ieder geval meer gescoord dan mijn plant ooit doet.",
      "Drie goed! Als dit een loterij was, was je nóg bijna een winnaar.",
      "Drie goed? Hé, dat is al bijna een hattrick!",
    ],
  },
  {
    correctCount: 4,
    phrases: [
      "Je hebt vier antwoorden goed én de charme van een winnaar.",
      "Vier is een feest! Nou ja, misschien niet voor de statistieken.",
      "Vier goed! Hé, dit had ik ook geraden, maar dan per ongeluk.",
      "Vier goed? Dat is genoeg om een applausje waard te zijn!",
    ],
  },
  {
    correctCount: 5,
    phrases: [
      "Vijf goed, vijf fout. Precies in balans. Je bent gewoon zen.",
      "Vijf goed! Perfect als je een carrière als gemiddelde wil beginnen.",
      "Vijftig procent is een mooi startpunt, nu nog even doorpakken!",
      "Vijf goed! Genoeg voor een blije glimlach en een patatje achteraf!",
    ],
  },
  {
    correctCount: 6,
    phrases: [
      "Zes goed? Dat is bijna meer dan ik in een jaar onthoud!",
      "Een dikke voldoende, en het smaakt naar meer!",
      "Zes goed! Genoeg om een quizheld te zijn, niet genoeg om rijk te worden.",
      "Zes goed? Je bent op dreef en de finish komt in zicht!",
    ],
  },
  {
    correctCount: 7,
    phrases: [
      "Ze zeggen dat zeven geluk brengt, en jij bewijst het!",
      "Zeven keer raak? Nou, ik had na vraag drie al opgegeven.",
      "Zeven goed? Dat is zo’n rare score dat ik bijna trots ben.",
      "Zeven goed? Nu begin je gevaarlijk goed te worden!",
    ],
  },
  {
    correctCount: 8,
    phrases: [
      "Je zit in de topklasse, net als een achtbaan: vol spanning en succes!",
      "Acht keer raak! Zijn dit écht jouw hersens of zit er AI achter?",
      "Acht goed! Of je bent briljant, of de rest was gewoon heel makkelijk.",
      "Acht goed? Je bent als een meester in training!",
    ],
  },
  {
    correctCount: 9,
    phrases: [
      "Bijna foutloos! Alleen Einstein zou dit beter kunnen doen.",
      "Negen goed? Serieus, zit er ergens een draadje naar Wikipedia?",
      "Hoe weet jij dit allemaal? Heb je een directe lijn met Google?",
      "Negen goed? Dit is echt het niveau van een quizlegende.",
    ],
  },
  {
    correctCount: 10,
    phrases: [
      "Je bent een wandelende encyclopedie! Waar blijft je Wikipedia-pagina?",
      "Perfectie bestaat toch! Je bent een levend bewijs.",
      "Wacht, heb je stiekem de antwoorden gelekt? Dit is niet normaal goed!",
      "Wow, heb jij een superkracht of gewoon een kristallen bol thuis?",
    ],
  },
];

const calculateLevel = (answers: AnswerResult[], currentLevel = 1): number => {
  // Weights for different theme levels relative to player's current level
  const getQuestionWeight = (themeLevel: number): number => {
    const levelDiff = themeLevel - currentLevel;
    if (levelDiff < 0) return 0.8; // Lower level questions worth less
    if (levelDiff > 0) return 1.2; // Higher level questions worth more
    return 1.0; // Current level questions worth normal
  };

  // Calculate total weighted score
  const totalQuestions = answers.length;
  let weightedCorrectAnswers = 0;

  answers.forEach((answer) => {
    if (answer.isCorrect) {
      weightedCorrectAnswers += getQuestionWeight(answer.themeLevel);
    }
  });

  const performanceScore = weightedCorrectAnswers / totalQuestions;

  // Calculate level change based on performance
  if (performanceScore >= 0.8) {
    // Excellent performance: gain 1-2 levels
    return Math.min(50, currentLevel + 1);
  } else if (performanceScore >= 0.6) {
    // Good performance: stay at current level
    return currentLevel;
  } else {
    // Poor performance: drop 1 level
    return Math.max(1, currentLevel - 1);
  }
}

const getMotivationPhrase = (correctNumber: number) => {
  const random = Math.floor(Math.random() * 4);

  return motivationPhrases.filter((p) => p.correctCount === correctNumber)[0]
    .phrases[random];
};

const generateQuestionDistribution = (
  currentLevel: number
): QuestionDistribution[] => {
  // Ensure level is within bounds
  const boundedLevel = Math.max(1, Math.min(50, currentLevel));

  const distribution: QuestionDistribution[] = [];
  let remainingQuestions = 10; // Total questions needed

  // Distribution logic:
  // 40% questions from current level
  // 30% questions from one level below
  // 30% questions from one level above

  if (boundedLevel > 1) {
    // Questions from one level below
    distribution.push({
      theme: boundedLevel - 1,
      questionCount: 3,
    });
    remainingQuestions -= 3;
  }

  // Questions from current level
  distribution.push({
    theme: boundedLevel,
    questionCount: 4,
  });
  remainingQuestions -= 4;

  if (boundedLevel < 50) {
    // Questions from one level above
    distribution.push({
      theme: boundedLevel + 1,
      questionCount: remainingQuestions,
    });
  } else {
    // If at max level, add remaining questions to current level
    distribution[distribution.length - 1].questionCount += remainingQuestions;
  }

  return distribution;
}

const isAllowedLetter = (key: string) => {
  return /^[a-zA-Z]$/i.test(key);
};

const getWrongWordsIndexes = (original: string, comparison: string) => {
  const findWordIndexes = (text: string) => {
    const indexes: { start: number; end: number }[] = [];
    let count = 0;
    let startIndex = 0;
    let endIndex = 0;
    [...text].map((c, index) => {
      if (isAllowedLetter(c) && count === 0) {
        startIndex = index;
        count++;
      } else if (!isAllowedLetter(c) && count === 1) {
        endIndex = index - 1;
        count++;
      } else if (index === text.length - 1) {
        endIndex = index;
        count++;
      }
      if (count === 2) {
        indexes.push({ start: startIndex, end: endIndex });
        count = 0;
      }
    });

    return indexes;
  };

  const indexes = findWordIndexes(original);
  const wrongWords: WordDifference[] = [];

  indexes.map(({ start, end }) => {
    const originalWord = original.substring(start, end + 1);
    const comparisonWord = comparison.substring(start, end + 1);

    if (originalWord !== comparisonWord) {
      wrongWords.push({ start, end });
    }
  });

  return wrongWords;
};

const getWrongLettersIndexes = (
  referenceText: string,
  input: string
): number[] => {
  const wrongIndexes: number[] = [];
  const referenceLength = referenceText.length;
  const inputLength = input.length;

  let refIndex = 0; // Index in the reference text
  let inputIndex = 0; // Index in the input text

  while (refIndex < referenceLength || inputIndex < inputLength) {
    const refChar =
      refIndex < referenceLength ? referenceText[refIndex] : undefined;
    const inputChar = inputIndex < inputLength ? input[inputIndex] : undefined;

    // If characters are different, or one is missing
    if (refChar !== inputChar) {
      // If the character in reference exists, push its index
      if (refChar !== undefined) {
        wrongIndexes.push(refIndex);
      }
    }

    refIndex++;
    inputIndex++;
  }

  return wrongIndexes;
}

/**
 * Returns a specified number of unique random selections from an array
 * @template T The type of elements in the array
 * @param array The source array to select from
 * @param count Number of random selections to make
 * @param options Optional configuration for selection
 * @returns Array of randomly selected items
 */
function getRandomSelections<T>(
  array: T[], 
  count: number, 
  options: {
      allowDuplicates?: boolean;
      seed?: number;
  } = {}
): T[] {
  // Validate inputs
  if (array.length === 0) {
      return [];
  }

  const {
      allowDuplicates = false,
      seed
  } = options;

  // Create a random number generator with optional seed
  const randomGenerator = seed !== undefined 
      ? createSeededRandom(seed) 
      : Math.random;

  // Adjust count to not exceed array length if no duplicates allowed
  const safeCount = allowDuplicates 
      ? count 
      : Math.min(count, array.length);

  if (allowDuplicates) {
      // Simple random selection with duplicates allowed
      return Array.from({ length: safeCount }, () => 
          array[Math.floor(randomGenerator() * array.length)]
      );
  } else {
      // Unique selection without duplicates using Fisher-Yates shuffle
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(randomGenerator() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, safeCount);
  }
}

/**
* Creates a seeded random number generator
* @param seed Seed value for random generation
* @returns Seeded random number generator function
*/
const createSeededRandom = (seed: number): () => number => {
  // Simple linear congruential generator
  let x = seed;
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);

  return () => {
      x = (a * x + c) % m;
      return x / m;
  };
}

function groupBy<T>(array: T[]): Record<string, number> {
  return array.reduce((acc, curr) => {
      acc[curr as string] = (acc[curr as string] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);
}

export {
  isAllowedLetter,
  calculateLevel,
  getMotivationPhrase,
  generateQuestionDistribution,
  getWrongWordsIndexes,
  getWrongLettersIndexes,
  getRandomSelections,
  groupBy
};
export type {
  QuestionDistribution,
  AnswerResult,
  LevelCalculationResult,
  WordDifference,
};
