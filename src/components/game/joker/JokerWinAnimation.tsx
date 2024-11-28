"use client"

import { motion } from 'framer-motion';
import { JokerButtonVariantsDetail, JOKERS } from './jokerVariants';
import React from 'react';
import { Circle } from 'lucide-react';


export const JokerWinAnimation: React.FC<{ jokers: { id: string, count: number }[] }> = ({ jokers }) => {

  return (
    <div className="absolute inset-0 bottom-20 top-40 right-6 left-6 z-50 rounded-lg flex flex-row items-center justify-center gap-4 flex-wrap">

      {jokers.map((joker, index) => {
        const newJoker = JOKERS.find(j => j.id === joker.id);
        const variant = newJoker?.variant || 'rose';
        const icon = newJoker?.icon || Circle
        return (
          <motion.div
            key={joker.id}
            initial={{ scale: 0, opacity: 0, y: 100 }} // Initial state for the joker animation
            animate={{
              scale: 1,
              opacity: 1,
              y: -50,
              transition: {
                duration: 1,
                delay: index * 0.3,
                type: "spring",
                stiffness: 300,
                damping: 15
              }
            }}
            exit={{ scale: 0, opacity: 0, y: -50, transition: { duration: 0.3 } }}
            className={`relative flex space-x-4 items-center gap-1`}
            style={{
              textShadow: 'rgba(0,0,0,0.9) 0px 0px 3px',
            }}>
            <div className={`${JokerButtonVariantsDetail[variant]?.darkTextColor} text-3xl font-bold font-mono`}>
              +{joker.count}
            </div>
            {React.createElement(icon, {
              className: `text-white ${JokerButtonVariantsDetail[variant]?.bgColor} p-2 rounded-md w-10 h-12 animate-turnAround`,
              style: {
                filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.9))'
              }
            })}
          </motion.div>
        )
      })}
    </div >
  );
};