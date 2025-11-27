import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'outline';
}

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
    const baseStyles = "flex items-center justify-center gap-4 px-6 py-3 rounded-xl font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-[#0B0C7D] hover:bg-[#080a5e] text-white focus:ring-blue-900 cursor-pointer",
        outline: "border border-[#0B0C7D] text-[#0B0C7D] hover:bg-blue-50 focus:ring-blue-900 bg-transparent cursor-pointer"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
