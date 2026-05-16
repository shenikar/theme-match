"use client";

import React from "react";
import CodePreview from "./CodePreview"; // Импортируем реальный CodePreview

interface Theme {
  id: string;
  name: string;
}

interface ThemeCardProps {
  theme: Theme;
  code: string;
  onSelect: (themeId: string) => void;
  isSelected: boolean;
}

const ThemeCard: React.FC<ThemeCardProps> = ({
  theme,
  code,
  onSelect,
  isSelected,
}) => {
  return (
    <div
      className={`relative flex-1 cursor-pointer rounded-lg shadow-lg transform transition-all duration-200 ease-in-out
                  ${isSelected ? "ring-4 ring-blue-500 scale-105" : "hover:scale-102"} `}
      onClick={() => onSelect(theme.id)}
    >
      <CodePreview themeId={theme.id} code={code} />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-70 text-white text-center rounded-b-lg">
        <h3 className="text-xl font-semibold">{theme.name}</h3>
      </div>
    </div>
  );
};

export default ThemeCard;
