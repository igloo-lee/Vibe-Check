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
            transition: { delayChildren: 0.5 }
        },
        exit: {
            opacity: 0,
            y: -20,
            filter: "blur(10px)",
            transition: { duration: 0.8 }
        }
    };

    const letterVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.5 + (i * 0.12), // 딜레이 직접 계산
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        })
    };

    const handleStepComplete = () => {
        if (step === 1) {
            setTimeout(() => setStep(2), 2500);
        } else if (step === 2) {
            setTimeout(() => onComplete(), 2500);
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
                        // 마지막 글자이고, 완료 트리거가 필요할 때만 실행
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
                                className="font-bold text-white text-2xl"
                            >
                                그럼
                            </motion.span>
                            {/* 두 번째 줄은 '그럼'(글자1개 취급시) 다음부터 나와야 하므로 delay 보정 필요할 수 있으나, 
                                단순하게 '그럼' + 딜레이 로직보다는 문구 전체를 트리거로 사용 */}
                            {renderText("Vibe Check 해!", true, true)}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
