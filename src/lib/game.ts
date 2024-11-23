import { ThemeDistribution } from "@/types";

interface Question {
  themeLevel: number; // 1-10 representing theme difficulty
  isCorrect: boolean; // Whether player answered correctly
}

interface LevelCalculationConfig {
  totalQuestions: number;
  maxLevel: number;
}

interface LevelCalculationResult {
  level: number; // Calculated player level
  confidence: number; // Confidence score of the level calculation (0-1)
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

const calculateLevel = (
  answers: Question[],
  config: LevelCalculationConfig = {
    totalQuestions: 10,
    maxLevel: 10,
  }
): number => {
  // Validate input
  // console.log(answers)
  if (answers.length !== config.totalQuestions) {
    throw new Error(
      `Expected ${config.totalQuestions} questions, got ${answers.length}`
    );
  }

  // Group correct answers by theme level
  const correctByThemeLevel = answers.reduce((acc, answer) => {
    if (answer.isCorrect) {
      acc[answer.themeLevel] = (acc[answer.themeLevel] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);

  // Count total correct answers
  const totalCorrectAnswers = answers.filter(
    (answer) => answer.isCorrect
  ).length;

  // If all answers are correct, return the max level
  if (totalCorrectAnswers === config.totalQuestions) {
    return config.maxLevel;
  }

  // Weight calculation favoring higher theme levels
  let weightedScore = 0;
  let totalWeight = 0;

  for (let themeLevel = 1; themeLevel <= config.maxLevel; themeLevel++) {
    const correctCount = correctByThemeLevel[themeLevel] || 0;
    const themeWeight = themeLevel; // Higher themes have higher weight

    weightedScore += correctCount * themeWeight;
    totalWeight += themeWeight;
  }
  // console.log(weightedScore, totalWeight)

  // Prevent division by zero
  if (totalWeight === 0) return 1;

  // Calculate normalized level
  const rawLevel =
    (weightedScore / totalWeight) *
    (config.maxLevel / config.totalQuestions) *
    totalCorrectAnswers;
  // console.log(rawLevel)

  // Round and constrain to 1-10 range
  const level = Math.max(1, Math.min(config.maxLevel, Math.round(rawLevel)));
  // console.log(level)
  return level;
};

const getMotivationPhrase = (correctNumber: number) => {
  const random = Math.floor(Math.random() * 4);

  return motivationPhrases.filter((p) => p.correctCount === correctNumber)[0]
    .phrases[random];
};

const generateQuestionDistribution = (
  level: number,
  totalQuestions: number = 10,
  maxTheme: number = 50
) => {
  level = Math.max(1, Math.min(10, level));

  // Calculate the base theme for the student's level
  const baseTheme = level;

  // Calculate theme range
  const minTheme = Math.max(1, baseTheme - 3);
  const maxReachableTheme = Math.min(maxTheme, baseTheme + 3);

  // Distribution strategy
  const distribution: ThemeDistribution[] = [
    // Easier themes (below student's level)
    { theme: minTheme, questionCount: 1 },
    { theme: Math.min(maxTheme, minTheme + 1), questionCount: 1 },

    // Themes close to student's level
    { theme: Math.max(1, baseTheme - 1), questionCount: 1 },
    { theme: baseTheme, questionCount: 4 },
    { theme: Math.min(baseTheme + 1), questionCount: 1 },

    // Slightly challenging themes
    { theme: Math.max(1, maxReachableTheme - 1), questionCount: 1 },
    { theme: maxReachableTheme, questionCount: 1 },
  ];

  // Adjust if total questions don't match
  const currentTotal = distribution.reduce(
    (sum, item) => sum + item.questionCount,
    0
  );
  if (currentTotal !== totalQuestions) {
    // Distribute remaining or excess questions to the base theme
    distribution.find((d) => d.theme === baseTheme)!.questionCount +=
      totalQuestions - currentTotal;
  }

  const groupedByTheme: ThemeDistribution[] = Object.values(
    distribution.reduce<Record<number, ThemeDistribution>>((acc, item) => {
      if (!acc[item.theme]) {
        acc[item.theme] = {
          theme: item.theme,
          questionCount: 0,
        };
      }
      acc[item.theme].questionCount += item.questionCount;
      return acc;
    }, {})
  );
  console.log(groupedByTheme);

  return groupedByTheme;
};

export { calculateLevel, getMotivationPhrase, generateQuestionDistribution };
export type { Question, LevelCalculationConfig, LevelCalculationResult };
