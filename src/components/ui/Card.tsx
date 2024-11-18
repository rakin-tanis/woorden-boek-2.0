import { HTMLAttributes, ReactNode } from 'react';
import React, { forwardRef } from 'react';


interface BaseProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
}

export interface CardProps extends BaseProps {
  // Add any card-specific props here
  color?: string;
}

export interface CardHeaderProps extends BaseProps {
  // Add any header-specific props here
  color?: string;
}

export interface CardTitleProps extends BaseProps {
  // Add any title-specific props here
  color?: string;
}

export interface CardDescriptionProps extends BaseProps {
  // Add any description-specific props here
  color?: string;
}

export interface CardContentProps extends BaseProps {
  // Add any content-specific props here
  color?: string;
}

export interface CardFooterProps extends BaseProps {
  // Add any footer-specific props here
  color?: string;
}



const Card = forwardRef<HTMLDivElement, CardProps>(({ 
  className = '', 
  children, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`rounded-lg border border-gray-200 bg-white shadow-sm 
        transition-all duration-200 
        hover:shadow-md 
        dark:border-gray-800 dark:bg-gray-950 
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

const CardHeader: React.FC<CardHeaderProps> = ({ 
  className = '', 
  children, 
  ...props 
}) => {
  return (
    <div
      className={`flex flex-col space-y-1.5 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle: React.FC<CardTitleProps> = ({ 
  className = '', 
  children, 
  ...props 
}) => {
  return (
    <h3
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription: React.FC<CardDescriptionProps> = ({ 
  className = '', 
  children, 
  ...props 
}) => {
  return (
    <p
      className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

const CardContent: React.FC<CardContentProps> = ({ 
  className = '', 
  children, 
  ...props 
}) => {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter: React.FC<CardFooterProps> = ({ 
  className = '', 
  children, 
  ...props 
}) => {
  return (
    <div
      className={`flex items-center p-6 pt-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
