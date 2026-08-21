"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "./ui";

/**
 * 스크롤 진입 시 페이드업으로 드러나는 래퍼.
 * rootMargin을 넉넉하게 잡아 미리 보이기 시작한다.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "200px 0px 200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={cn("transition-all duration-700 ease-out", className)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}

/** 숫자가 올라가는 카운터 — 뷰포트 진입 시 1회 실행 */
export function CountUp({
  to,
  duration = 1200,
  className,
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (typeof IntersectionObserver === "undefined") {
      setN(to);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "200px 0px 200px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {n.toLocaleString("ko-KR")}
    </span>
  );
}
