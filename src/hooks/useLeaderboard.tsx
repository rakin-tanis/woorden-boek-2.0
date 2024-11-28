import { useState, useEffect } from 'react';

// Define the structure of a leaderboard entry
export interface LeaderboardEntry {
  id: string;
  name: string;
  level: number;
  score: number;
  rank: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[],
  totalPlayersInRange: number,
  levelRange: { min: number, max: number }
  currentPlayerRank: number,
}

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        // ?minLevel=${minLevel}&maxLevel=${maxLevel}
        const response = await fetch(`/api/leaderboard`, {
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
        setLeaderboard(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return { leaderboard, isLoading, error };
};