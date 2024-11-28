import { motion } from 'framer-motion';
import { JokerButtonVariantsDetail, JOKERS } from './jokerVariants';
import React from 'react';
import { Circle } from 'lucide-react';


export const JokerWinAnimation: React.FC<{ jokers: { id: string, count: number }[] }> = ({ jokers }) => {

  return (
    <div className="absolute inset-0 bottom-16 top-16 z-50 flex flex-row items-center justify-center gap-4 flex-wrap">
      {/* <div className="p-20 rounded-full relative flex flex-row flex-wrap gap-4"> */}

      {jokers.map((joker, index) => {
        const newJoker = JOKERS.find(j => j.id === joker.id);
        const variant = newJoker?.variant || 'rose';
        const icon = newJoker?.icon || Circle
        const colorClass = 'text-' + (JokerButtonVariantsDetail[variant]?.color || 'text-white');
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
            className={`relative flex space-x-4 items-center ${colorClass} text-4xl font-bold font-mono`}
            style={{
              textShadow: 'rgba(255,255,0,0.9) 0px 0px 12px',
            }}>
            +{joker.count}
            {React.createElement(icon, {
              className: `${colorClass} w-12 h-12 animate-turnAround`,
              style: {
                textShadow: 'rgba(255,255,0,0.9) 0px 0px 12px',
                filter: 'drop-shadow(0 0 12px rgba(255, 255, 0, 0.9))'
              }
            })}
          </motion.div>
        )
      })}
      {/* </div> */}
    </div >
  );
};