import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-black text-white relative shadow-2xl overflow-x-hidden">
      {children}
    </div>
  );
};