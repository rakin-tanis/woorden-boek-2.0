'use client'

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`rounded-md bg-indigo-500 px-4 py-2 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};