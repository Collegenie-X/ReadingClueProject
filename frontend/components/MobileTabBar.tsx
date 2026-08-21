"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "./ui";
import { useCurrentUser } from "@/lib/useStore";
import { myGroups } from "@/lib/store";

export default function MobileTabBar() {
  const pathname = usePathname();
  const user = useCurrentUser();

  if (!user) return null;
  if (pathname === "/login" || pathname.startsWith("/quiz")) return null;

  const groups = myGroups();
  const gid = groups[0]?.id;

  const tabs = [
    { href: "/readmate", label: "홈", icon: "🏠", match: ["/readmate"] },
    {
      href: gid ? `/groups/${gid}/roadmap` : "/readmate?tab=community",
      label: "로드맵",
      icon: "📋",
      match: ["/roadmap"],
    },
    { href: "/cards/new", label: "작성", icon: "✏️", match: ["/cards/new"] },
    {
      href: gid ? `/groups/${gid}` : "/readmate?tab=community",
      label: "그룹",
      icon: "👥",
      match: ["/groups"],
    },
    { href: "/my", label: "내정보", icon: "📒", match: ["/my"] },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/95 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-5">
        {tabs.map((t) => {
          const on = t.match.some((m) => pathname.includes(m));
          const isWrite = t.label === "작성";
          return (
            <Link
              key={t.label}
              href={t.href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-bold transition",
                on ? "text-white" : "text-white/40",
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center text-[18px] leading-none",
                  isWrite &&
                    "grad-tab -mt-4 h-11 w-11 rounded-full text-[17px] shadow-[0_4px_16px_rgba(108,92,231,0.5)]",
                )}
              >
                {t.icon}
              </span>
              <span className={cn(isWrite && "mt-0.5")}>{t.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
