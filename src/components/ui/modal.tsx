'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, className = '' }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] p-2">
      <div
        ref={overlayRef}
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className={`relative bg-[#EDF0F8] rounded-xl shadow-xl w-full max-h-[90vh] flex flex-col px-4 md:px-10 pb-6 md:pb-10 ${className}`}>
        <div className="flex items-start justify-between px-4 md:px-8   py-8 rounded-t-2xl border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[#051438] leading-[100%]">{title}</h2>
            {description && <p className="text-sm font-semibold leading-[100%] text-[#677597] mt-2">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-[#DFE2E9] cursor-pointer"
            title="Close modal"
          >
            <Image src="/images/x.svg" alt="Close" width={20} height={20} />
          </button>
        </div>
        <div className=" overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
