"use client"

import React, { useEffect, useState } from 'react'
import { Button } from './ui/Button'

interface JokerButtonProps {
  count?: number,
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant: keyof typeof buttonVariants;
  animationVariant?: 'bubble' | 'scale' | 'glow-press' | 'bubbly' | 'default';
}

const buttonVariants = {
  blue: {
    enabled: "text-white bg-blue-600 border-0 hover:text-blue-400 hover:bg-blue-200 hover:border-0",
    disabled: "bg-blue-300 text-white cursor-not-allowed opacity-50"
  },
  purple: {
    enabled: "text-white bg-purple-600 border-0 hover:text-purple-400 hover:bg-purple-200 hover:border-0",
    disabled: "border border-blue-300 text-blue-300 cursor-not-allowed opacity-50"
  },
  yellow: {
    enabled: "text-white bg-yellow-500 border-0 hover:text-yellow-400 hover:bg-yellow-200 hover:border-0",
    disabled: "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
  }
}

// Bubble burst animation styles
const getBubbleStyles = () => `
  @keyframes bubble-burst {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.7;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  .bubble-burst {
    position: relative;
    // overflow: hidden;
  }

  .bubble-burst::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    animation: bubble-burst 0.6s ease-out;
  }

  .bubble-burst:active::after {
    width: 200%;
    height: 200%;
  }
`

const getGlowPressStyles = () => `
  .glow-press {
    position: relative;
    transition-duration: 0.4s;
    transition-property: background-color;
    // overflow: hidden;
  }

  .glow-press:hover {
    transition-duration: 0.1s;
  }

  .glow-press::after {
    content: "";
    display: block;
    position: absolute;
    border-radius: 4em;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.5s;
    box-shadow: 0 0 10px 40px rgba(255, 255, 255, 0.5);
  }

  .glow-press:active::after {
    box-shadow: 0 0 0 0 white;
    position: absolute;
    border-radius: 4em;
    left: 0;
    top: 0;
    opacity: 1;
    transition: 0s;
  }

  .glow-press:active {
    transform: translateY(1px);
  }
`

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
  onClick,
  children,
  variant,
  animationVariant = 'default'
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [clientStyles, setClientStyles] = useState<string | null>(null);

  // Color mapping for different variants
  const variantColors = {
    blue: '0, 100, 255',      // blue-600
    purple: '124, 58, 237',   // purple-600
    yellow: '234, 179, 8'     // yellow-500
  }

  useEffect(() => {
    if (animationVariant === 'glow-press') {
      setClientStyles(getGlowPressStyles());
    }
    else if (animationVariant == 'bubble') {
      setClientStyles(getBubbleStyles());
    }
    else if (animationVariant === 'bubbly') {
      setClientStyles(getBubblyButtonStyles(variantColors[variant]));
    }
  }, [animationVariant, variant]);

  const handleClick = () => {
    if (disabled) return;

    setIsClicked(true);
    onClick();

    // Trigger bubbly animation if applicable
    if (animationVariant === 'bubbly') {
      setTimeout(() => {
        setIsClicked(false);
      }, 700);
    } else {
      setTimeout(() => {
        setIsClicked(false);
      }, 300);
    }
  }

  // Function to get animation classes based on variant
  const getAnimationClasses = () => {
    switch (animationVariant) {
      case 'bubble':
        return 'bubble-burst';
      case 'scale':
        return `
          ${isClicked
            ? 'scale-90 opacity-80 shadow-sm'
            : 'hover:scale-105'}
          active:scale-90
        `;
      case 'glow-press':
        return 'glow-press';
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

      <div className='flex flex-row gap-4 items-center'>
        <Button
          variant="outline"
          size="icon"
          onClick={handleClick}
          disabled={disabled}
          className={`
            transition-all duration-300 ease-in-out transform
            ${getAnimationClasses()}
            ${!count || (count && count > 0)
              ? buttonVariants[variant].enabled
              : buttonVariants[variant].disabled}
            focus:outline-none focus:ring-0 
            focus:ring-${variant}-500 
            dark:focus:outline-none dark:focus:ring-0
          `}
          title="Get a Hint"
        >
          {children}
        </Button>
        <span className="text-base">
          {count ? count : <span>&#8734;</span>}
        </span>
      </div>
    </>
  )
}

export default JokerButton