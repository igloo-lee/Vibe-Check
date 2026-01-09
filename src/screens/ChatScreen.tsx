import React, { useRef, useEffect } from 'react';
import { ChevronLeft, Phone, Video, BadgeCheck, Camera, Mic, ImageIcon } from 'lucide-react';
import { LandingScreenData } from '../types';
import { TypingIndicator } from '../components/TypingIndicator';
import { useChat } from '../hooks/useChat';

interface ChatScreenProps {
  userData: LandingScreenData;
  onBack: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ userData, onBack }) => {
  const {
    messages,
    inputText,
    setInputText,
    isAiTyping,
    suggestionChips,
    isChatEnded,
    showToast,
    sendMessage
  } = useChat(userData);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic (UI concern)
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [messages, isAiTyping]);

  return (
    <div className="flex flex-col h-screen bg-black text-white">

      {/* Top Navigation */}
      <div className="flex items-center justify-between px-4 py-3 bg-black border-b-0 sticky top-0 z-10">
        <button onClick={onBack} className="p-1 -ml-2">
          <ChevronLeft size={32} className="text-white" />
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[17px] text-white">MindHacker_Shasha</span>
            <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500/10" strokeWidth={3} />
          </div>
          <span className="text-[12px] text-gray-500">shashainseoul</span>
        </div>

        <div className="flex items-center gap-6 mr-1">
          <Phone size={26} className="text-white" />
          <Video size={28} className="text-white" />
        </div>
      </div>

      {/* Message List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 scrollbar-hide pt-2"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.isUser ? 'justify-end' : 'justify-start items-end gap-2'}`}
          >
            {!msg.isUser && (
              <img
                src="/images/profile_new.jpg"
                alt="AI"
                className="w-8 h-8 rounded-full object-cover mb-1"
              />
            )}

            <div
              className={`max-w-[75%] px-4 py-3 text-[15px] leading-snug whitespace-pre-wrap break-words
                ${msg.isUser
                  ? 'bg-gradient-to-r from-[#7000FF] to-[#A230ED] text-white rounded-[22px] rounded-br-sm'
                  : 'bg-[#262626] text-white rounded-[22px] rounded-tl-sm'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isAiTyping && (
          <div className="flex justify-start items-end gap-2">
            <img
              src="/images/profile_new.jpg"
              alt="AI"
              className="w-8 h-8 rounded-full object-cover mb-1"
            />
            <div className="flex items-center">
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="w-full bg-black flex flex-col pt-2 pb-6 shrink-0 z-20 safe-area-bottom">

        {/* Suggestion Chips */}
        {!isAiTyping && !isChatEnded && suggestionChips.length > 0 && (
          <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide mask-gradient-x">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(chip)}
                className="flex-shrink-0 bg-neutral-900/80 backdrop-blur-md border border-white/10 text-white/90 px-4 py-2.5 rounded-full text-[13px] font-medium tracking-wide shadow-sm hover:bg-neutral-800 hover:border-white/20 transition-all active:scale-95"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input Controls & Chat Ended UI */}
        {isChatEnded ? (
          <div className="px-4 py-2 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center text-gray-400 text-sm mb-1">
              상담이 완료되었습니다. 이메일을 확인해주세요! 💌
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#3797EF] text-white font-bold py-3.5 rounded-xl hover:bg-blue-600 transition-colors active:scale-95 shadow-lg shadow-blue-500/20"
            >
              다른 고민 또 상담하기 (처음으로)
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-3">
            <div className="flex items-center gap-3 shrink-0">
              <button className="text-white hover:opacity-80 transition">
                <Camera size={26} />
              </button>
              <button className="text-white hover:opacity-80 transition">
                <Mic size={26} />
              </button>
              <button className="text-white hover:opacity-80 transition">
                <ImageIcon size={26} />
              </button>
            </div>

            <div className="flex-1 bg-[#262626] rounded-full h-[44px] flex items-center px-5 transition-all focus-within:ring-1 focus-within:ring-gray-700">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="메시지 보내기..."
                className="flex-1 bg-transparent text-white text-[15px] focus:outline-none placeholder:text-neutral-500"
              />
              {inputText.length > 0 && (
                <button
                  onClick={() => sendMessage()}
                  className="text-[#3797f0] font-semibold text-sm ml-2"
                >
                  보내기
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur text-black px-6 py-3 rounded-full shadow-2xl z-50 animate-in fade-in zoom-in duration-300 flex items-center gap-2">
          <span>📨</span>
          <span className="font-semibold text-sm">시크릿 리포트 발송 완료!</span>
        </div>
      )}
    </div>
  );
};