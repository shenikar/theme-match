"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
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
    // Просто перенаправляем на страницу теста, где турнир начнется заново
    router.push("/test");
  };

  const copyToClipboard = (text: string | undefined, themeId: string) => {
    if (!navigator.clipboard) {
      alert("Функция копирования не доступна в вашем браузере или на этом соединении (требуется HTTPS или localhost).");
      console.error("Clipboard API not available.");
      return;
    }
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(themeId);
        setTimeout(() => setCopied(null), 2000); // Сбрасываем статус через 2 секунды
      }).catch(err => {
        console.error("Failed to copy text: ", err);
        alert("Не удалось скопировать текст.");
      });
    }
  };
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Загрузка...</div>;
  }

  if (error || !results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500 text-xl">
        <p>{error || "Произошла ошибка."}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          На главную
        </button>
      </div>
    );
  }

  const { winner, runnerUp } = results;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <main className="flex flex-col items-center text-center space-y-10 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold tracking-tight text-amber-400">
          🏆 Победитель Турнира 🏆
        </h1>

        {/* Карточка Победителя */}
        <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold">{winner.name}</h2>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <button
              onClick={() => copyToClipboard(winner.name, winner.id)}
              className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-300"
            >
              {copied === winner.id ? "Скопировано!" : "Копировать"}
            </button>
            <a
              href={`https://marketplace.visualstudio.com/search?term=${winner.name}&target=VSCode&category=Themes&sortBy=Relevance`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Marketplace
            </a>
          </div>
        </div>

        {/* Карточка Второго места */}
        <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 w-full max-w-md">
            <h3 className="text-2xl font-semibold text-gray-500 dark:text-gray-400">2-е место</h3>
            <p className="text-xl font-bold">{runnerUp.name}</p>
        </div>


        <button
          onClick={handleRetakeTest}
          className="mt-8 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-300"
        >
          Пройти тест заново
        </button>
      </main>
    </div>
  );
}
