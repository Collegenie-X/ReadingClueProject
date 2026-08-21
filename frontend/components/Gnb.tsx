"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "./ui";
import { useCurrentUser } from "@/lib/useStore";
import { logout, myGroups, resetAll } from "@/lib/store";

const MENU = [
  { href: "/quiz", label: "관심사 진단", icon: "🎯" },
  { href: "/books/explore", label: "책 탐색", icon: "📚" },
  { href: "/explore", label: "문제 아카이브", icon: "🌐" },
  { href: "/readmate", label: "독서 실행", icon: "🚀" },
  { href: "/about", label: "About", icon: "✨" },
];

export default function Gnb() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!profileRef.current?.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const groups = user ? myGroups() : [];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-black/95 backdrop-blur-xl">
      <div className="shell flex h-[72px] items-center justify-between gap-4">
        {/* 로고 */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="grad-brand flex h-9 w-9 items-center justify-center rounded-[16px] text-[17px] shadow-[0_0_16px_rgba(108,92,231,0.5)]">
            📖
          </span>
          <span className="text-[20px] leading-none font-bold tracking-[-0.5px] text-white">
            ReadingClue
          </span>
        </Link>

        {/* 데스크톱 메뉴 */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {MENU.map((m) => {
            const on = pathname === m.href || pathname.startsWith(m.href + "/");
            return (
              <Link
                key={m.href}
                href={m.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-[16px] px-3 py-2 text-[14px] font-medium transition",
                  on
                    ? "bg-white/8 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white",
                )}
              >
                <span className="text-[13px]">{m.icon}</span>
                {m.label}
              </Link>
            );
          })}
        </nav>

        {/* 우측 */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-[16px] border border-white/15 bg-white/5 px-2.5 py-1.5 text-[13px] font-semibold text-white/90 transition hover:bg-white/10"
              >
                <span className="text-[15px]">{user.avatar}</span>
                <span className="hidden max-w-[80px] truncate sm:inline">
                  {user.name}
                </span>
                <span className="text-[10px] text-white/40">▾</span>
              </button>

              {profileOpen && (
                <div className="panel-shell animate-pop absolute right-0 mt-2 w-60 overflow-hidden">
                  <div className="border-b border-white/8 px-4 py-3">
                    <p className="text-[14px] font-bold text-white">
                      {user.name}
                    </p>
                    <p className="text-[12px] text-white/45">
                      {user.role === "leader" ? "독서 지도자" : "멤버"}
                      {user.school ? ` · ${user.school}` : ""}
                    </p>
                  </div>

                  {groups.length > 0 && (
                    <div className="border-b border-white/8 py-1.5">
                      <p className="px-4 py-1 text-[11px] font-bold tracking-wide text-white/35">
                        내 그룹
                      </p>
                      {groups.slice(0, 3).map((g) => (
                        <Link
                          key={g.id}
                          href={`/groups/${g.id}`}
                          className="flex items-center gap-2 px-4 py-2 text-[13px] text-white/75 transition hover:bg-white/5 hover:text-white"
                        >
                          <span>{g.icon}</span>
                          <span className="truncate">{g.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="py-1.5">
                    {[
                      { href: "/my", label: "내 기록", icon: "📒" },
                      { href: "/readmate?tab=community", label: "독서 스페이스", icon: "👥" },
                    ].map((i) => (
                      <Link
                        key={i.href}
                        href={i.href}
                        className="flex items-center gap-2 px-4 py-2 text-[13px] text-white/75 transition hover:bg-white/5 hover:text-white"
                      >
                        <span>{i.icon}</span>
                        {i.label}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        logout();
                        router.push("/");
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-[13px] text-white/50 transition hover:bg-white/5 hover:text-white"
                    >
                      <span>↩</span> 로그아웃
                    </button>
                    <button
                      onClick={() => {
                        resetAll();
                        router.push("/");
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-[13px] text-white/35 transition hover:bg-white/5 hover:text-white"
                      title="localStorage를 초기 시드 상태로 되돌립니다"
                    >
                      <span>🔄</span> 데모 데이터 초기화
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-[16px] border border-white/15 bg-white/5 px-3 py-2 text-[14px] font-semibold text-white/90 transition hover:bg-white/10"
            >
              로그인
            </Link>
          )}

          {/* 모바일 햄버거 */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-[16px] border border-white/12 text-white/70 lg:hidden"
            aria-label="메뉴"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <nav className="animate-fade-up border-t border-white/8 bg-black/98 lg:hidden">
          <div className="shell flex flex-col py-2">
            {MENU.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="flex items-center gap-2.5 px-1 py-3 text-[15px] font-medium text-white/75 transition hover:text-white"
              >
                <span>{m.icon}</span>
                {m.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
