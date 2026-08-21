"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// ── cn ────────────────────────────────────
export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

// ── Button ────────────────────────────────
type ButtonVariant = "primary" | "ghost" | "pill" | "pillGhost" | "square";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "btn btn-primary",
  ghost: "btn btn-ghost",
  pill: "btn btn-pill",
  pillGhost: "btn btn-pill-ghost",
  square: "btn btn-square",
};

export function Button({
  variant = "primary",
  className,
  href,
  children,
  ...rest
}: {
  variant?: ButtonVariant;
  className?: string;
  href?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = cn(VARIANT_CLASS[variant], className);
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

// ── Panel (앱 대시보드 카드) ────────────────
export function Panel({
  className,
  children,
  ...rest
}: { className?: string; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("panel", className)} {...rest}>
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  desc,
  action,
}: {
  title: React.ReactNode;
  desc?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/8 px-4 py-3">
      <div className="min-w-0">
        <h3 className="text-[14px] font-bold text-white">{title}</h3>
        {desc && <p className="mt-0.5 text-[12px] text-white/45">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Badge ─────────────────────────────────
export function Badge({
  color = "#6c5ce7",
  children,
  className,
}: {
  color?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 px-2 py-0.5 text-[11px] font-bold",
        className,
      )}
      style={{
        color,
        background: `${color}1f`,
        border: `1px solid ${color}40`,
      }}
    >
      {children}
    </span>
  );
}

// ── ProgressBar ───────────────────────────
export function ProgressBar({
  value,
  total,
  color = "#6c5ce7",
  className,
}: {
  value: number;
  total: number;
  color?: string;
  className?: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className={cn("h-1.5 w-full overflow-hidden bg-white/8", className)}>
      <div
        className="h-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

// ── Avatar ────────────────────────────────
export function Avatar({
  emoji,
  size = 32,
  ring,
}: {
  emoji: string;
  size?: number;
  ring?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-white/8",
        ring && "ring-2 ring-black",
      )}
      style={{ width: size, height: size, fontSize: size * 0.55 }}
    >
      {emoji}
    </span>
  );
}

// ── EmptyState ────────────────────────────
export function EmptyState({
  icon,
  title,
  desc,
  action,
}: {
  icon: string;
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/10 bg-white/5 text-2xl">
        {icon}
      </div>
      <p className="text-[15px] font-bold text-white">{title}</p>
      {desc && (
        <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-white/45">
          {desc}
        </p>
      )}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}

// ── Modal ─────────────────────────────────
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 480,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="panel-shell animate-pop relative max-h-[90vh] w-full overflow-y-auto"
        style={{ maxWidth: width }}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-3.5">
          <h3 className="text-[15px] font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center text-white/40 transition hover:text-white"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-white/8 px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────
let toastFn: ((msg: string) => void) | null = null;

export function toast(msg: string) {
  toastFn?.(msg);
}

export function ToastHost() {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([]);

  useEffect(() => {
    toastFn = (msg: string) => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, msg }]);
      setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }, 2600);
    };
    return () => {
      toastFn = null;
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-200 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-8">
      {items.map((i) => (
        <div
          key={i.id}
          className="animate-pop max-w-[92vw] rounded-full border border-white/15 bg-[#0e0e1a]/95 px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur"
        >
          {i.msg}
        </div>
      ))}
    </div>
  );
}

// ── Tabs (앱 세그먼티드 컨트롤) ─────────────
export function SegmentTabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: { key: string; label: string; icon?: string }[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "no-scrollbar flex w-full gap-1 overflow-x-auto bg-white/6 p-1",
        className,
      )}
    >
      {tabs.map((t) => {
        const on = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 px-4 py-2.5 text-[13px] font-bold transition sm:px-6",
              on
                ? "grad-tab text-white shadow-[0_4px_16px_rgba(108,92,231,0.35)]"
                : "border border-white/8 bg-white/4 text-white/65 hover:text-white",
            )}
          >
            {t.icon && <span>{t.icon}</span>}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Field ─────────────────────────────────
export function Field({
  label,
  hint,
  required,
  counter,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  required?: boolean;
  counter?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label className="text-[13px] font-bold text-white/85">
          {label}
          {required && <span className="ml-1 text-[#a29bfe]">*</span>}
        </label>
        {counter && <span className="text-[11px] text-white/35">{counter}</span>}
      </div>
      {children}
      {hint && (
        <p className="mt-1.5 text-[12px] leading-relaxed text-white/40">{hint}</p>
      )}
    </div>
  );
}

// ── Stat ──────────────────────────────────
export function Stat({
  label,
  value,
  suffix,
  color,
}: {
  label: string;
  value: React.ReactNode;
  suffix?: string;
  color?: string;
}) {
  return (
    <div className="px-3 py-2.5">
      <p className="text-[11px] font-medium text-white/40">{label}</p>
      <p
        className="mt-0.5 text-[20px] leading-tight font-extrabold"
        style={{ color: color ?? "#fff" }}
      >
        {value}
        {suffix && (
          <span className="ml-0.5 text-[12px] font-semibold text-white/45">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

// ── SectionBanner (탭 상단 그라디언트 배너) ──
export function SectionBanner({
  icon,
  eyebrow,
  title,
  desc,
  from,
  to,
  border,
  right,
}: {
  icon: string;
  eyebrow: string;
  title: React.ReactNode;
  desc: string;
  from: string;
  to: string;
  border: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      className="mb-4 flex flex-col gap-4 px-5 py-6 lg:flex-row lg:items-center lg:justify-between"
      style={{
        backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        border: `1px solid ${border}`,
      }}
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border border-white/15 bg-white/10 text-xl">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-1 text-[20px] leading-tight font-extrabold text-white sm:text-[24px]">
            {title}
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/55">
            {desc}
          </p>
        </div>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

// ── Skeleton ──────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-white/6", className)} />;
}

// ── Highlight (==강조== 마크업) ──────────────
export { default as Highlight, parseHighlight, stripHighlight } from "./Highlight";
