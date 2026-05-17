"use client";

import { useEffect, useState } from "react";

export type Theme = "system" | "light" | "dark";
export const THEME_KEY = "greyform-theme";

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = theme === "system" ? (systemDark ? "dark" : "light") : theme;
  root.classList.toggle("dark", resolved === "dark");
  root.dataset.theme = theme;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    const stored = (localStorage.getItem(THEME_KEY) as Theme | null) ?? "system";
    setThemeState(stored);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current = (localStorage.getItem(THEME_KEY) as Theme | null) ?? "system";
      if (current === "system") applyTheme("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = (next: Theme) => {
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    setThemeState(next);
  };

  return { theme, setTheme };
}

// Inline script run in <head> before paint to prevent FOUC / wrong-theme flash.
export const themeInitScript = `
(function(){try{
  var t = localStorage.getItem('${THEME_KEY}') || 'system';
  var d = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var r = document.documentElement;
  if (d) r.classList.add('dark');
  r.dataset.theme = t;
}catch(e){}})();
`;
