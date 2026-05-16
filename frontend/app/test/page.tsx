"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ThemeCard from "../../components/ThemeCard";
import { getThemes } from "../../lib/api";

// --- Types and Constants ---
interface Theme { id: string; name: string; }
type Match = [Theme, Theme];
type Round = Match[];

const codeSnippet = `import React, { useState, useEffect } from 'react';

// A custom hook for fetching data
function useUserData(userId: string) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(\`https://api.example.com/users/\${userId}\`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);
  return { user, loading };
}

// A simple profile component
export default function UserProfile({ userId }: { userId: string }) {
  const { user, loading } = useUserData(userId);
  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>User not found.</div>;
  return (
    <div className="profile-card">
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}`;

const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- Animation Variants ---
const pageVariants = {
  initial: { opacity: 0, scale: 0.98, filter: "blur(10px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 1.02, filter: "blur(10px)" },
};

const matchContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

// --- Component ---
export default function TestPage() {
  const router = useRouter();
  
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [roundWinners, setRoundWinners] = useState<Theme[]>([]);
  const [finalMatch, setFinalMatch] = useState<Match | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeTournament = useCallback(async () => {
    setLoading(true);
    try {
      const allThemes = await getThemes();
      if (allThemes.length < 32) throw new Error("Требуется 32 темы.");
      const shuffledThemes = shuffleArray(allThemes);
      const firstRound: Round = [];
      for (let i = 0; i < shuffledThemes.length; i += 2) {
        if (!shuffledThemes[i + 1]) break;
        firstRound.push([shuffledThemes[i], shuffledThemes[i + 1]]);
      }
      setRounds([firstRound]);
      setCurrentRoundIndex(0);
      setCurrentMatchIndex(0);
      setRoundWinners([]);
      setFinalMatch(null);
      setError(null);
    } catch (e: any) {
      setError(`Не удалось начать турнир: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeTournament();
  }, [initializeTournament]);

  const handleThemeSelect = (winner: Theme) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
        const newWinners = [...roundWinners, winner];
        if (currentMatchIndex + 1 >= rounds[currentRoundIndex].length) {
            if (finalMatch) {
                const runnerUp = finalMatch.find(t => t.id !== winner.id);
                localStorage.setItem('tournamentResults', JSON.stringify({ winner, runnerUp }));
                router.push("/result");
                return;
            }
            const nextRound: Round = [];
            for (let i = 0; i < newWinners.length; i += 2) {
                if (!newWinners[i+1]) break;
                nextRound.push([newWinners[i], newWinners[i + 1]]);
            }
            if (nextRound.length === 1) setFinalMatch(nextRound[0]);
            
            setRounds(prev => [...prev, nextRound]);
            setCurrentRoundIndex(prev => prev + 1);
            setCurrentMatchIndex(0);
            setRoundWinners([]);
        } else {
            setCurrentMatchIndex(prev => prev + 1);
            setRoundWinners(newWinners);
        }
        setIsTransitioning(false);
    }, 400);
  };
  
  const getRoundName = (totalMatches: number) => {
    if (totalMatches === 1) return "Финал";
    if (totalMatches === 2) return "Полуфинал";
    if (totalMatches === 4) return "Четвертьфинал";
    return `Раунд 1/${totalMatches}`;
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;
  if (error) return <div className="flex flex-col items-center justify-center min-h-screen text-red-500"><p>{error}</p><button onClick={initializeTournament}>Попробовать снова</button></div>;
  
  const currentMatch = rounds[currentRoundIndex]?.[currentMatchIndex];
  if (!currentMatch) return <div className="flex items-center justify-center min-h-screen">Создание раунда...</div>;

  const totalMatchesInRound = rounds[currentRoundIndex].length;
  const roundName = getRoundName(totalMatchesInRound);
  const progress = totalMatchesInRound > 0 ? (currentMatchIndex / totalMatchesInRound) * 100 : 0;
  const pairId = currentMatch[0].id + currentMatch[1].id;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentRoundIndex}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center min-h-screen text-gray-900 dark:text-gray-100 p-4 bg-[#0f0f0f] px-4 sm:px-6 lg:px-10 py-6 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{roundName}</h2>
            <p className="text-lg sm:text-xl text-gray-400">Матч {currentMatchIndex + 1}/{totalMatchesInRound}</p>
        </div>

        <div className="w-full max-w-3xl lg:max-w-4xl mb-8 bg-gray-700 rounded-full h-2">
            <motion.div className="bg-blue-600 h-2 rounded-full" animate={{ width: `${progress}%` }} />
        </div>

        <motion.div
          key={pairId}
          variants={matchContainerVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 w-full max-w-6xl 2xl:max-w-screen-xl"
        >
          <ThemeCard
            theme={currentMatch[0]}
            code={codeSnippet}
            onSelect={() => handleThemeSelect(currentMatch[0])}
            position="left"
          />
          <ThemeCard
            theme={currentMatch[1]}
            code={codeSnippet}
            onSelect={() => handleThemeSelect(currentMatch[1])}
            position="right"
          />
        </motion.div>

        <div className="mt-8">
          <Link href="/">
            <motion.button 
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gray-700 text-gray-200 rounded-lg shadow hover:bg-gray-600"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              На главную
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}