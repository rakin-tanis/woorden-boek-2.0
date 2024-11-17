import React from 'react';

interface HighlightTextProps {
  searchText: string;
  targetText: string;
  highlightColor?: string;
  caseSensitive?: boolean;
  className?: string;
  highlightClassName?: string;
}

const HighlightText: React.FC<HighlightTextProps> = ({
  searchText,
  targetText,
  highlightColor = 'yellow',
  caseSensitive = false,
  className = '',
  highlightClassName = ''
}) => {
  // If searchText is empty or undefined, return the original text
  if (!searchText) {
    return <span className={className}>{targetText}</span>;
  }

  // Escape special regex characters
  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Create a regular expression based on case sensitivity
  const createRegex = (): RegExp => {
    const escapedSearchText = escapeRegExp(searchText);
    return new RegExp(`(${escapedSearchText})`, caseSensitive ? '' : 'gi');
  };

  // Function to check if a part matches the search text
  const isMatch = (part: string): boolean => {
    if (caseSensitive) {
      return part === searchText;
    }
    return part.toLowerCase() === searchText.toLowerCase();
  };

  // Split the text into parts
  const regex = createRegex();
  const parts = targetText.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const match = isMatch(part);
        
        return match ? (
          <mark
            key={index}
            className={highlightClassName}
            style={{ 
              backgroundColor: highlightColor,
              padding: '0.1em 0.2em',
              borderRadius: '3px'
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </span>
  );
};

export default HighlightText;