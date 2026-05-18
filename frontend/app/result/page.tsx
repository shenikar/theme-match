"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

interface Theme {
  id: string;
  name: string;
}

interface TournamentResults {
  winner: Theme;
  runnerUp: Theme;
}

export default function ResultPage() {
  const router = useRouter();
  const [results, setResults] = useState<TournamentResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Эффект конфетти и звук
    const audio = new Audio("/win.mp3");
    audio.play().catch(e => console.error("Audio play failed:", e));
    
    setSize({ width: window.innerWidth, height: window.innerHeight });

    // Получаем результаты из localStorage
    const storedResults = localStorage.getItem('tournamentResults');
    if (storedResults) {
      try {
        setResults(JSON.parse(storedResults));
      } catch (e) {
        setError("Не удалось прочитать результаты турнира.");
      }
    } else {
      setError("Результаты турнира не найдены. Пожалуйста, пройдите тест.");
    }
    setLoading(false);
  }, []);

  const handleRetakeTest = () => {
    router.push("/test");
  };

  const copyToClipboard = (text: string | undefined, themeId: string) => {
    if (!navigator.clipboard) {
      alert("Функция копирования не доступна.");
      return;
    }
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(themeId);
        setTimeout(() => setCopied(null), 2000);
      }).catch(err => console.error("Failed to copy:", err));
    }
  };
  
  if (loading) return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;

  if (error || !results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
        <p>{error || "Произошла ошибка."}</p>
        <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Main page
        </button>
      </div>
    );
  }

  const { winner, runnerUp } = results;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 pb-[env(safe-area-inset-bottom)] overflow-hidden">
      <Confetti
        width={size.width}
        height={size.height}
        numberOfPieces={250}
        recycle={false}
        gravity={0.1}
      />
      <main className="w-full max-w-xl flex flex-col items-center space-y-8 sm:space-y-10">

        {/* WINNER CARD */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 15, delay: 0.2 }}
          className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-2xl blur opacity-60 group-hover:opacity-80 transition duration-500" />
          <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
            <div className="text-sm text-amber-400 mb-2 font-bold tracking-wider">
              🏆 WINNER
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
              {winner.name}
            </h2>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => copyToClipboard(winner.name, winner.id)}
                className="px-5 py-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/10 text-base sm:text-sm"
              >
                {copied === winner.id ? "✓ Copied" : "Copy"}
              </button>
              <a
                href={`https://marketplace.visualstudio.com/search?term=${encodeURIComponent(winner.name)}&target=VSCode&category=Themes&sortBy=Relevance`}
                target="_blank" rel="noopener noreferrer"
                className="px-5 py-3 sm:py-2 rounded-xl bg-purple-600 hover:bg-purple-500 transition text-base sm:text-sm"
              >
                Marketplace
              </a>
            </div>
          </div>
        </motion.div>

        {/* RUNNER UP */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="w-full max-w-sm sm:max-w-md lg:max-w-lg"
        >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between hover:bg-white/10 transition">
                <div>
                <p className="text-xs text-gray-400">Runner-up</p>
                <p className="text-lg sm:text-xl font-semibold">{runnerUp.name}</p>
                </div>
                <div className="text-gray-400">🥈</div>
            </div>
        </motion.div>

        {/* ACTION */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
        >
            <button
                onClick={handleRetakeTest}
                className="mt-6 px-8 sm:px-10 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105 transition font-semibold shadow-lg text-base lg:text-lg"
            >
                Run Again
            </button>
        </motion.div>
      </main>
    </div>
  );
}
