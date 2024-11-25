import { useEffect, useRef } from "react";

export const OnScreenKeyboard: React.FC<{
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
}> = ({ onKeyPress, onBackspace, onEnter }) => {
  const keyboardRef = useRef<HTMLDivElement>(null);
  const keyboardRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫']
  ];

  useEffect(() => {
    if (keyboardRef.current) {
      // Set CSS variable for keyboard height
      document.documentElement.style.setProperty(
        '--keyboard-height',
        `${keyboardRef.current.offsetHeight}px`
      );
    }
  }, []);

  return (
    <div
      ref={keyboardRef}
      className="fixed bottom-0 left-0 right-0 
                bg-gray-100 
                dark:bg-gray-900
                p-2 
                flex 
                flex-col 
                space-y-1
                max-h-[33vh]
                overflow-auto
                w-full
                max-w-2xl
                mx-auto
                shadow-lg 
                dark:shadow-xl 
              dark:shadow-gray-900/50
                select-none touch-manipulation"
    >
      {keyboardRows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center gap-1 w-full"
        >
          {row.map(key => key.toUpperCase()).map((key) => (
            <button
              key={key}
              onClick={() =>
                key === '⌫' ? onBackspace() :
                  key === '↵' ? onEnter() :
                    onKeyPress(key)
              }
              className={`
                flex-1 
                ${['⌫', '↵'].includes(key)
                  ? 'bg-gray-300 dark:bg-gray-600 font-bold'
                  : 'bg-white dark:bg-gray-700 border dark:border-gray-600'}
                py-3 
                rounded 
                text-lg 
                text-gray-800 
                dark:text-gray-100
                active:bg-gray-200 
                dark:active:bg-gray-600
                transition-colors 
                duration-100
                ${key === '⌫' || key === '↵' ? 'min-w-[10%]' : ''}
                select-none 
                touch-manipulation
                active:hover:scale-150
              `}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};