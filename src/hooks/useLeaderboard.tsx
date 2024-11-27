import { useState, useEffect } from 'react';

// Define the structure of a leaderboard entry
export interface LeaderboardEntry {
  id: string;
  name: string;
  level: number;
  score: number;
  rank: number;
}

interface LeaderboardResponse {
  entries: LeaderboardEntry[],
  totalPlayersInRange: number,
  levelRange: { min: number, max: number }
  currentPlayerRank: number,
}

export interface LeaderboardProps {
  minLevel: number;
  maxLevel: number;
}

export const useLeaderboard = ({ minLevel, maxLevel }: LeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/leaderboard?minLevel=${minLevel}&maxLevel=${maxLevel}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache' // Prevent caching
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }

        const data: LeaderboardResponse = await response.json();
        console.log(data)
        setLeaderboard(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [minLevel, maxLevel]);

  return { leaderboard, isLoading, error };
};