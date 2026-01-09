import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
    onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);

    useEffect(() => {
        // Step 1: 첫 번째 문구 (2.5초 유지)
        if (step === 1) {
            const timer = setTimeout(() => setStep(2), 1500);
            return () => clearTimeout(timer);
        }
        // Step 2: 두 번째 문구 (2.5초 유지 후 종료)
        if (step === 2) {
            const timer = setTimeout(() => {
                onComplete();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [step, onComplete]);

    const textVariants = {
        hidden: { opacity: 0 },
        visible: (i: number) => ({
            opacity: 1,
            transition: {
                delay: i * 0.1, // 글자당 0.1초 딜레이
                duration: 0.05,
            },
        }),
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.5 }
        }
    };

    const renderText = (text: string, isBold = false) => (
        <div className="flex justify-center overflow-hidden">
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    custom={i}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`inline-block ${char === " " ? "w-2" : ""} ${isBold ? "font-extrabold text-[#3797EF]" : "font-bold text-white"}`}
                >
                    {char}
                </motion.span>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-6">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="text1"
                        className="text-2xl md:text-3xl text-center leading-relaxed"
                        exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
                    >
                        {renderText("그 사람 마음이 궁금해?")}
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="text2"
                        className="text-3xl md:text-4xl text-center leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.8 } }}
                    >
                        {/* '그럼'은 흰색, 'Vibe Check'부터는 색상 강조 */}
                        <div className="flex flex-col gap-2 items-center">
                            <span className="font-bold text-white text-2xl">그럼</span>
                            {renderText("Vibe Check 해!", true)}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
