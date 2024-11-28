"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2,
  Clock,
  Globe2,
  Lightbulb,
  Play,
  Star,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { JokerButtonVariantsDetail, JOKERS } from './game/joker/jokerVariants';

const WelcomePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'main' | 'howToPlay'>('main');
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const renderMainSection = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center space-y-8 max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700"
    >
      <motion.div variants={itemVariants} className="flex justify-center items-center">
        <span className="text-4xl mr-4">🇳🇱 🇹🇷</span>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
          Woorden Boek
        </h1>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="text-xl text-gray-600 dark:text-gray-400"
      >
        Verhoog je taalvaardigheden in het Turks en Nederlands door middel van een verslavende, spelgebaseerde leerervaring!
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="flex justify-center space-x-4"
      >
        <Button
          onClick={() => setActiveSection('howToPlay')}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
        >
          <Play className="w-5 h-5" />
          <span>Start Game</span>
        </Button>
      </motion.div>
    </motion.div>
  );


  const renderHowToPlayModes = () => {
    const jokers = [...JOKERS];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
        >
          Spelhandleiding
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-6"
        >
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400 flex items-center">
              <Zap className="mr-3 text-yellow-500" />
              Speloverzicht
            </h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-center">
                <CheckCircle2 className="mr-3 text-green-500" />
                Totaal Aantal Vragen per Sessie: 10
              </li>
              <li className="flex items-center">
                <Globe2 className="mr-3 text-blue-500" />
                Talen: Turks naar Nederlands
              </li>
              <li className="flex items-center">
                <Clock className="mr-3 text-red-500" />
                Tijd per Vraag: 60 seconden
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-green-600 dark:text-green-400 flex items-center">
              <Star className="mr-3 text-yellow-500" />
              Jokerknoppen
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {jokers.map((joker) => (
                <motion.div
                  key={joker.name}
                  whileHover={{
                    scale: 1.05,
                    rotate: 2,
                  }}
                  className="bg-gray-50 dark:bg-gray-700 p-5 rounded-2xl text-center shadow-md hover:shadow-xl transition-all"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${JokerButtonVariantsDetail[joker.variant].bgColor}/20`}>
                    {React.createElement(joker.icon, {
                      className: `w-8 h-8 ${JokerButtonVariantsDetail[joker.variant].darkTextColor}`,
                    })}
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">
                    {joker.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {joker.description}
                  </p>
                  <div className="flex items-center justify-center">
                    <span className="text-sm font-bold bg-blue-100 dark:bg-blue-900 text-gray-900 dark:text-white px-3 py-1 rounded-full">
                      Beschikbaar: {joker.count}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-2xl border-l-4 border-yellow-500 flex items-center"
          >
            <Lightbulb className="mr-4 text-yellow-600 w-10 h-10" />
            <p className="text-yellow-700 dark:text-yellow-300 font-medium">
              Pro Tip: Gebruik je jokers strategisch! Ze kunnen de sleutel zijn tot overwinning in uitdagende vraagstukken.
            </p>
          </motion.div>
        </motion.div>

        <div className="flex justify-center space-x-4 mt-8">
          <Button
            variant="outline"
            className="dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setActiveSection('main')}
          >
            Terug naar Hoofdmenu
          </Button>
          <Button
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            onClick={() => router.push('/game')}
          >
            Start Spel
          </Button>
        </div>
      </motion.div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'main':
        return renderMainSection();
      case 'howToPlay':
        return renderHowToPlayModes();
    }
  };

  return (
    <div className="min-h-screen min-w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      // className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-4xl shadow-2xl border border-transparent dark:border-gray-700"
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default WelcomePage;