import { Example } from '@/types';
import { useCallback } from 'react';

export const useGameExamplesFetch = () => {
  const fetchGameExamples = useCallback(async (level?: string): Promise<Example[]> => {
    try {
      const url = level ? `/api/game?level=${level}` : `/api/game`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch game examples');
      }

      const data = await response.json();

      if (!data.examples) {
        throw new Error('No examples found');
      }
      console.log('examples fetched', data.examples)
      return data.examples;

    } catch (error) {
      console.error('Error fetching game examples:', error);
      return [];
    }
  }, []);

  const fetchTrainingExamples = useCallback(async (source: string, level: string, themes: string[]): Promise<Example[]> => {
    try {
      const url = new URL('/api/training', window.location.origin)
      url.searchParams.set('source', source)
      url.searchParams.set('level',level)
      themes.forEach(theme =>
        url.searchParams.append('themes', theme)
      )

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch training examples');
      }

      const data = await response.json();

      if (!data.examples) {
        throw new Error('No training examples found');
      }
      console.log('training examples fetched', data.examples)
      return data.examples;

    } catch (error) {
      console.error('Error fetching training examples:', error);
      return [];
    }
  }, []);

  return { fetchGameExamples, fetchTrainingExamples };
};