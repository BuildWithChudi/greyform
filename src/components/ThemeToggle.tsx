"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const order: Theme[] = ["system", "light", "dark"];

const meta: Record<Theme, { label: string; Icon: typeof Sun }> = {
  system: { label: "System theme", Icon: Monitor },
  light: { label: "Light theme", Icon: Sun },
  dark: { label: "Dark theme", Icon: Moon },
};

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const cycle = () => {
    const i = order.indexOf(theme);
    setTheme(order[(i + 1) % order.length]);
  };

  const { Icon, label } = meta[theme];

  return (
    <button
      type="button"
      onClick={cycle}
      data-cursor="hover"
      aria-label={`Switch theme — currently ${label.toLowerCase()}`}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg/80 hover:text-fg hover:border-fg/30 transition-colors",
        className
      )}
    >
      <span
        className="relative inline-flex h-4 w-4 items-center justify-center"
        suppressHydrationWarning
      >
        {mounted ? <Icon className="h-4 w-4" /> : <Monitor className="h-4 w-4 opacity-0" />}
      </span>
    </button>
  );
}
