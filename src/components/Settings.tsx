'use client'

import React, { useEffect, useState } from 'react';
import { usePlayer } from '@/hooks/usePlayer';

const Settings = () => {
  const { player, isLoading, error, updatePlayer } = usePlayer();
  const [newName, setNewName] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() === '') return; // Prevent empty submission

    await updatePlayer({ name: newName });
  };

  useEffect(() => {
    setNewName(player?.name || '')
  }, [player])

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="settings-container">
      <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Player Name
          </label>
          <input
            type="text"
            id="playerName"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:text-white"
            placeholder="Enter new player name"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Update Name
        </button>
      </form>
    </div>
  );
};

export default Settings;