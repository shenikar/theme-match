import { createHighlighter } from "shiki";

let highlighter: any = null;

export async function getHighlighterInstance() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: [
        "github-dark",
        "dracula",
        "nord",
        "andromeeda",
        "aurora-x",
        "ayu-dark",
        "ayu-light",
        "catppuccin-frappe",
        "catppuccin-latte",
        "catppuccin-macchiato",
        "catppuccin-mocha",
        "dark-plus",
        "dracula-soft",
        "github-dark-default",
        "github-dark-dimmed",
        "github-light",
        "github-light-default",
        "houston",
        "kanagawa-dragon",
        "kanagawa-lotus",
        "kanagawa-wave",
        "laserwave",
        "light-plus",
        "material-theme",
        "material-theme-darker",
        "material-theme-lighter",
        "material-theme-ocean",
        "material-theme-palenight",
        "min-dark",
        "min-light",
        "monokai",
        "night-owl",
      ],
      langs: ["ts", "tsx"],
    });
  }

  return highlighter;
}
