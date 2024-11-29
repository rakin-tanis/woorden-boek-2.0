"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2,
  Clock,
  Globe2,
  Lightbulb,
  Medal,
  Play,
  Star,
  Trophy,
  UserPlus,
  Zap,
  Lock,
  ChevronLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { JokerButtonVariantsDetail, JOKERS } from './game/joker/jokerVariants';
import { useSession } from 'next-auth/react';

const WelcomePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'main' | 'signIn' | 'howToPlay'>('main');
  const { data: session } = useSession();
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
          // onClick={() => setActiveSection('howToPlay')}
          onClick={() => setActiveSection(session ? 'howToPlay' : 'signIn')}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
        >
          <Play className="w-5 h-5" />
          <span>Start Game</span>
        </Button>
      </motion.div>
    </motion.div>
  );

  const renderSignInSection = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-900/80 p-8 rounded-3xl shadow-2xl border border-blue-200 dark:border-blue-800"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-4xl font-extrabold mb-4 text-blue-800 dark:text-blue-200">
            Ontgrendel Je Volledige Leerpotentieel!
          </h2>
          <p className="text-xl text-blue-700 dark:text-blue-300 mb-8">
            Maak een account aan en krijg toegang tot geweldige functies
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-blue-900/50 p-6 rounded-2xl shadow-lg text-center">
            <Trophy className="mx-auto w-16 h-16 text-yellow-500 mb-4" />
            <h3 className="font-bold text-xl mb-2 text-blue-800 dark:text-blue-200">Leaderboard</h3>
            <p className="text-blue-700 dark:text-blue-300">
              Bekijk je rang en concurreer met andere spelers
            </p>
          </div>

          <div className="bg-white dark:bg-blue-900/50 p-6 rounded-2xl shadow-lg text-center">
            <Medal className="mx-auto w-16 h-16 text-green-500 mb-4" />
            <h3 className="font-bold text-xl mb-2 text-blue-800 dark:text-blue-200">Voortgang Opslaan</h3>
            <p className="text-blue-700 dark:text-blue-300">
              Ga verder waar je gebleven was in je taalleertraject
            </p>
          </div>

          <div className="bg-white dark:bg-blue-900/50 p-6 rounded-2xl shadow-lg text-center">
            <UserPlus className="mx-auto w-16 h-16 text-purple-500 mb-4" />
            <h3 className="font-bold text-xl mb-2 text-blue-800 dark:text-blue-200">Gepersonaliseerd Leren</h3>
            <p className="text-blue-700 dark:text-blue-300">
              Volg je voortgang en ontvang aanbevelingen
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-8 space-y-4"
        >
          <p className="text-blue-800 dark:text-blue-200 font-semibold">
            Klaar om je taalleerervaring te transformeren?
          </p>
          <div className="flex justify-center space-y-4 space-y-reverse md:space-x-4 md:space-y-0 md:flex-row flex-col-reverse pb-4">
            <Button
              variant="outline"
              className="border-blue-500 text-blue-700 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-300 flex justify-center items-center"
              onClick={() => setActiveSection('main')}
            >
              <ChevronLeft className="mr-2 w-5 h-5" />
              Terug
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white flex justify-center items-center"
              onClick={() => router.push('/auth/signIn')}
            >
              <Lock className="mr-2 w-5 h-5" />
              Aanmelden
            </Button>
            <Button
              variant="outline"
              className="border-green-500 text-green-700 hover:bg-green-100 hover:text-green-900 dark:border-green-400 dark:text-green-300 flex justify-center items-center"
              onClick={() => setActiveSection('howToPlay')}
            >
              <Play className="mr-2 w-5 h-5" />
              Doorgaan zonder aanmelden
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  };


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

        <div className="flex justify-center mt-8 flex-col-reverse md:flex-row space-y-4 space-x-0 md:space-y-0 md:space-x-4 space-y-reverse">
          <Button
            variant="outline"
            className="dark:border-gray-600 dark:text-gray-300 hover:bg-white hover:text-gray-700 dark:hover:bg-gray-700 w-full md:w-56"
            onClick={() => setActiveSection(session ? 'main' : 'signIn')}
          >
            Terug naar Hoofdmenu
          </Button>
          <Button
            className="glow bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 w-full md:w-56"
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
      case 'signIn':
        return renderSignInSection();
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