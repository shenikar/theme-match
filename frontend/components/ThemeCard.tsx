"use client";

import React from "react";
import { motion } from "framer-motion";
import CodePreview from "./CodePreview";

interface Theme {
  id: string;
  name: string;
}

interface ThemeCardProps {
  theme: Theme;
  code: string;
  onSelect: () => void;
  position: 'left' | 'right'; // Prop для определения направления анимации
}

const cardVariants = {
  hidden: (position: 'left' | 'right') => ({
    opacity: 0,
    x: position === 'left' ? -50 : 50,
    scale: 0.95,
  }),
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
  exit: (position: 'left' | 'right') => ({
    opacity: 0,
    x: position === 'left' ? -50 : 50,
    scale: 0.95,
    transition: { duration: 0.2 },
  }),
};

const ThemeCard: React.FC<ThemeCardProps> = ({
  theme,
  code,
  onSelect,
  position,
}) => {
  return (
    <motion.div
      className="relative w-full cursor-pointer rounded-2xl overflow-hidden"
      onClick={onSelect}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 0 30px rgba(120, 120, 255, 0.3)",
        zIndex: 10,
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      
      // Анимации появления/исчезновения
      variants={cardVariants}
      custom={position} // Передаем 'left' или 'right' в variants
    >
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[12px] z-0"></div>
      
      <div className="relative z-10 h-full">
        <CodePreview themeId={theme.id} code={code} />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 text-white text-center">
          <h3 className="text-xl font-semibold">{theme.name}</h3>
        </div>
      </div>
    </motion.div>
  );
};

export default ThemeCard;
