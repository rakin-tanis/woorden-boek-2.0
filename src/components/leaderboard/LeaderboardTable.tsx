import { LeaderboardEntry, LeaderboardResponse, useLeaderboard } from "@/hooks/useLeaderboard";
import { motion } from "framer-motion";
import { Card } from "../ui/Card";


interface LeaderboardTableProps {
  title: string;
  description: string;
  leaderboard: LeaderboardResponse;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  title,
  description,
  leaderboard,
}) => {

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 text-center text-gray-950 dark:text-white z-30">
      <h2 className="text-2xl font-bold mb-0 text-center text-gray-900 dark:text-white">
        {title}
      </h2>
      <span className="mb-6 text-gray-600">{description}</span>

      {leaderboard?.entries.length === 0 ? (
        <p className="text-center text-gray-400">No entries yet</p>
      ) : (
        <motion.table
          className="w-full"
          variants={tableVariants}
          initial="hidden"
          animate="visible"
        >
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left p-2 text-gray-900 dark:text-white/70"></th>
              <th className="text-left p-2 text-gray-900 dark:text-white/70">Rank</th>
              <th className="text-left p-2 text-gray-900 dark:text-white/70">Name</th>
              <th className="text-left p-2 text-gray-900 dark:text-white/70">Level</th>
              <th className="text-left p-2 text-gray-900 dark:text-white/70">Score</th>
            </tr>
          </thead>
          <motion.tbody>
            {leaderboard!.entries!.reduce((acc: LeaderboardEntry[], entry, index, arr) => {
              // Add the current entry
              acc.push(entry);

              // Check for gaps in the ranks
              if (index > 0) {
                const prevRank = arr[index - 1].rank;
                const currentRank = entry.rank;

                // If there's a gap, add a placeholder row
                if (currentRank > prevRank + 1) {
                  acc.push({
                    id: `gap-${prevRank}-${currentRank}`,
                    rank: -1,
                    name: '***',
                    level: -1,
                    score: -1
                  }); // Cast to any to avoid TypeScript errors
                }
              }
              if (arr.length - 1 === index && leaderboard?.totalPlayersInRange && entry.rank < leaderboard?.totalPlayersInRange) {
                const difference = leaderboard?.totalPlayersInRange - entry.rank;
                acc.push({
                  id: `gap-${entry.rank + 1}`,
                  rank: -1,
                  name: `~Er ${difference > 1 ? 'zijn' : 'is'}  nog ${difference} ${difference > 1 ? 'spelers' : 'speler'}.~`,
                  level: -1,
                  score: -1,
                }); // Cast to any to avoid TypeScript errors
              }

              return acc;
            }, []).map((entry, index) => {
              if (entry.rank === -1) {
                return (
                  <tr key={entry.id} className="text-center text-gray-400">
                    <td colSpan={5} className="p-2 tex-sm">{entry.name}</td>
                  </tr>
                );
              }
              // Special styling for top 3 players
              const isTopThree = entry.rank <= 3;
              const topPlayerStyles = [
                "bg-yellow-500/20 border-l-4 border-yellow-500",
                "bg-gray-400/20 border-l-4 border-gray-400",
                "bg-amber-700/20 border-l-4 border-amber-700"
              ]
              return (
                <motion.tr
                  key={entry.id}
                  className={`
                    dark:hover:bg-white/10 hover:bg-gray-900/10 transition-colors
                      ${entry.id === 'current'
                      ? 'bg-emerald-500/20 border-2 border-emerald-500 scale-105 my-1'
                      : index % 2
                        ? 'bg-white/5'
                        : ''}
                      ${isTopThree ? topPlayerStyles[entry.rank - 1] : ''}
                      `}
                  variants={rowVariants}
                >
                  {/* Rank with crown/medal for top 3 */}
                  <td className="dark:text-white text-black">
                    {isTopThree && (
                      <span className="text-xl px-1">
                        {entry.rank === 1 ? '👑' : entry.rank === 2 ? '🥈' : '🥉'}
                      </span>
                    )}
                  </td>
                  <td className="p-2 dark:text-white text-black">
                    {entry.rank}
                  </td>
                  <td className="p-2 dark:text-white text-black">
                    {entry.name}
                  </td>
                  <td className="p-2 dark:text-white/80 text-black">{entry.level}</td>
                  <td className={`p-2 font-bold ${isTopThree
                    ? ['dark:text-yellow-400 text-yellow-500', 'dark:text-gray-300 text-gray-400', 'text-amber-700'][entry.rank - 1]
                    : 'text-emerald-400'
                    }`}>
                    {entry.score}
                  </td>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </motion.table>
      )}
    </Card>
  );
}

export default LeaderboardTable;