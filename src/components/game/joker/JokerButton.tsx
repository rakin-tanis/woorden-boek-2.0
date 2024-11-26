"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '../../ui/Button'
import { Joker } from '@/hooks/useJokers'
import { getJokerButtonVariantDetails, JokerButtonVariantsDetailValueType } from './jokerVariants'

type JokerButtonProps = Pick<Joker,
  'name' |
  "count" |
  'disabled' |
  'variant' |
  'animationVariant'>
  & {
    action: () => void,
    children: React.ReactNode
  }



// Custom styles for bubbly button effect
const getBubblyButtonStyles = (buttonColor: string) => `
  @keyframes topBubbles {
    0% {
      background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;
    }
    50% {
      background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 90% 30%;
    }
    100% {
      background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%, 50% 40%, 65% 10%, 90% 20%;
      background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
    }
  }

  @keyframes bottomBubbles {
    0% {
      background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%, 70% -10%, 70% 0%;
    }
    50% {
      background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%, 105% 0%;
    }
    100% {
      background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%, 110% 10%;
      background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
    }
  }

  .bubbly-button {
    position: relative;
    transition: transform ease-in 0.1s, box-shadow ease-in 0.25s;
    // box-shadow: 0 2px 25px rgba(${buttonColor}, 0.5);

    &:before, &:after {
      position: absolute;
      content: '';
      display: block;
      width: 140%;
      height: 100%;
      left: -20%;
      z-index: -1000;
      transition: all ease-in-out 0.5s;
      background-repeat: no-repeat;
    }

    &:before {
      display: none;
      top: -75%;
      background-image:  
        radial-gradient(circle, rgba(${buttonColor}, 1) 20%, transparent 20%),
        radial-gradient(circle, transparent 20%, rgba(${buttonColor}, 1) 20%, transparent 30%),
        radial-gradient(circle, rgba(${buttonColor}, 1) 20%, transparent 20%), 
        radial-gradient(circle, rgba(${buttonColor}, 1) 20%, transparent 20%),
        radial-gradient(circle, transparent 10%, rgba(${buttonColor}, 1) 15%, transparent 20%),
        radial-gradient(circle, rgba(${buttonColor}, 1) 20%, transparent 20%),
        radial-gradient(circle, rgba(${buttonColor}, 1) 20%, transparent 20%),
        radial-gradient(circle, rgba(${buttonColor}, 1) 20%, transparent 20%),
        radial-gradient(circle, rgba(${buttonColor}, 1) 20%, transparent 20%);
      background-size: 20% 20%, 40% 40%, 30% 30%, 40% 40%, 36% 36%, 20% 20%, 30% 30%, 20% 20%, 36% 36%;
    }
    
    &:after {
      display: none;
      bottom: -75%;
      background-image:  
        radial-gradient(circle, rgba(${buttonColor}, 1) 20%, transparent 20%), 
        radial-gradient(circle, rgba(${buttonColor}, 1) 20%, transparent 20%),
        radial-gradient(circle, transparent 10%, rgba(${buttonColor}, 1) 15%, transparent 20%),
        radial-gradient(circle, rgba(${buttonColor}, 1) 20%, transparent 20%),
        radial-gradient(circle, rgba(${buttonColor}, 1) 20%, transparent 20%),
        radial-gradient(circle, rgba(${buttonColor}, 1) 20%, transparent 20%),
        radial-gradient(circle, rgba(${buttonColor}, 1) 20%, transparent 20%);
      // background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%;
      background-size: 30% 30%, 40% 40%, 36% 36%, 40% 40%, 30% 30%, 20% 20%, 40% 40%;
    }

    &:active {
      transform: scale(0.9);
      box-shadow: 0 2px 25px rgba(${buttonColor}, 0.2);
    }

    &.animate {
      &:before {
        display: block;
        animation: topBubbles ease-in-out 0.75s forwards;
      }
      &:after {
        display: block;
        animation: bottomBubbles ease-in-out 0.75s forwards;
      }
    }
  }
`

const JokerButton: React.FC<JokerButtonProps> = ({
  count,
  disabled = false,
  action,
  children,
  variant,
  animationVariant = 'default'
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [clientStyles, setClientStyles] = useState<string | null>(null);
  const [jokerButtonVariantDetails, setJokerButtonVariantDetails] = useState<JokerButtonVariantsDetailValueType>()

  // Color mapping for different variants
  /* const variantColors = {
    blue: '0, 100, 255',      // blue-600
    purple: '124, 58, 237',   // purple-600
    yellow: '234, 179, 8',     // yellow-500
    lime: '132, 204, 22',      // lime-500
  } */

  useEffect(() => {
    if (animationVariant === 'bubbly') {
      setClientStyles(getBubblyButtonStyles('234, 179, 8'/* variantColors[variant] */));
    }
  }, [animationVariant, variant]);

  useEffect(() => {
    setJokerButtonVariantDetails(getJokerButtonVariantDetails(variant))
  }, [variant])

  useEffect(() => {
    if (count > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false); // Hide the button if count is 0
    }
  }, [count]);

  const handleClick = () => {
    if (disabled) return;

    setIsClicked(true);
    action();

    // Trigger bubbly animation if applicable
    if (animationVariant === 'bubbly') {
      setTimeout(() => {
        setIsClicked(false);
        if (count < 1) {
          setIsVisible(false)
        }
      }, 700);
    }
  }

  // Function to get animation classes based on variant
  const getAnimationClasses = () => {
    switch (animationVariant) {
      case 'bubbly':
        return `bubbly-button ${isClicked ? 'animate' : ''}`;
      default:
        return '';
    }
  }

  return (
    <>
      {/* Add bubble burst styles */}
      {clientStyles && <style>{clientStyles}</style>}

      {isVisible &&
        <div className='flex flex-row gap-4 items-center'>
          <Button
            variant="outline"
            size="icon"
            onClick={handleClick}
            disabled={disabled || count < 1}
            className={`relative pb-4 h-11
            transition-all duration-300 ease-in-out transform
            ${getAnimationClasses()}
            ${!count || (count && count > 0)
                ? jokerButtonVariantDetails?.enabled
                : jokerButtonVariantDetails?.disabled}
            focus:outline-none focus:ring-0 
            focus:ring-${variant}-500 
            dark:focus:outline-none dark:focus:ring-0
          `}
            title="Get a Hint"
          >
            {children}
            <span className="absolute bottom-0.5 right-0.5 text-xs text-white drop-shadow-sm">
              {count}
            </span>
          </Button>

        </div>}
    </>
  )
}

export default JokerButton