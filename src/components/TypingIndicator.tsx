import React from 'react';

export const TypingIndicator: React.FC = () => {
    return (
        <div className="flex items-center justify-center gap-1 p-3 w-16 h-10 bg-[#262626] rounded-2xl rounded-tl-sm">
            <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
        </div>
    );
};
