"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white px-4 sm:px-6 lg:px-8 pb-[env(safe-area-inset-bottom)]">

      <main className="text-center max-w-2xl space-y-8">

        {/* HERO TITLE */}
        <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
            Theme<span className="text-purple-500">Match</span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl leading-relaxed">
            Find your perfect VS Code theme through an interactive
            <span className="text-white font-medium"> A/B tournament</span>.
            <br />
            Choose what feels right — not what looks good in screenshots.
          </p>
        </motion.div>

        {/* CTA BUTTON */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Link href="/test">
            <motion.button 
                className="relative px-8 sm:px-10 py-3 sm:py-4 rounded-2xl font-semibold text-white
                bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500
                hover:scale-105 active:scale-95 transition duration-300 shadow-2xl"
                whileHover={{ boxShadow: "0 0 40px rgba(192, 132, 252, 0.4)"}}
            >

                Start Tournament

                {/* glow effect */}
                <span className="absolute inset-0 rounded-2xl blur-xl opacity-30 bg-gradient-to-r from-purple-600 to-blue-500"></span>
            </motion.button>
            </Link>
        </motion.div>

        {/* SUBTEXT */}
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <p className="text-sm text-gray-500">
            No login • No setup • Just pick your vibe
            </p>
        </motion.div>

      </main>
    </div>
  );
}