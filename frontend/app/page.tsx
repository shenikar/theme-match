import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <main className="flex flex-col items-center text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          ThemeMatch
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
          Веб‑сервис для подбора темы оформления VS Code через интерактивное A/B‑сравнение.
          Выберите наиболее комфортный вариант и найдите свою идеальную тему!
        </p>
        <Link href="/test" passHref>
          <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300">
            Start Test
          </button>
        </Link>
      </main>
    </div>
  );
}
