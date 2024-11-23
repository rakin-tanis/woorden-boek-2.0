import { useCallback } from 'react';
import { Player } from "@/types";


export const usePlayerFetch = () => {

  const fetchPlayerDetails = useCallback(async (): Promise<Player | null> => {
    try {
      const response = await fetch('/api/player', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache' // Prevent caching
        },
      });

      // Handle non-200 responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch player details');
      }

      // Parse the response
      const playerDetails: { player: Player } = await response.json();

      console.log('player fetched', playerDetails.player)
      // Return the player's current level
      return playerDetails.player;

    } catch (error) {
      // Log the error and set a default state
      console.error('Error fetching player details:', error);

      return null; // Return a default level in case of error
    }
  }, []);

  // Optional: Add a method to update player details
  const updatePlayerDetails = useCallback(async (updatedDetails: Partial<Player>) => {
    try {
      const response = await fetch('/api/player', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDetails)
      });

      if (!response.ok) {
        throw new Error('Failed to update player');
      }

      // Optionally update local state or trigger a refetch
      await response.json();
      console.log('player updated', updatedDetails)

    } catch (error) {
      console.error('Error updating player details:', error);
    }
  }, []);

  return {
    fetchPlayerDetails,
    updatePlayerDetails
  };
};