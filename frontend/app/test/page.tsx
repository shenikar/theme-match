"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeCard from "../../components/ThemeCard";
import { getThemes } from "../../lib/api";

interface Theme {
  id: string;
  name: string;
}

type Match = [Theme, Theme];
type Round = Match[];

const codeSnippet = `async function fetchUser(id: number) {
  const response = await fetch(\`/api/users/\${id}\`)

  if (!response.ok) {
    throw new Error("Failed to fetch user")
  }

  return response.json()
}`;

// Функция для перемешивания массива (алгоритм Фишера-Йетса)
const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function TestPage() {
  const router = useRouter();

  // Состояние турнира
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [roundWinners, setRoundWinners] = useState<Theme[]>([]);

  // Состояние загрузки и ошибок
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Инициализация турнира
  const initializeTournament = useCallback(async () => {
    setLoading(true);
    try {
      const allThemes = await getThemes();
      if (allThemes.length < 32) {
        throw new Error("Недостаточно тем для начала турнира (требуется 32).");
      }

      const shuffledThemes = shuffleArray(allThemes);
      const firstRound: Round = [];
      for (let i = 0; i < shuffledThemes.length; i += 2) {
        firstRound.push([shuffledThemes[i], shuffledThemes[i + 1]]);
      }

      setRounds([firstRound]);
      setCurrentRoundIndex(0);
      setCurrentMatchIndex(0);
      setRoundWinners([]);
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
    const newWinners = [...roundWinners, winner];

    // Проверяем, завершен ли текущий раунд
    if (currentMatchIndex + 1 >= rounds[currentRoundIndex].length) {
      // Если это финал, то турнир окончен
      if (newWinners.length === 1) {
        // Получаем проигравшего в финале для 2-го места
        const finalMatch = rounds[currentRoundIndex][currentMatchIndex];
        const runnerUp = finalMatch.find(t => t.id !== winner.id);
        
        // Сохраняем результаты в localStorage для страницы результатов
        localStorage.setItem('tournamentResults', JSON.stringify({
            winner,
            runnerUp,
            // Здесь можно добавить логику для 3/4 места, если нужно
        }));
        router.push("/result");
        return;
      }

      // Создаем следующий раунд
      const nextRound: Round = [];
      for (let i = 0; i < newWinners.length; i += 2) {
        nextRound.push([newWinners[i], newWinners[i + 1]]);
      }
      setRounds([...rounds, nextRound]);
      setCurrentRoundIndex(currentRoundIndex + 1);
      setCurrentMatchIndex(0);
      setRoundWinners([]); // Очищаем победителей для нового раунда
    } else {
      // Переходим к следующему матчу в текущем раунде
      setCurrentMatchIndex(currentMatchIndex + 1);
      setRoundWinners(newWinners);
    }
  };

  const getRoundName = (roundIndex: number, totalMatches: number) => {
    if (totalMatches === 1) return "Финал";
    if (totalMatches === 2) return "Полуфинал";
    if (totalMatches === 4) return "Четвертьфинал";
    return `Раунд 1/${totalMatches}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        Загрузка турнира...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500 text-xl">
        Ошибка: {error}
        <button
          onClick={initializeTournament}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (rounds.length === 0) {
    return <div className="flex items-center justify-center min-h-screen">Инициализация...</div>;
  }

  const currentMatch = rounds[currentRoundIndex]?.[currentMatchIndex];
  if (!currentMatch) {
     return <div className="flex items-center justify-center min-h-screen">Создание следующего раунда...</div>;
  }

  const totalMatchesInRound = rounds[currentRoundIndex].length;
  const roundName = getRoundName(currentRoundIndex, totalMatchesInRound);
  const progress = ((currentMatchIndex + 1) / totalMatchesInRound) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-4">
        {roundName} (Матч {currentMatchIndex + 1}/{totalMatchesInRound})
      </h2>
      <p className="text-xl mb-8">Выберите лучшую тему</p>

      <div className="w-full max-w-4xl mb-8 bg-gray-200 rounded-full h-4 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 w-full max-w-4xl">
        <ThemeCard
          theme={currentMatch[0]}
          code={codeSnippet}
          onSelect={() => handleThemeSelect(currentMatch[0])}
          isSelected={false}
        />
        <ThemeCard
          theme={currentMatch[1]}
          code={codeSnippet}
          onSelect={() => handleThemeSelect(currentMatch[1])}
          isSelected={false}
        />
      </div>

      <Link href="/">
        <button className="mt-8 px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-300">
          На главную
        </button>
      </Link>
    </div>
  );
}