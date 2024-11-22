"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import {
  Play,
  Eye,
  Zap,
  Shield,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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
      className="text-center space-y-8 max-w-2xl mx-auto text-gray-800 dark:text-gray-100"
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

  /* const renderGameModes = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-2xl mx-auto"
    >
      <motion.h2
        variants={itemVariants}
        className="text-3xl font-bold text-center text-gray-800"
      >
        Choose Your Game Mode
      </motion.h2>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            icon: BookOpen,
            title: "Classic Mode",
            description: "Test your vocabulary skills",
            color: "blue"
          },
          {
            icon: Star,
            title: "Challenge Mode",
            description: "Compete against the clock",
            color: "yellow"
          },
          {
            icon: Users,
            title: "Multiplayer",
            description: "Play with friends online",
            color: "green"
          }
        ].map((mode, index) => (
          <motion.div
            key={mode.title}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              p-6 rounded-lg shadow-md text-center 
              bg-${mode.color}-50 border border-${mode.color}-200
              hover:bg-${mode.color}-100 transition-colors
            `}
          >
            <mode.icon className={`w-12 h-12 mx-auto text-${mode.color}-500 mb-4`} />
            <h3 className="text-xl font-semibold mb-2">{mode.title}</h3>
            <p className="text-gray-600">{mode.description}</p>
            <Button
              variant="outline"
              className={`mt-4 border-${mode.color}-500 text-${mode.color}-500`}
            >
              Play
            </Button>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="text-center mt-6"
      >
        <Button
          variant="ghost"
          onClick={() => setActiveSection('howToPlay')}
        >
          Back to Main Menu
        </Button>
      </motion.div>
    </motion.div>
  ); */

  const renderHowToPlayModes = () => {
    const jokerTypes = [
      {
        name: "Translation Hint",
        icon: Zap,
        description: "Reveals a partial translation of the word",
        initialCount: 3,
        color: "yellow-500",
        dropShadow: "drop-shadow-[0_4px_6px_rgba(234,179,8,0.3)]"
      },
      {
        name: "Eye",
        icon: Eye,
        description: "Scan and reveal hidden errors at a glance",
        initialCount: 2,
        color: "purple-600",
        dropShadow: "drop-shadow-[0_4px_6px_rgba(147,51,234,0.3)]"
      },
      {
        name: "Guardian",
        icon: Shield,
        description: "Defend against potential mistakes before they strike",
        initialCount: 1,
        color: "lime-500",
        dropShadow: "drop-shadow-[0_4px_6px_rgba(132,204,22,0.3)]"
      }
    ];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 max-w-3xl mx-auto bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100"
        >
          How to Play
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-4 text-gray-700 dark:text-gray-300"
        >
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
              Game Overview
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Total Questions per Session: 10</li>
              <li>Languages: Dutch to Turkish and vice versa</li>
              <li>Time per Question: 30 seconds</li>
              <li>Passing Score: 70%</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
              Joker Buttons
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {jokerTypes.map((joker) => (
                <motion.div
                  key={joker.name}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-100 dark:bg-gray-600 p-4 rounded-lg text-center"
                >
                  <joker.icon className={`w-10 h-10 mx-auto mb-2 text-${joker.color} ${joker.dropShadow}`} />
                  <h4 className="font-semibold mb-1">{joker.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {joker.description}
                  </p>
                  <div className="flex items-center justify-center">
                    <span className="text-sm font-bold bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
                      Available: {joker.initialCount}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-500"
          >
            <p className="text-blue-700 dark:text-blue-300">
              💡 Pro Tip: Use your jokers wisely! They can be crucial in challenging questions.
            </p>
          </motion.div>
        </motion.div>

        <div className="flex justify-center space-x-4 mt-6">
          <Button
            variant="outline"
            className="dark:border-gray-600 dark:text-gray-300"
            onClick={() => setActiveSection('main')}
          >
            Back to Main
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
            onClick={() => router.push('/game')}
          >
            Start Game
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-4xl border border-transparent dark:border-gray-700"
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default WelcomePage;