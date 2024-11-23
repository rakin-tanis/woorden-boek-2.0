import { Award, Coins, Timer } from "lucide-react";
import { Progress } from "../ui/Progress";

interface GameHeaderProps {
  level: string;
  score: number;
  timeRemaining: number;
  progress: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  level = "?",
  score = 0,
  timeRemaining,
  progress
}) => (
  <>
    <div className="flex justify-between items-center text-gray-950 dark:text-white">
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
  </>
);