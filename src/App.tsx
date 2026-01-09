import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { LandingScreen } from './screens/LandingScreen';
import { ChatScreen } from './screens/ChatScreen';
import { LandingScreenData } from './types';
import { createSession } from './lib/db';

const App: React.FC = () => {
  console.log("App Component Rendering");
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'chat'>('landing');
  const [userData, setUserData] = useState<LandingScreenData | null>(null);

  const handleStart = async (data: LandingScreenData) => {
    // Create DB session quietly (don't block UI strictly, or block if critical)
    // For better data integrity, we wait for session creation.
    const sessionId = await createSession(data);
    const dataWithSession = { ...data, sessionId: sessionId || undefined };

    setUserData(dataWithSession);
    setCurrentScreen('chat');
  };

  const handleBack = () => {
    setCurrentScreen('landing');
    setUserData(null);
  };

  return (
    <Layout>
      {currentScreen === 'landing' && <Header />}
      <div className="relative w-full min-h-screen">
        <AnimatePresence mode="wait">
          {currentScreen === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full"
            >
              <LandingScreen onStart={handleStart} />
            </motion.div>
          ) : (
            userData && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full min-h-screen"
              >
                <ChatScreen userData={userData} onBack={handleBack} />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );

};

export default App;