const API_BASE_URL = "http://localhost:8081"; // Базовый URL бэкенда

interface Theme {
  id: string;
  name: string;
}

interface ThemeScore {
  id: string;
  score: number;
  name?: string; // Для удобства, если имя не приходит напрямую с бэкенда
}

export const getThemes = async (): Promise<Theme[]> => {
  const res = await fetch(`${API_BASE_URL}/themes`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export const voteForTheme = async (themeId: string): Promise<{ status: string }> => {
  const res = await fetch(`${API_BASE_URL}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ themeId }),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
};

interface GetResultResponse {
  bestTheme: ThemeScore;
  alternativeThemes: ThemeScore[];
}

export const getResults = async (): Promise<GetResultResponse> => {
  const res = await fetch(`${API_BASE_URL}/result`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export const startNewTest = async (): Promise<{ status: string }> => {
  const res = await fetch(`${API_BASE_URL}/start-new-test`, { method: "POST" });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
};
