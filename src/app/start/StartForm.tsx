"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FormProvider,
  useForm,
  useFormContext,
  type FieldPath,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import {
  BUDGET_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  TIMELINE_OPTIONS,
  inquirySchema,
  type InquiryInput,
} from "@/lib/schemas/inquiry";
import { cn } from "@/lib/utils";

type StepKey = 1 | 2 | 3 | 4;
const TOTAL_STEPS: StepKey = 4;
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STEP_FIELDS: Record<StepKey, FieldPath<InquiryInput>[]> = {
  1: ["projectType"],
  2: ["description", "references"],
  3: ["timeline", "budget"],
  4: ["name", "email", "company", "location"],
};

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "success"; ref: string };

export default function StartForm() {
  const [step, setStep] = useState<StepKey>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: "idle" });

  const methods = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: {
      projectType: undefined,
      description: "",
      references: "",
      timeline: undefined,
      budget: undefined,
      name: "",
      email: "",
      company: "",
      location: "",
    },
  });

  async function handleNext() {
    if (submitState.kind === "submitting") return;
    const ok = await methods.trigger(STEP_FIELDS[step]);
    if (!ok) return;

    if (step < TOTAL_STEPS) {
      setDirection(1);
      setStep((s) => (s + 1) as StepKey);
      return;
    }

    await submit(methods.getValues());
  }

  function handleBack() {
    if (step <= 1 || submitState.kind === "submitting") return;
    setDirection(-1);
    setStep((s) => (s - 1) as StepKey);
  }

  async function submit(values: InquiryInput) {
    setSubmitState({ kind: "submitting" });
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; ref: string }
        | { ok: false; error?: string }
        | null;

      if (!res.ok || !data || !data.ok) {
        setSubmitState({
          kind: "error",
          message:
            (data && "error" in data && data.error) ||
            "Something went wrong. Try again in a moment.",
        });
        return;
      }
      setSubmitState({ kind: "success", ref: data.ref });
    } catch {
      setSubmitState({
        kind: "error",
        message:
          "Couldn't reach the server. Check your connection and try again.",
      });
    }
  }

  function retry() {
    setSubmitState({ kind: "idle" });
    void submit(methods.getValues());
  }

  if (submitState.kind === "success") {
    return <ThankYou refId={submitState.ref} />;
  }

  return (
    <section className="min-h-screen px-6 pt-32 pb-24 md:px-10 md:pt-40">
      <div className="mx-auto w-full max-w-3xl">
        <Header />
        <Progress step={step} total={TOTAL_STEPS} />

        <FormProvider {...methods}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleNext();
            }}
            noValidate
            className="mt-14"
          >
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease }}
                  className="min-h-[320px]"
                >
                  {step === 1 && <Step1 />}
                  {step === 2 && <Step2 />}
                  {step === 3 && <Step3 />}
                  {step === 4 && <Step4 />}
                </motion.div>
              </AnimatePresence>
            </div>

            {submitState.kind === "error" && (
              <ErrorBanner message={submitState.message} onRetry={retry} />
            )}

            <Navigation
              step={step}
              total={TOTAL_STEPS}
              onBack={handleBack}
              submitting={submitState.kind === "submitting"}
            />
          </form>
        </FormProvider>
      </div>
    </section>
  );
}

/* ─────────────────────────── presentational pieces ─────────────────────────── */

function Header() {
  return (
    <div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted"
      >
        Greyform / Start
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.1 }}
        className="mt-6 font-display italic tracking-tightest text-fg leading-[1.05]"
        style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}
      >
        Let&rsquo;s see if we&rsquo;re a fit.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.25 }}
        className="mt-5 text-fluid-lg text-muted leading-relaxed"
      >
        Four short steps. Two minutes.
      </motion.p>
    </div>
  );
}

function Progress({ step, total }: { step: StepKey; total: StepKey }) {
  const pct = (step / total) * 100;
  return (
    <div className="mt-14">
      <div className="flex items-baseline justify-between font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted">
        <span>
          Step {String(step).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="mt-3 h-px w-full bg-line">
        <motion.div
          className="h-px bg-fg"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease }}
        />
      </div>
    </div>
  );
}

const stepVariants: Variants = {
  enter: (dir: 1 | -1) => ({ x: 40 * dir, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: 1 | -1) => ({ x: -40 * dir, opacity: 0 }),
};

function Navigation({
  step,
  total,
  onBack,
  submitting,
}: {
  step: StepKey;
  total: StepKey;
  onBack: () => void;
  submitting: boolean;
}) {
  const isLast = step === total;
  const backDisabled = step === 1 || submitting;

  return (
    <div className="mt-14 flex items-center justify-between gap-4 border-t border-line pt-8">
      <button
        type="button"
        onClick={onBack}
        disabled={backDisabled}
        data-cursor="hover"
        className={cn(
          "group inline-flex items-center gap-2 font-mono text-fluid-xs uppercase tracking-[0.18em] transition-colors",
          backDisabled
            ? "cursor-not-allowed text-muted/40"
            : "text-muted hover:text-fg"
        )}
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        Back
      </button>

      <button
        type="submit"
        disabled={submitting}
        data-cursor="hover"
        className={cn(
          "group inline-flex items-center gap-3 rounded-full bg-fg px-7 py-4 font-mono text-fluid-xs uppercase tracking-[0.2em] text-bg transition-all duration-300",
          "hover:bg-bg hover:text-fg hover:ring-1 hover:ring-fg",
          submitting && "cursor-wait opacity-70 hover:bg-fg hover:text-bg hover:ring-0"
        )}
      >
        {submitting ? "Sending…" : isLast ? "Send" : "Next"}
        {isLast ? (
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        )}
      </button>
    </div>
  );
}

function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mt-8 flex flex-col gap-3 rounded-md border border-fg/20 bg-fg/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-fg" />
        <p className="text-fluid-sm text-fg">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        data-cursor="hover"
        className="group inline-flex shrink-0 items-center gap-2 self-start font-mono text-fluid-xs uppercase tracking-[0.18em] text-fg underline underline-offset-4 decoration-fg/40 hover:decoration-fg sm:self-auto"
      >
        <RotateCcw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-rotate-180" />
        Try again
      </button>
    </div>
  );
}

function ThankYou({ refId }: { refId: string }) {
  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-32 md:px-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
        }}
        className="mx-auto w-full max-w-2xl text-center"
      >
        <motion.p
          variants={fadeUp}
          className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted"
        >
          Greyform / Received
        </motion.p>

        <motion.h1
          variants={fadeUpBig}
          className="mt-8 font-display italic tracking-tightest text-fg leading-[1.02]"
          style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
        >
          Got it. Talk soon.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-8 text-fluid-lg text-muted leading-relaxed"
        >
          We&rsquo;ll reply within 48 hours.
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mt-10 font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted"
        >
          Ref: <span className="text-fg">{refId}</span>
        </motion.p>

        <motion.div variants={fadeUp} className="mt-12 flex justify-center">
          <Link
            href="/"
            data-cursor="hover"
            className="group inline-flex items-center gap-2 border-b border-fg/30 pb-1 font-mono text-fluid-xs uppercase tracking-[0.2em] text-fg transition-colors hover:border-fg"
          >
            Back to home
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
const fadeUpBig: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};

/* ───────────────────────────── shared form bits ───────────────────────────── */

function StepHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h2
        className="font-display tracking-tightest text-fg leading-[1.1]"
        style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)" }}
      >
        {title}
      </h2>
      <p className="mt-3 text-fluid-base text-muted leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-2 font-mono text-fluid-xs text-fg/80" role="alert">
      {message}
    </p>
  );
}

type OptionCardProps = {
  number?: string;
  label: string;
  selected: boolean;
  register: UseFormRegisterReturn;
  value: string;
};

function OptionCard({ number, label, selected, register, value }: OptionCardProps) {
  return (
    <label
      data-cursor="hover"
      className={cn(
        "group relative block cursor-pointer rounded-md border p-5 transition-all duration-300",
        "focus-within:ring-2 focus-within:ring-fg focus-within:ring-offset-2 focus-within:ring-offset-bg",
        selected
          ? "border-fg bg-fg/[0.04]"
          : "border-line hover:border-fg/40 hover:bg-fg/[0.02]"
      )}
    >
      <input
        type="radio"
        value={value}
        className="sr-only"
        {...register}
      />
      <div className="flex items-baseline gap-4">
        {number ? (
          <span
            className={cn(
              "font-mono text-fluid-xs tracking-[0.18em] transition-colors",
              selected ? "text-fg" : "text-muted"
            )}
          >
            {number}
          </span>
        ) : null}
        <span
          className={cn(
            "font-display tracking-tight transition-colors",
            selected ? "text-fg" : "text-fg/90"
          )}
          style={{ fontSize: "clamp(1.125rem, 1.6vw, 1.375rem)" }}
        >
          {label}
        </span>
      </div>
      <span
        aria-hidden
        className={cn(
          "absolute right-5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full transition-all duration-300",
          selected
            ? "bg-fg ring-4 ring-fg/10"
            : "bg-line group-hover:bg-fg/30"
        )}
      />
    </label>
  );
}

function TextField({
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  required,
}: {
  name: FieldPath<InquiryInput>;
  label: string;
  placeholder?: string;
  type?: "text" | "email";
  autoComplete?: string;
  required?: boolean;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<InquiryInput>();
  const error = errors[name]?.message as string | undefined;

  return (
    <div>
      <label
        htmlFor={name}
        className="block font-mono text-fluid-xs uppercase tracking-[0.16em] text-muted"
      >
        {label}
        {!required && (
          <span className="ml-2 normal-case tracking-normal text-muted/60">
            (optional)
          </span>
        )}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        data-cursor="hover"
        aria-invalid={!!error}
        className={cn(
          "mt-2 w-full border-0 border-b bg-transparent py-3 text-fluid-base text-fg outline-none transition-colors",
          "placeholder:text-muted/50",
          error
            ? "border-fg/60 focus:border-fg"
            : "border-line focus:border-fg"
        )}
        {...register(name)}
      />
      <FieldError message={error} />
    </div>
  );
}

function TextareaField({
  name,
  label,
  placeholder,
  rows = 5,
  required,
}: {
  name: FieldPath<InquiryInput>;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<InquiryInput>();
  const error = errors[name]?.message as string | undefined;

  return (
    <div>
      <label
        htmlFor={name}
        className="block font-mono text-fluid-xs uppercase tracking-[0.16em] text-muted"
      >
        {label}
        {!required && (
          <span className="ml-2 normal-case tracking-normal text-muted/60">
            (optional)
          </span>
        )}
      </label>
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        data-cursor="hover"
        aria-invalid={!!error}
        className={cn(
          "mt-2 w-full resize-none border-0 border-b bg-transparent py-3 text-fluid-base text-fg outline-none transition-colors leading-relaxed",
          "placeholder:text-muted/50",
          error
            ? "border-fg/60 focus:border-fg"
            : "border-line focus:border-fg"
        )}
        {...register(name)}
      />
      <FieldError message={error} />
    </div>
  );
}

/* ───────────────────────────────── steps ───────────────────────────────── */

function Step1() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<InquiryInput>();
  const current = watch("projectType");
  const error = errors.projectType?.message as string | undefined;
  const reg = register("projectType");

  return (
    <div>
      <StepHeading
        title="What kind of project?"
        subtitle="Pick the closest fit. We can refine the details together."
      />
      <fieldset className="mt-10">
        <legend className="sr-only">Project type</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PROJECT_TYPE_OPTIONS.map((opt, i) => (
            <OptionCard
              key={opt.value}
              number={String(i + 1).padStart(2, "0")}
              label={opt.label}
              value={opt.value}
              selected={current === opt.value}
              register={reg}
            />
          ))}
        </div>
      </fieldset>
      <FieldError message={error} />
    </div>
  );
}

function Step2() {
  return (
    <div>
      <StepHeading
        title="Tell us about it."
        subtitle="The more detail, the better. Even a paragraph helps us give you a real answer."
      />
      <div className="mt-10 space-y-10">
        <TextareaField
          name="description"
          label="Tell us about it"
          placeholder="What are you building, who is it for, and what would make it a win?"
          rows={6}
          required
        />
        <TextareaField
          name="references"
          label="Any sites you admire? Paste links."
          placeholder="https://… and a line on what you like about each"
          rows={4}
        />
      </div>
    </div>
  );
}

function Step3() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<InquiryInput>();
  const timeline = watch("timeline");
  const budget = watch("budget");
  const tReg = register("timeline");
  const bReg = register("budget");
  const tError = errors.timeline?.message as string | undefined;
  const bError = errors.budget?.message as string | undefined;

  return (
    <div>
      <StepHeading
        title="Scope & shape."
        subtitle="Rough numbers are fine. We'll firm up the rest with you."
      />

      <fieldset className="mt-10">
        <legend className="block font-mono text-fluid-xs uppercase tracking-[0.16em] text-muted">
          Timeline
        </legend>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TIMELINE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              value={opt.value}
              selected={timeline === opt.value}
              register={tReg}
            />
          ))}
        </div>
        <FieldError message={tError} />
      </fieldset>

      <fieldset className="mt-10">
        <legend className="block font-mono text-fluid-xs uppercase tracking-[0.16em] text-muted">
          Budget
        </legend>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {BUDGET_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              value={opt.value}
              selected={budget === opt.value}
              register={bReg}
            />
          ))}
        </div>
        <FieldError message={bError} />
      </fieldset>
    </div>
  );
}

function Step4() {
  return (
    <div>
      <StepHeading
        title="And about you."
        subtitle="Just so we know who we're replying to."
      />
      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <TextField
          name="name"
          label="Name"
          placeholder="Your full name"
          autoComplete="name"
          required
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          placeholder="you@domain.com"
          autoComplete="email"
          required
        />
        <TextField
          name="company"
          label="Company"
          placeholder="Where you work, if relevant"
          autoComplete="organization"
        />
        <TextField
          name="location"
          label="Location"
          placeholder="Lagos · London · …"
          autoComplete="address-level2"
        />
      </div>
    </div>
  );
}
