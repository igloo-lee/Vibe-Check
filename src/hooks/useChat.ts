import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
import { LandingScreenData, Message } from '../types';
import { saveMessage, updateSessionEmail } from '../lib/db';
import { trackEvent } from '../lib/ga';
import { getSystemInstruction } from '../constants/persona';

export const useChat = (userData: LandingScreenData) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [suggestionChips, setSuggestionChips] = useState<string[]>([]);
    const [chatSession, setChatSession] = useState<ChatSession | null>(null);
    const [isChatEnded, setIsChatEnded] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const isInitialized = useRef(false);

    // Common function to process AI response (handles chips and multi-bubble messages)
    const processAiResponse = (responseText: string, sessionId?: number) => {
        let cleanText = responseText;
        let newChips: string[] = [];

        // 1. Parse Chips
        if (responseText.includes('__CHIPS__:')) {
            const parts = responseText.split('__CHIPS__:');
            cleanText = parts[0].trim();
            const chipsPart = parts[1].trim();
            newChips = chipsPart.split('|').map(c => c.trim()).filter(c => c.length > 0);
        }

        // 2. Handle Final Analysis Tag
        if (cleanText.includes('[Final Analysis]')) {
            newChips = [];
            cleanText = cleanText.replace('[Final Analysis]', '').trim();
        }

        // 3. Split by ||| for Multi-bubble
        const textChunks = cleanText.split('|||').map(t => t.trim()).filter(t => t);

        // 4. Sequential Display
        let cumulativeDelay = 0;

        textChunks.forEach((chunk, index) => {
            const isLast = index === textChunks.length - 1;
            // Dynamic delay based on length (min 800ms, max 2000ms)
            const typingDelay = Math.min(800 + chunk.length * 30, 2000);
            cumulativeDelay += typingDelay;

            setTimeout(() => {
                const aiMsg: Message = {
                    id: Date.now() + index,
                    text: chunk,
                    isUser: false,
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, aiMsg]);

                if (sessionId) {
                    saveMessage(sessionId, aiMsg);
                }

                if (isLast) {
                    setIsAiTyping(false);
                    setSuggestionChips(newChips);
                }
            }, cumulativeDelay);
        });
    };

    // Initialize Chat
    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;

        const initChat = async () => {
            // 1. Initial User Worry Message
            const initialUserMsg: Message = {
                id: 1,
                text: userData.worryContent,
                isUser: true,
                timestamp: new Date()
            };
            setMessages([initialUserMsg]);
            setIsAiTyping(true);

            if (userData.sessionId) {
                saveMessage(userData.sessionId, initialUserMsg);
            }

            try {
                // 2. Initialize Gemini AI
                const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
                if (!apiKey) {
                    console.error("API Key missing. Check .env or Vercel Settings.");
                    throw new Error("API Key is missing");
                }

                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-flash-latest",
                    systemInstruction: getSystemInstruction(userData),
                });

                const chat = model.startChat({
                    history: [],
                });
                setChatSession(chat);

                // 3. Send Initial Message to AI
                const result = await chat.sendMessage(userData.worryContent);
                const response = await result.response;
                const responseText = response.text();

                // 4. Process Response
                processAiResponse(responseText, userData.sessionId);

            } catch (error) {
                console.error("AI Init Error:", error);
                setIsAiTyping(false);
                setMessages(prev => [
                    ...prev,
                    {
                        id: 2,
                        text: "API 연결에 실패했습니다. (환경 변수를 확인해주세요) 😭",
                        isUser: false,
                        timestamp: new Date()
                    }
                ]);
            }
        };

        initChat();
    }, [userData]);

    // Handle Send Message
    const sendMessage = async (text?: string) => {
        if (isAiTyping) return;

        const msgToSend = text || inputText;
        if (!msgToSend.trim() || !chatSession) return;

        setSuggestionChips([]);
        const currentUserMsg = msgToSend;

        // Add User Message
        const newMessage: Message = {
            id: Date.now(),
            text: currentUserMsg,
            isUser: true,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
        setInputText('');

        // Check Email (End Chat)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailRegex.test(currentUserMsg)) {
            setIsChatEnded(true);
            setShowToast(true);
            trackEvent('submit_email');

            if (userData.sessionId) {
                await updateSessionEmail(userData.sessionId, currentUserMsg);
            }

            const systemMessage: Message = {
                id: Date.now() + 1,
                text: "이메일 접수 완료. 곧 리포트를 보내줄게. 💌",
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, systemMessage]);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }

        trackEvent('send_message');
        setIsAiTyping(true);
        if (userData.sessionId) saveMessage(userData.sessionId, newMessage);

        // AI Response
        try {
            const result = await chatSession.sendMessage(currentUserMsg);
            const response = await result.response;
            const responseText = response.text();

            processAiResponse(responseText, userData.sessionId);

        } catch (error) {
            console.error("AI Error:", error);
            setIsAiTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요. 😢",
                isUser: false,
                timestamp: new Date()
            }]);
        }
    };

    return {
        messages,
        inputText,
        setInputText,
        isAiTyping,
        suggestionChips,
        isChatEnded,
        showToast,
        sendMessage
    };
};
