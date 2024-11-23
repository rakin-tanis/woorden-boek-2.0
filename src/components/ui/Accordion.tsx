"use client"

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex  items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 px-4 
          ${isOpen ? 'py-4 justify-between' : 'py-2 justify-center gap-4'}`}
      >
        <span className="font-semibold">{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.span>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: 'auto',
              transition: {
                duration: 0.3,
                ease: "easeInOut"
              }
            }}
            exit={{
              opacity: 0,
              height: 0,
              transition: {
                duration: 0.3,
                ease: "easeInOut"
              }
            }}
            className="border-t p-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;