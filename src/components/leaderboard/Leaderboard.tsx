'use client'

import React from 'react';
import { usePlayer } from '@/hooks/usePlayer';
import LeaderboardTable from './LeaderboardTable';

export const Leaderboard: React.FC = () => {
  const leaderboardSections = [
    {
      minLevel: 1,
      maxLevel: 10,
      title: 'Kaas & Stroopwafel Divisie',
      description: 'Proeven van de eerste successen'
    },
    {
      minLevel: 11,
      maxLevel: 20,
      title: 'Tulpen & Klompen Divisie',
      description: 'Wortel schieten en groeien als een Nederlandse traditie'
    },
    {
      minLevel: 21,
      maxLevel: 35,
      title: 'Fietsen & Windmolen Divisie',
      description: 'Vooruit met de kracht van Nederlandse innovatie'
    },
    {
      minLevel: 36,
      maxLevel: 50,
      title: 'Oranje & Water Strijders Divisie',
      description: 'De top bereiken met de kracht van een oranje legioen'
    }
  ];

  const { player, isLoading: isPlayerLoading, error: playerError } = usePlayer();

  if (isPlayerLoading) {
    return <div className="text-center text-white">Loading player data...</div>;
  }

  if (playerError) {
    return <div className="text-center text-red-500">{playerError}</div>;
  }

  const playerLevel = player?.level || 1;

  const relevantSection = leaderboardSections.find(section =>
    playerLevel >= section.minLevel && playerLevel <= section.maxLevel
  );

  const previousSections = leaderboardSections.filter(section =>
    section.maxLevel < (relevantSection?.minLevel || 0)
  );

  const nextSections = leaderboardSections.filter(section =>
    section.minLevel > (relevantSection?.maxLevel || 0)
  );

  return (
    <div className="space-y-6">
      <div className="text-center text-white mb-4">
        <div className="relative flex flex-col-reverse justify-center items-center text-center">
          {
            nextSections
              .sort((a, b) => a.maxLevel - b.maxLevel)
              .map((section, index) => {
                return (
                  <div
                    key={index}
                    className={`
                    ${["opacity-75", 'opacity-50', 'opacity-25'][index]} 
                    ${["z-20", 'z-10', 'z-0'][index]}
                    ${["mx-4", 'mx-8', 'mx-12'][index]}
                    ${["-bottom-2", 'bottom-14', 'bottom-28'][index]}
                    bg-gradient-to-b from-gray-900 to-transparent/0
                    h-20  
                    w-full                  
                    rounded-tr-lg 
                    rounded-tl-lg 
                    text-xl
                    p-4 
                    backdrop-blur-sm
                    absolute
                  `}
                    style={{
                      transform: "perspective(200px) rotateX(-5deg)",
                      scale: `${[".90", '.80', '.75'][index]}`
                    }}
                  >
                    {section.title}
                  </div>
                )
              })
          }
        </div>
        {relevantSection && (
          <LeaderboardTable
            minLevel={relevantSection.minLevel}
            maxLevel={relevantSection.maxLevel}
            title={relevantSection.title}
            description={relevantSection.description}
          />
        )}

        <div className=" relative flex flex-col justify-center items-center text-center mt-8">
          {
            previousSections
              .sort((a, b) => b.maxLevel - a.maxLevel)
              .map((section, index) => {
                return (
                  <div
                    key={index}
                    className={`
                    ${["opacity-75", 'opacity-50', 'opacity-25'][index]} 
                    ${["z-20", 'z-10', 'z-0'][index]}
                    ${["mb-0", 'mb-0', 'mb-0'][index]}
                    bg-gradient-to-b from-gray-900 to-transparent/0
                    h-20       
                    w-full  
                    max-w-xl          
                    rounded-tr-lg 
                    rounded-tl-lg 
                    text-xl
                    p-4 
                    backdrop-blur-sm
                    mb-12
                  `}
                    style={{
                      transform: "perspective(200px) rotateX(-10deg)",
                      scale: `${["1.25", '1.50', '1.75'][index]}`
                    }}
                  >
                    {section.title}
                  </div>
                )
              })
          }
        </div>
      </div>
    </div >
  );
};

export default Leaderboard;