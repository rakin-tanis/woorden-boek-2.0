'use client'

import React, { useEffect, useRef } from 'react';
import LeaderboardTable from './LeaderboardTable';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { leaderboardSections } from './leaderboardSections';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { usePlayer } from '@/hooks/usePlayer';

export const Leaderboard: React.FC = () => {

  const { leaderboard, isLoading, error } = useLeaderboard();
  const { player, isLoading: isPlayerLoading, error: playerError, } = usePlayer()
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (targetRef.current) {
      const elementTop = targetRef.current.getBoundingClientRect().top
      const scrollPosition = window.scrollY + elementTop - 74

      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      })
    }
  }, [targetRef.current])

  if (isLoading || isPlayerLoading) {
    return (
      <Card className="max-w-2xl mx-auto p-6 text-center text-gray-950 dark:text-white z-30">
        Loading leaderboard...
      </Card>
    );
  }

  if (error || playerError) {
    return (
      <Card className="max-w-2xl mx-auto p-6 text-center text-gray-950 dark:text-white z-30">
        {error || playerError}
      </Card>
    );
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
      <div className="text-center dark:text-white text-gray-900 mb-4">
        <div className="relative flex flex-col-reverse justify-center items-center text-center">
          <div className='h-52'></div>
          {
            nextSections
              .sort((a, b) => a.maxLevel - b.maxLevel)
              .map((section, index) => {
                return (
                  <motion.div
                    key={index}
                    className={`
                    ${["opacity-75", 'opacity-50', 'opacity-25'][index]} 
                    ${["z-[2]", 'z-[1]', 'z-[0]'][index]}
                    ${["-bottom-1", 'bottom-14', 'bottom-28'][index]}
                    bg-gradient-to-b dark:from-gray-900 from-gray-200 to-transparent/0
                    h-20  
                    w-full                  
                    rounded-tr-lg 
                    rounded-tl-lg 
                    text-xl
                    p-4 
                    backdrop-blur-sm
                    absolute
                    drop-shadow-2xl
                  `}
                    style={{
                      transform: "perspective(200px) rotateX(-5deg)",
                      scale: `${[".90", '.80', '.75'][index]}`
                    }}
                  >
                    {section.title}
                  </motion.div>
                )
              })
          }
        </div>

        <div className='z-[3]' ref={targetRef}>
          {relevantSection && leaderboard && (
            <LeaderboardTable
              leaderboard={leaderboard}
              title={relevantSection.title}
              description={relevantSection.description}
            />
          )}
        </div>

        <div className=" relative flex flex-col justify-center items-center text-center mt-8 dark:text-white text-gray-700 ">
          {
            previousSections
              .sort((a, b) => b.maxLevel - a.maxLevel)
              .map((section, index) => {
                return (
                  <div
                    key={index}
                    className={`
                    ${["opacity-75", 'opacity-50', 'opacity-25'][index]} 
                    ${["z-[6]", 'z-[5]', 'z-[4]'][index]}
                    ${["mb-0", 'mb-0', 'mb-0'][index]}
                    bg-gradient-to-b dark:from-gray-900 from-gray-200 to-transparent/0
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
          <div className='h-52'></div>
        </div>
      </div>
    </div >
  );
};

export default Leaderboard;