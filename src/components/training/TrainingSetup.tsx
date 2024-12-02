'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useFilterOptions } from "@/hooks/useFilterOptions"
import {
  Puzzle,
  Play,
  Check,
  Database,
  LucideIcon,
  ChevronsUp
} from 'lucide-react'
import { Option } from '@/types'
import { Card } from '../ui/Card'

// Define icons for each category
const categoryIcons: { [K in string]: React.ReactElement<LucideIcon> } = {
  sources: <Database />,
  levels: <ChevronsUp className="text-cyan-500" />,
  themes: <Puzzle className="text-purple-500" />
}

type FilterCategory = 'sources' | 'levels' | 'themes'

export default function TrainingSetup() {
  const {
    sources,
    levels,
    themes,
    selectedFilters,
    updateSelectedFilters,
    isLoading,
    errors
  } = useFilterOptions()

  // Track current step
  const [currentStep, setCurrentStep] = useState(0)

  // Steps configuration
  const steps: { key: string, title: string, options: Option[], description: string, multiSelect: boolean }[] = [
    {
      key: 'sources',
      title: 'Kies Bronnen',
      options: sources,
      description: 'Selecteer de bron die je wilt oefenen',
      multiSelect: false
    },
    {
      key: 'levels',
      title: 'Kies Niveaus',
      options: levels,
      description: 'Kies het niveau waarop je wilt trainen',
      multiSelect: false
    },
    {
      key: 'themes',
      title: "Kies Thema's",
      options: themes,
      description: "Kies de thema's waarop je wilt trainen",
      multiSelect: true
    }
  ]

  // Handle option selection
  const handleOptionSelect = (
    category: FilterCategory, 
    value: string
  ) => {
    const currentStepData = steps[currentStep]
  
    if (category === 'sources') {
      updateSelectedFilters('sources', [value])
      updateSelectedFilters('levels', [])
      updateSelectedFilters('themes', [])
    } else if (category === 'levels') {
      updateSelectedFilters('levels', [value])
      updateSelectedFilters('themes', [])
    } else if (currentStepData.multiSelect) {
      const currentValues = selectedFilters[category]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
  
      updateSelectedFilters(category, newValues)
    }
  }

  // Check if current step is complete
  const isStepComplete = () => {
    const currentStepKey = steps[currentStep].key
    return selectedFilters[currentStepKey as FilterCategory].length > 0
  }

  // Move to next step
  const nextStep = () => {
    if (isStepComplete() && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  // Move to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  // Render current step options
  const renderOptions = () => {
    const currentStepData = steps[currentStep]
    const selectedValues = selectedFilters[currentStepData.key as FilterCategory]

    const getColor = (key: string, value: string, isSelected = false) => {
      if (key == 'sources')
        switch (value) {
          case 'blue':
            return `${isSelected
              ? 'bg-blue-100 border-2 border-blue-500'
              : 'bg-white border-2 border-gray-200 hover:border-blue-300'} text-blue-500`;
          case 'green':
            return `${isSelected
              ? 'bg-green-100 border-2 border-green-500'
              : 'bg-white border-2 border-gray-200 hover:border-green-300'} text-green-500`;
          case 'orange':
            return `${isSelected
              ? 'bg-orange-100 border-2 border-orange-500'
              : 'bg-white border-2 border-gray-200 hover:border-orange-300'} text-orange-500`;
          default: return 'text-gray-800'
        }
      else if (key === 'levels')
        return `${isSelected
          ? 'bg-cyan-100 border-2 border-cyan-500'
          : 'bg-white border-2 border-gray-200 hover:border-cyan-300'} text-cyan-500`;
      else if (key === 'themes')
        return `${isSelected
          ? 'bg-purple-100 border-2 border-purple-500 dark:border-purple-600'
          : 'bg-white border-2 border-gray-200 hover:border-purple-300'} text-purple-500`;
    }

    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="flex flex-wrap gap-4"
      >
        {currentStepData.options.map(option => (
          <motion.div
            key={option.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOptionSelect(currentStepData.key as FilterCategory, option.value)}
            className={`
              p-4 rounded-lg cursor-pointer transition-all duration-300
              flex items-center justify-between
              ${getColor(currentStepData.key, option.value,
              currentStepData.multiSelect
                ? selectedValues.includes(option.value)
                : selectedValues[0] === option.value)}
            `}
          >
            <div className="flex items-center space-x-3">
              {categoryIcons[currentStepData.key]}
              <span>
                {option.label}
              </span>
            </div>
            {(currentStepData.multiSelect
              ? selectedValues.includes(option.value)
              : selectedValues[0] === option.value) && (
                <Check />
              )}
          </motion.div>
        ))}
      </motion.div>
    )
  }

  // Check if all steps are complete
  const isGameReady = steps.every(step =>
    selectedFilters[step.key as FilterCategory].length > 0
  )

  if ((currentStep === 0 && isLoading.sources) || (currentStep === 1 && isLoading.levels) || (currentStep === 2 && isLoading.themes)) {
    return (
      <Card className="max-w-2xl mx-auto p-6 text-center text-gray-950 dark:text-white z-30">
        Loading...
      </Card>
    );
  }

  if (errors.sources || errors.levels || errors.themes) {
    return (
      <Card className="max-w-2xl mx-auto p-6 text-center text-gray-950 dark:text-white z-30">
        {errors.sources}
        {errors.levels}
        {errors.themes}
      </Card>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 w-full max-w-2xl"
      >
        {/* Step Indicator */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`
                w-1/3 h-2 rounded-full mx-2 transition-all duration-300
                ${currentStep === index
                  ? 'bg-amber-400 dark:bg-amber-600'
                  : currentStep > index
                    ? 'bg-emerald-600 dark:bg-emerald-700'
                    : 'bg-gray-300 dark:bg-gray-700'}
              `}
            />
          ))}
        </div>

        {/* Current Step Title */}
        <motion.h2
          key={currentStep}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-center text-gray-800 dark:text-gray-300 mb-4"
        >
          {steps[currentStep].title}
        </motion.h2>

        {/* Step Description */}
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          {steps[currentStep].description}
        </p>

        {/* Options */}
        {renderOptions()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 gap-4">
          {currentStep > 0 && (
            <button
              onClick={prevStep}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-400 text-gray-800 rounded-lg"
            >
              Previous
            </button>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              disabled={!isStepComplete()}
              className="ml-auto px-6 py-2 bg-blue-500 text-white rounded-lg 
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => { console.log('game starting', selectedFilters) }}
              disabled={!isGameReady}
              className="ml-auto px-6 py-2 bg-green-500 text-white rounded-lg 
              flex items-center space-x-2
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play />
              <span>Start Game</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}