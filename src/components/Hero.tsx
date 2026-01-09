import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="px-6 py-10 flex flex-col items-center text-center">
      <h1 className="text-3xl font-extrabold leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
        Welcome to<br />Your New App
      </h1>
      <p className="text-neutral-400 leading-relaxed max-w-xs">
        Optimized for mobile experience with a sleek, dark aesthetic.
      </p>
      <button className="mt-8 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors active:scale-95 transform duration-100">
        Get Started
      </button>
    </section>
  );
};