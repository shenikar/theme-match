"use client";

import React, { useEffect, useState } from "react";
import { getHighlighterInstance } from "../lib/shiki";

const defaultCode = `async function fetchUser(id: number) {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}`;

interface CodePreviewProps {
  themeId: string;
  code?: string;
  lang?: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({
  themeId,
  code = defaultCode,
  lang = "typescript",
}) => {
  const [highlightedCode, setHighlightedCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const highlight = async () => {
      setLoading(true);
      try {
        const highlighter = await getHighlighterInstance();
        const html = highlighter.codeToHtml(code, {
          lang,
          theme: themeId,
        });
        if (active) {
          setHighlightedCode(html);
        }
      } catch (error) {
        console.error("Shiki highlighting failed:", error);
        if (active) {
          // В случае ошибки показываем код без подсветки
          setHighlightedCode(
            `<pre style="background-color: #222; color: #fff; padding: 1rem; border-radius: 0.5rem;">Error for theme: ${themeId}. Is it included in the bundle?</pre>`
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    highlight();

    return () => {
      active = false;
    };
  }, [code, themeId, lang]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-800 text-white p-4 rounded-lg">
        Загрузка темы...
      </div>
    );
  }

  return (
    <div
      className="shiki-container overflow-auto h-full w-full rounded-lg"
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
};

export default CodePreview;