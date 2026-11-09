import React from 'react';
import { Volume2 } from 'lucide-react';
import { playPronunciation } from '../../utils/speech';

interface PronunciationButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PronunciationButton: React.FC<PronunciationButtonProps> = ({
  text,
  className = '',
  size = 'md',
}) => {
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (text) {
      playPronunciation(text);
    }
  };

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const padding = size === 'sm' ? 'p-1.5' : size === 'lg' ? 'p-2.5' : 'p-2';

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`inline-flex items-center justify-center ${padding} rounded-full bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0 ${className}`}
      title="Phát âm chuẩn tiếng Anh"
      aria-label={`Phát âm ${text}`}
    >
      <Volume2 className={iconSize} />
    </button>
  );
};
