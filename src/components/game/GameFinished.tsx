import { Example } from "@/types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { GameResultsTable } from "./GameResultTable";
import { getMotivationPhrase } from "@/lib/game";
import Confetti from 'react-confetti'; // Import the confetti library
import { useWindowSize } from 'react-use'; // Optional: for responsive confetti

interface GameFinishedProps {
  score: number;
  level: string;
  oldLevel: string;
  report: { example: Example, result: string }[];
  onPlayAgain: () => void;
}

export const GameFinished: React.FC<GameFinishedProps> = ({
  score,
  level,
  oldLevel,
  report,
  onPlayAgain
}) => {
  const { width, height } = useWindowSize(); // Optional: for responsive confetti
  const levelIncreased = Number(level) > Number(oldLevel);
  const levelNotChanged = Number(level) === Number(oldLevel);

  return (
    <Card className="max-w-2xl mx-auto p-6 space-y-6">
      {levelIncreased && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="text-center space-y-4 text-gray-950 dark:text-white">
        {levelIncreased
          ? <div>
            <h3 className="text-xl font-bold">{'Gefeliciteerd! 🎉'}</h3>
            <p>Je nieuwe niveau is <span className='font-bold'>{level}</span></p>
          </div>
          : levelNotChanged
            ? <div>
              <h3 className="text-xl font-bold">{'Blijf volhouden, je bent op de goede weg! 💪'}</h3>
              <p>Je niveau is nog steeds <span className='font-bold'>{level}</span></p>
            </div>
            : <div>
              <h3 className="text-xl font-bold">{'Je kunt beter dan dat! 📚'}</h3>
              <p>Je niveau is gedaald naar <span className='font-bold'>{level}</span></p>
            </div>
        }
        <p>Eindscore: {score}</p>
        <br />
        <p>{getMotivationPhrase(report.map(({ result }) => (result === "success")).filter(r => r).length)}</p>

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
};