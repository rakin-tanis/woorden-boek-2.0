import { useState, useEffect } from "react";
import { Player } from "@/types";

export const usePlayer = () => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/player", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch player details"
          );
        }

        const { player: fetchedPlayer } = await response.json();
        console.log("fetchedPlayer", fetchedPlayer);
        setPlayer(fetchedPlayer);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setPlayer(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayer();
  }, []);

  const updatePlayer = async (updatedDetails: Partial<Player>) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/player", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update player");
      }

      const { player: updatedPlayer } = await response.json();

      setPlayer(updatedPlayer);
      setError(null);
      return updatedPlayer;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    player,
    isLoading,
    error,
    updatePlayer,
  };
};
