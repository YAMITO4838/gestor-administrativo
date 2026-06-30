import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/35 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`premium-card premium-animate relative flex max-h-[90vh] w-full ${sizeClasses[size]} flex-col overflow-hidden shadow-premium`}
      >
        <div className="flex items-center justify-between border-b border-stone-200 p-6">
          <h2 className="text-lg font-extrabold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="premium-icon-button"
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
