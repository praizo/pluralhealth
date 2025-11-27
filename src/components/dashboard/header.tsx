'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';

export function Header() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    const initialUpdate = setTimeout(() => setCurrentDate(new Date()), 0);
    return () => {
      clearInterval(timer);
      clearTimeout(initialUpdate);
    };
  }, []);

  // Prevent hydration mismatch by not rendering date until client-side
  if (!currentDate) {
    return (
      <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b-2 border-gray-200 h-[74px]">
        <div className="flex items-center gap-2">
          <Image src="/images/ph-logo.svg" alt="Plural Health Logo" width={80} height={24} />
        </div>
      </header>
    );
  }

  return (
    <header className="relative bg-white border-b-2 border-gray-200">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        <div className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <Image src="/images/ph-logo.svg" alt="Plural Health Logo" width={80} height={24} />
        </div>

        {/* Desktop Date/Time */}
        <div className="hidden md:flex items-center gap-4 text-gray-600 font-medium">
          <span className="custom-text-400 txt-primary">{format(currentDate, 'd MMMM')}</span>
          <span className='font-semibold text-lg leading-5 tracking-normal' >{format(currentDate, 'hh:mm a')}</span>
        </div>

        {/* Desktop User Info */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="custom-text-400 txt-primary">Hi Mr Daniel</span>
          </div>

          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full" aria-label="Notifications">
            <Image src="/images/bell.svg" alt="Notifications" width={20} height={20} />
          </button>

          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            {/* User Avatar Placeholder */}
            <Image src="/images/user.svg" alt="User" width={20} height={20} />
          </div>
        </div>

        {/* Mobile Menu Button & Icons */}
        <div className="flex md:hidden items-center gap-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full" aria-label="Notifications">
            <Image src="/images/bell.svg" alt="Notifications" width={20} height={20} />
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 p-4 space-y-4 animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2 text-gray-600 font-medium">
            <div className="flex justify-between items-center">
              <span className="custom-text-400 txt-primary">{format(currentDate, 'd MMMM')}</span>
              <span className='font-semibold text-lg leading-5 tracking-normal'>{format(currentDate, 'hh:mm a')}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              <Image src="/images/user.svg" alt="User" width={20} height={20} />
            </div>
            <span className="custom-text-400 txt-primary">Hi Mr Daniel</span>
          </div>
        </div>
      )}
    </header>
  );
}



