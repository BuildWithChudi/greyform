"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  LogOut,
  Save,
} from "lucide-react";
import {
  INQUIRY_STATUSES,
  INQUIRY_STATUS_LABEL,
  type InquiryRow,
  type InquiryStatus,
} from "@/lib/inquiry-types";

type Props = {
  inquiries: InquiryRow[];
  storageError: string | null;
};

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STATUS_FILTERS: { value: "all" | InquiryStatus; label: string }[] = [
  { value: "all", label: "All" },
  ...INQUIRY_STATUSES.map((s) => ({ value: s, label: INQUIRY_STATUS_LABEL[s] })),
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", " ·");
}

function humanLabel(value: string): string {
  return value
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const min = Math.round(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.round(day / 7);
  if (wk < 5) return `${wk}w ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

// Rough midpoints per budget band — for a directional "open pipeline" figure
// only, never billed against. "not-sure" contributes nothing.
const BUDGET_ESTIMATE: Record<string, number> = {
  "under-1k": 750,
  "1k-3k": 2000,
  "3k-10k": 6500,
  "10k-plus": 12000,
  "not-sure": 0,
};

const OPEN_STATUSES: InquiryStatus[] = ["new", "contacted", "proposal_sent"];

function gbp(n: number): string {
  return "£" + Math.round(n).toLocaleString("en-GB");
}

function toCsv(rows: InquiryRow[]): string {
  const headers = [
    "created_at",
    "name",
    "email",
    "company",
    "location",
    "project_type",
    "timeline",
    "budget",
    "status",
    "description",
    "references",
    "notes",
    "id",
  ];
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = rows.map((r) =>
    headers.map((h) => esc((r as Record<string, unknown>)[h])).join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}

export default function AdminTable({ inquiries, storageError }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | InquiryStatus>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inquiries.filter((row) => {
      if (filter !== "all" && row.status !== filter) return false;
      if (!q) return true;
      return (
        row.name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        (row.company ?? "").toLowerCase().includes(q) ||
        row.description.toLowerCase().includes(q)
      );
    });
  }, [inquiries, filter, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: inquiries.length };
    for (const s of INQUIRY_STATUSES) c[s] = 0;
    for (const row of inquiries) c[row.status] = (c[row.status] ?? 0) + 1;
    return c;
  }, [inquiries]);

  const stats = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let thisWeek = 0;
    let openPipeline = 0;
    for (const row of inquiries) {
      if (new Date(row.created_at).getTime() >= weekAgo) thisWeek += 1;
      if (OPEN_STATUSES.includes(row.status)) {
        openPipeline += BUDGET_ESTIMATE[row.budget] ?? 0;
      }
    }
    return {
      total: inquiries.length,
      neu: counts.new ?? 0,
      thisWeek,
      won: counts.won ?? 0,
      openPipeline,
    };
  }, [inquiries, counts]);

  function exportCsv() {
    const csv = toCsv(filtered.length ? filtered : inquiries);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `greyform-inquiries-${stamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="min-h-screen px-6 pt-28 pb-24 md:px-10 md:pt-36">
      <div className="mx-auto max-w-[1400px]">
        {/* ───── Header ───── */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted">
              Greyform / Admin
            </p>
            <h1
              className="mt-6 font-display tracking-tightest text-fg leading-[1.02]"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)" }}
            >
              Inquiries{" "}
              <span className="font-mono not-italic align-middle text-fluid-base text-muted">
                ({inquiries.length})
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={exportCsv}
              disabled={inquiries.length === 0}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download className="h-3 w-3" />
              Export CSV
            </button>
            <span aria-hidden className="text-muted/40">·</span>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted underline underline-offset-4 decoration-line hover:text-fg hover:decoration-fg"
            >
              Refresh
            </button>
            <span aria-hidden className="text-muted/40">
              ·
            </span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted hover:text-fg"
            >
              <LogOut className="h-3 w-3" />
              Sign out
            </button>
          </div>
        </div>

        {/* ───── Metrics ───── */}
        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
          <Metric label="Total" value={String(stats.total)} />
          <Metric
            label="New · needs reply"
            value={String(stats.neu)}
            emphasis={stats.neu > 0}
          />
          <Metric label="This week" value={String(stats.thisWeek)} />
          <Metric label="Won" value={String(stats.won)} />
          <Metric
            label="Est. open pipeline"
            value={gbp(stats.openPipeline)}
            hint="Rough estimate from budget bands"
          />
        </dl>

        {/* ───── Filters ───── */}
        <div className="mt-12 flex flex-col gap-4 border-y border-line py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {STATUS_FILTERS.map((f) => {
              const active = filter === f.value;
              const n = counts[f.value] ?? 0;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={
                    "font-mono text-[10px] uppercase tracking-[0.22em] transition-colors " +
                    (active
                      ? "text-fg"
                      : "text-muted hover:text-fg")
                  }
                >
                  {f.label}{" "}
                  <span className={active ? "text-fg/60" : "text-muted/60"}>
                    {n}
                  </span>
                </button>
              );
            })}
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, company…"
            className="w-full max-w-xs bg-transparent border-b border-line py-2 font-mono text-fluid-xs text-fg outline-none placeholder:text-muted/40 focus:border-fg"
          />
        </div>

        {storageError && (
          <div className="mt-8 border border-fg/20 bg-fg/[0.04] p-5 font-mono text-fluid-xs text-fg/85">
            {storageError}
          </div>
        )}

        {/* ───── Table ───── */}
        {filtered.length === 0 ? (
          <div className="mt-24 text-center font-mono text-fluid-xs uppercase tracking-[0.22em] text-muted">
            {inquiries.length === 0 ? "No inquiries yet." : "No matches."}
          </div>
        ) : (
          <ul className="mt-2 divide-y divide-line">
            {filtered.map((row) => (
              <Row
                key={row.id}
                row={row}
                open={openId === row.id}
                onToggle={() =>
                  setOpenId((cur) => (cur === row.id ? null : row.id))
                }
                onPatched={(updated) => {
                  // Optimistic refresh — re-fetches the server data.
                  startTransition(() => router.refresh());
                  // Hide reopen-flicker by leaving panel open.
                  void updated;
                }}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────── row ─────────────────────────── */

function Row({
  row,
  open,
  onToggle,
  onPatched,
}: {
  row: InquiryRow;
  open: boolean;
  onToggle: () => void;
  onPatched: (updated: InquiryRow) => void;
}) {
  const isNew = row.status === "new";
  return (
    <li className={isNew ? "border-l-2 border-fg" : "border-l-2 border-transparent"}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="grid w-full grid-cols-12 items-center gap-x-4 px-2 py-5 pl-3 text-left transition-colors hover:bg-fg/[0.025]"
      >
        <span
          className="col-span-12 md:col-span-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted"
          title={formatDate(row.created_at)}
        >
          {relativeTime(row.created_at)}
        </span>
        <span className="col-span-6 md:col-span-3 text-fluid-base text-fg truncate">
          {row.name}
          {row.company ? (
            <span className="text-muted"> · {row.company}</span>
          ) : null}
        </span>
        <span className="col-span-6 md:col-span-3 font-mono text-fluid-xs text-muted truncate">
          {row.email}
        </span>
        <span className="col-span-6 md:col-span-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted truncate">
          {humanLabel(row.project_type)} · {humanLabel(row.budget)}
        </span>
        <span className="col-span-5 md:col-span-1 flex items-center">
          <StatusPill status={row.status} />
        </span>
        <span className="col-span-1 flex justify-end">
          <ChevronDown
            aria-hidden
            className={
              "h-4 w-4 text-muted transition-transform duration-300 " +
              (open ? "rotate-180 text-fg" : "")
            }
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden"
          >
            <Details row={row} onPatched={onPatched} />
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function StatusPill({ status }: { status: InquiryStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-fg/85">
      <span
        aria-hidden
        className={
          "inline-block h-1.5 w-1.5 rounded-full " +
          (status === "new"
            ? "bg-fg"
            : status === "won"
            ? "bg-fg"
            : status === "lost"
            ? "bg-muted/40"
            : "bg-muted")
        }
      />
      {INQUIRY_STATUS_LABEL[status]}
    </span>
  );
}

/* ─────────────────────────── details panel ─────────────────────────── */

function Details({
  row,
  onPatched,
}: {
  row: InquiryRow;
  onPatched: (updated: InquiryRow) => void;
}) {
  const [status, setStatus] = useState<InquiryStatus>(row.status);
  const [notes, setNotes] = useState<string>(row.notes ?? "");
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const ref = row.id.slice(0, 8).toUpperCase();
  const replySubject = `Re: your Greyform inquiry · ${ref}`;
  const replyBody = `Hi ${firstName(row.name)},\n\nThanks for reaching out about your ${humanLabel(
    row.project_type
  ).toLowerCase()} project — `;
  const mailto = `mailto:${row.email}?subject=${encodeURIComponent(
    replySubject
  )}&body=${encodeURIComponent(replyBody)}`;

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(row.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  }

  const dirty = status !== row.status || (notes ?? "") !== (row.notes ?? "");

  async function patch(next: { status?: InquiryStatus; notes?: string }) {
    setSaving("saving");
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/inquiries/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; inquiry: InquiryRow }
        | { ok: false; error?: string }
        | null;
      if (!res.ok || !data || !data.ok) {
        setSaving("error");
        setErrorMsg(
          (data && "error" in data && data.error) || "Couldn't save."
        );
        return;
      }
      onPatched(data.inquiry);
      setSaving("saved");
      setTimeout(
        () => setSaving((s) => (s === "saved" ? "idle" : s)),
        1500
      );
    } catch {
      setSaving("error");
      setErrorMsg("Network error.");
    }
  }

  async function onStatusChange(next: InquiryStatus) {
    setStatus(next);
    await patch({ status: next });
  }

  async function saveNotes() {
    if ((notes ?? "") === (row.notes ?? "")) return;
    await patch({ notes });
  }

  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-10 border-t border-line bg-fg/[0.015] px-4 py-10 md:grid-cols-12 md:px-8">
      {/* LEFT — inquiry body */}
      <div className="md:col-span-7">
        <Field label="Description">
          <p className="whitespace-pre-wrap text-fluid-base leading-relaxed text-fg/90">
            {row.description}
          </p>
        </Field>

        {row.references ? (
          <Field label="References" className="mt-8">
            <p className="whitespace-pre-wrap text-fluid-base leading-relaxed text-fg/90">
              {row.references}
            </p>
          </Field>
        ) : null}

        <dl className="mt-10 grid grid-cols-2 gap-y-6 border-t border-line pt-8 sm:grid-cols-3">
          <Stat label="Project">{humanLabel(row.project_type)}</Stat>
          <Stat label="Timeline">{humanLabel(row.timeline)}</Stat>
          <Stat label="Budget">{humanLabel(row.budget)}</Stat>
          <Stat label="Location">{row.location || "—"}</Stat>
          <Stat label="Company">{row.company || "—"}</Stat>
          <Stat label="Submitted">{formatDate(row.created_at)}</Stat>
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={mailto}
            className="inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-bg transition-colors hover:bg-bg hover:text-fg hover:ring-1 hover:ring-fg"
          >
            Reply
            <ExternalLink className="h-3 w-3" />
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted hover:text-fg"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : row.email}
          </button>
        </div>
      </div>

      {/* RIGHT — controls */}
      <div className="md:col-span-5">
        <Field label="Status">
          <div className="mt-2 flex flex-wrap gap-2">
            {INQUIRY_STATUSES.map((s) => {
              const active = status === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onStatusChange(s)}
                  className={
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors " +
                    (active
                      ? "border-fg bg-fg text-bg"
                      : "border-line text-muted hover:border-fg/40 hover:text-fg")
                  }
                >
                  {INQUIRY_STATUS_LABEL[s]}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Notes" className="mt-8">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => void saveNotes()}
            rows={6}
            placeholder="Private notes — visible only to you."
            className="mt-2 w-full resize-none border border-line bg-transparent p-3 text-fluid-base leading-relaxed text-fg/90 outline-none placeholder:text-muted/40 focus:border-fg"
          />
          <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            <span>
              {saving === "saving"
                ? "Saving…"
                : saving === "saved"
                ? "Saved"
                : saving === "error"
                ? errorMsg || "Couldn't save"
                : dirty
                ? "Unsaved"
                : "Up to date"}
            </span>
            <button
              type="button"
              onClick={() => void saveNotes()}
              disabled={!dirty || saving === "saving"}
              className="inline-flex items-center gap-1.5 text-fg disabled:cursor-not-allowed disabled:text-muted/50"
            >
              <Save className="h-3 w-3" />
              Save
            </button>
          </div>
        </Field>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          Ref · <span className="text-fg/80">{ref}</span>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        {label}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Stat({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        {label}
      </dt>
      <dd className="mt-2 text-fluid-base text-fg/90">{children}</dd>
    </div>
  );
}

function Metric({
  label,
  value,
  emphasis,
  hint,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  hint?: string;
}) {
  return (
    <div className="bg-bg px-5 py-5" title={hint}>
      <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        {label}
      </dt>
      <dd
        className={
          "mt-3 font-display tracking-tightest leading-none " +
          (emphasis ? "text-fg" : "text-fg/90")
        }
        style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
      >
        {value}
        {emphasis ? (
          <span
            aria-hidden
            className="ml-2 inline-block h-2 w-2 -translate-y-1.5 rounded-full bg-fg align-middle animate-pulse"
          />
        ) : null}
      </dd>
    </div>
  );
}
