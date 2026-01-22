
import React from 'react';

interface HeaderProps {
    userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  return (
    <header className="sticky top-0 bg-white z-40 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-gray-800">
                KCIS DAA Gathering
            </div>
            <div className="text-base font-medium text-gray-600">
                Ordering as <span className="font-bold text-gray-900">{userName}</span>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
