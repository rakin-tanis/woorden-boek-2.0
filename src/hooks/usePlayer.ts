import { useState, useEffect } from "react";
import { Player } from "@/types";
import { toast } from "sonner";

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

  const updatePlayer = async (updatedDetails: Partial<Omit<Player, "id">>) => {
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

      const { status, message } = await response.json();

      if (status === "error") {
        toast.error("Error", {
          description:
            "Player name could not be updated: " + JSON.stringify(message),
          duration: 5000,
        });
      } else if (status === "success") {
        toast.error("Success", {
          description: "Player name has successfully changed ",
          duration: 5000,
        });
      }

      setError(null);
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
