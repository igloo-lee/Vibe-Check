import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
    onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { delayChildren: 0.3 }
        },
        exit: {
            opacity: 0,
            y: -20,
            filter: "blur(5px)",
            transition: { duration: 0.5 }
        }
    };

    const letterVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.2 + (i * 0.08), // 더 빠른 간격
                duration: 0.4,
                ease: "easeOut" // 부드러운 등장
            }
        })
    };

    const handleStepComplete = () => {
        if (step === 1) {
            setTimeout(() => setStep(2), 1000); // 1.5초 -> 1.0초로 단축
        } else if (step === 2) {
            setTimeout(() => onComplete(), 1500); // 1.5초 유지
        }
    };

    const renderText = (text: string, isBold = false, shouldTriggerComplete = false) => (
        <div className="flex justify-center flex-wrap">
            {text.split("").map((char, i) => (
                <motion.span
                    key={`${text}-${i}`}
                    custom={i}
                    variants={letterVariants}
                    onAnimationComplete={
                        (shouldTriggerComplete && i === text.length - 1)
                            ? handleStepComplete
                            : undefined
                    }
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
                        key="step1"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="text-2xl md:text-3xl text-center leading-relaxed"
                    >
                        {renderText("그 사람 마음이 궁금해?", false, true)}
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="text-3xl md:text-4xl text-center leading-relaxed"
                    >
                        <div className="flex flex-col gap-2 items-center">
                            <motion.span
                                custom={0}
                                variants={letterVariants}
                                className="font-bold text-white text-3xl md:text-4xl"
                            >
                                그럼
                            </motion.span>
                            {renderText("Vibe Check 해!", true, true)}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
