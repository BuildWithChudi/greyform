"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const line: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const heading: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.95, ease } },
};

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true }
        | { ok: false; error?: string }
        | null;
      if (!res.ok || !data || !data.ok) {
        setError(
          (data && "error" in data && data.error) || "Couldn't sign in."
        );
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="relative flex min-h-screen items-center px-6 pt-32 pb-24 md:px-10">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-md"
      >
        <motion.p
          variants={line}
          className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted"
        >
          Greyform / Admin
        </motion.p>

        <motion.h1
          variants={heading}
          className="mt-8 font-display tracking-tightest text-fg leading-[1.02]"
          style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)" }}
        >
          Restricted.
        </motion.h1>

        <motion.p
          variants={line}
          className="mt-6 text-fluid-base leading-relaxed text-muted"
        >
          Enter the admin password to continue.
        </motion.p>

        <motion.form
          variants={line}
          onSubmit={onSubmit}
          noValidate
          className="mt-12 space-y-6"
        >
          <div>
            <label
              htmlFor="password"
              className="block font-mono text-fluid-xs uppercase tracking-[0.16em] text-muted"
            >
              Password
            </label>
            <div className="mt-2 flex items-center gap-3 border-b border-line transition-colors focus-within:border-fg">
              <Lock
                aria-hidden
                className="h-3.5 w-3.5 shrink-0 text-muted"
                strokeWidth={2}
              />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
                className="w-full bg-transparent py-3 text-fluid-base text-fg outline-none placeholder:text-muted/40"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p
                role="alert"
                className="mt-3 font-mono text-fluid-xs text-fg/80"
              >
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={busy || password.length === 0}
            className="group inline-flex w-full items-center justify-between rounded-full bg-fg px-6 py-3.5 font-mono text-fluid-xs uppercase tracking-[0.18em] text-bg transition-colors duration-300 hover:bg-bg hover:text-fg hover:ring-1 hover:ring-fg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-fg disabled:hover:text-bg disabled:hover:ring-0"
          >
            {busy ? "Signing in…" : "Sign in"}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </motion.form>
      </motion.div>
    </section>
  );
}
