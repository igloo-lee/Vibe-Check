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
                if (!apiKey) throw new Error("API Key is missing");

                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({
                    model: "gemini-flash-latest",
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

                // 4. Parse Chips
                let cleanText = responseText;
                let newChips: string[] = [];

                if (responseText.includes('__CHIPS__:')) {
                    const parts = responseText.split('__CHIPS__:');
                    cleanText = parts[0].trim();
                    const chipsPart = parts[1].trim();
                    newChips = chipsPart.split('|').map(c => c.trim()).filter(c => c.length > 0);
                }

                // 5. Update UI (Delayed)
                setSuggestionChips(newChips);

                const aiResponse: Message = {
                    id: 2,
                    text: cleanText,
                    isUser: false,
                    timestamp: new Date()
                };

                const delay = Math.random() * 1000 + 1500;
                setTimeout(() => {
                    setMessages(prev => [...prev, aiResponse]);
                    setIsAiTyping(false);
                    if (userData.sessionId) saveMessage(userData.sessionId, aiResponse);
                }, delay);

            } catch (error) {
                console.error("AI Init Error:", error);
                setIsAiTyping(false);
                setMessages(prev => [
                    ...prev,
                    {
                        id: 2,
                        text: "API 연결에 실패했습니다. (API Key 또는 네트워크를 확인해주세요) 😭",
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

            let cleanText = responseText;
            let newChips: string[] = [];
            if (responseText.includes('__CHIPS__:')) {
                const parts = responseText.split('__CHIPS__:');
                cleanText = parts[0].trim();
                const chipsPart = parts[1].trim();
                newChips = chipsPart.split('|').map(c => c.trim()).filter(c => c.length > 0);
            }

            if (cleanText.includes('[Final Analysis]')) {
                newChips = [];
                // [Final Analysis] 태그 제거
                cleanText = cleanText.replace('[Final Analysis]', '').trim();
            }

            setSuggestionChips(newChips);

            const aiResponse: Message = {
                id: Date.now() + 1,
                text: cleanText,
                isUser: false,
                timestamp: new Date()
            };

            const delay = Math.random() * 1500 + 1000;
            setTimeout(() => {
                setMessages(prev => [...prev, aiResponse]);
                setIsAiTyping(false);
                if (userData.sessionId) saveMessage(userData.sessionId, aiResponse);
            }, delay);

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
