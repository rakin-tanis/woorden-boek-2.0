// components/ui/use-toast.tsx
'use client'

import { createContext, useContext, useState } from 'react';

// Toast context interface
interface ToastContextType {
  open: (message: string, type: 'success' | 'error') => void;
  close: () => void;
}

// Create the Toast context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast provider component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error' | null>(null);

  const open = (message: string, type: 'success' | 'error') => {
    setMessage(message);
    setType(type);
  };

  const close = () => {
    setMessage('');
    setType(null);
  };

  return (
    <ToastContext.Provider value={{ open, close }}>
      {children}
      {/* Render toast message based on type */}
      {message && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {message}
          <button
            onClick={close}
            className="absolute top-2 right-2 p-1 rounded-lg bg-gray-200/20 text-gray-800/60"
          >
            X
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
};

// Custom hook to use the Toast context
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};