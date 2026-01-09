import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

const RELATIONSHIP_OPTIONS = ['썸', '짝사랑', 'ex', '학교 선배', '직장 상사', '기타'];
const GENDER_OPTIONS = ['남자', '여자', '성소수자', '기타'];

import { LandingScreenData } from '../types';
import { trackEvent } from '../lib/ga';

interface LandingScreenProps {
  onStart: (data: LandingScreenData) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  console.log("LandingScreen Rendering");
  const [formData, setFormData] = useState<LandingScreenData>({
    myNickname: '',
    gender: '남자',
    partnerName: '',
    relationship: '썸',
    worryContent: ''
  });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(prev => prev === name ? null : name);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.myNickname.trim() || !formData.partnerName.trim() || !formData.worryContent.trim() || !formData.gender) {
      alert('모든 내용을 입력해주세요!');
      return;
    }
    trackEvent('start_chat', { relationship: formData.relationship });
    onStart(formData);
  };

  return (
    <div className="flex flex-col items-center px-6 py-8 w-full animate-in fade-in duration-500">
      {/* Header Design */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <img
            src="/images/profile_new.jpg"
            alt="Shasha"
            className="w-24 h-24 rounded-full border-2 border-purple-500 object-cover shadow-lg shadow-purple-500/20"
          />
        </div>
        <h1 className="text-[24px] font-bold mt-4 text-white tracking-tight">
          Mind Hacker
        </h1>
        <p className="text-[14px] text-gray-400 mt-2 text-center">
          그 사람의 속마음이 궁금해?
        </p>
      </div>

      {/* Input Form Card */}
      <div className="w-full bg-[#1c1c1c] rounded-2xl p-6 shadow-xl border border-neutral-800 mb-8 space-y-5">

        {/* My Nickname */}
        <div className="space-y-2">
          <label className="text-xs text-white font-medium ml-1">나의 닉네임</label>

          <input
            type="text"
            name="myNickname"
            value={formData.myNickname}
            onChange={handleChange}
            placeholder="예: 고갤러"
            className="w-full bg-neutral-900 text-white border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-neutral-400"
          />
        </div>

        {/* My Gender */}
        <div className="space-y-2 relative">
          <label className="text-xs text-white font-medium ml-1">나의 성별</label>
          <div className="relative">
            <button
              onClick={() => toggleDropdown('gender')}
              className={`w-full bg-neutral-900 text-white border rounded-xl px-4 py-3 text-sm flex items-center justify-between transition-all duration-200 ${activeDropdown === 'gender'
                ? 'border-purple-500 ring-1 ring-purple-500'
                : 'border-neutral-700 hover:border-neutral-600'
                }`}
            >
              <span className="text-white">{formData.gender}</span>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${activeDropdown === 'gender' ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {activeDropdown === 'gender' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-50 w-full mt-2 bg-[#1c1c1c] border border-neutral-700 rounded-xl shadow-xl overflow-hidden"
                >
                  {GENDER_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, gender: option }));
                        setActiveDropdown(null);
                      }}
                      className="w-full px-4 py-3 text-sm text-left text-white hover:bg-neutral-800 flex items-center justify-between transition-colors first:border-0 border-t border-neutral-800"
                    >
                      <span>{option}</span>
                      {formData.gender === option && (
                        <Check size={14} className="text-purple-500" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Partner Name */}
        <div className="space-y-2">
          <label className="text-xs text-white font-medium ml-1">상대방 이름</label>
          <input
            type="text"
            name="partnerName"
            value={formData.partnerName}
            onChange={handleChange}
            placeholder="예: 김민지"
            className="w-full bg-neutral-900 text-white border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-neutral-400"
          />
        </div>

        {/* Relationship Status */}
        <div className="space-y-2 relative">
          <label className="text-xs text-white font-medium ml-1">현재 관계</label>
          <div className="relative">
            <button
              onClick={() => toggleDropdown('relationship')}
              className={`w-full bg-neutral-900 text-white border rounded-xl px-4 py-3 text-sm flex items-center justify-between transition-all duration-200 ${activeDropdown === 'relationship'
                ? 'border-purple-500 ring-1 ring-purple-500'
                : 'border-neutral-700 hover:border-neutral-600'
                }`}
            >
              <span className={formData.relationship ? "text-white" : "text-neutral-500"}>
                {formData.relationship || "관계를 선택해주세요"}
              </span>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${activeDropdown === 'relationship' ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {activeDropdown === 'relationship' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-50 w-full mt-2 bg-[#1c1c1c] border border-neutral-700 rounded-xl shadow-xl overflow-hidden"
                >
                  {RELATIONSHIP_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, relationship: option }));
                        setActiveDropdown(null);
                      }}
                      className="w-full px-4 py-3 text-sm text-left text-white hover:bg-neutral-800 flex items-center justify-between transition-colors first:border-0 border-t border-neutral-800"
                    >
                      <span>{option}</span>
                      {formData.relationship === option && (
                        <Check size={14} className="text-purple-500" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Worry Content */}
        <div className="space-y-2">
          <label className="text-xs text-white font-medium ml-1">고민을 자세히 적어줘 :)</label>
          <textarea
            name="worryContent"
            value={formData.worryContent}
            onChange={handleChange}
            placeholder="카카오톡 답장도 빠르고 인스타그램 DM으로는 한없이 다정한데 자꾸 남자랑 같이 있는 인스타 스토리를 올려. 도대체 무슨 작전인지 모르겠음. 내 착각인가?"
            className="w-full bg-neutral-900 text-white border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-neutral-400 min-h-[100px] resize-none"
          />
        </div>

      </div>

      {/* Action Button */}
      <button
        onClick={handleSubmit}
        className="w-full h-[50px] bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:opacity-95 active:scale-[0.98] transition-all duration-200"
      >
        분석 시작
      </button>
    </div>
  );
};