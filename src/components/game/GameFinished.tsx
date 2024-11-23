import { Example } from "@/types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { GameResultsTable } from "./GameResultTable";
import { getMotivationPhrase } from "@/lib/game";

interface GameFinishedProps {
  score: number;
  level: string;
  report: { example: Example, result: string }[];
  onPlayAgain: () => void;
}

export const GameFinished: React.FC<GameFinishedProps> = ({
  score,
  level,
  report,
  onPlayAgain
}) => (
  <Card className="max-w-2xl mx-auto p-6 space-y-6">
    <div className="text-center space-y-4 text-gray-950 dark:text-white">
      <h3 className="text-xl font-bold">{'Gefeliciteerd! 🎉'}</h3>
      <p>{getMotivationPhrase(report.map(({ result }) => (result === "success")).filter(r => r).length)}</p>
      <p>Eindscore: {score}</p>
      <p>Je nieuwe niveau is <span className='font-bold'>{level}</span></p>

      <GameResultsTable report={report} />

      <Button
        onClick={onPlayAgain}
        className="bg-green-500 hover:bg-green-600"
      >
        Play Again
      </Button>
    </div>
  </Card>
);