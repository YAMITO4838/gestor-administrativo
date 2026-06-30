import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => (
  <div
    className={`animate-spin rounded-full border-2 border-stone-200 border-t-[#b5965b] ${sizeMap[size]} ${className}`}
  />
);

export default Spinner;
