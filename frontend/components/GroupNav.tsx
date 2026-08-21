"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "./ui";
import InviteCodeBox from "./InviteCodeBox";
import type { Group } from "@/lib/types";
import { isLeaderOf, groupMembers, groupCrews } from "@/lib/store";

export default function GroupNav({ group }: { group: Group }) {
  const pathname = usePathname();
  const leader = isLeaderOf(group.id);
  const members = groupMembers(group.id);
  const crews = groupCrews(group.id);

  const tabs = [
    { href: `/groups/${group.id}`, label: "홈", icon: "🏠", exact: true },
    { href: `/groups/${group.id}/feed`, label: "피드", icon: "📰" },
    { href: `/groups/${group.id}/roadmap`, label: "로드맵", icon: "📋" },
    { href: `/groups/${group.id}/crews`, label: "크루", icon: "👥" },
    ...(leader
      ? [{ href: `/groups/${group.id}/report`, label: "리포트", icon: "📊" }]
      : []),
  ];

  return (
    <div className="border-b border-white/8 bg-white/2">
      <div className="shell pt-5 pb-0">
        {/* 헤더 */}
        <div className="flex flex-wrap items-start justify-between gap-3 pb-4">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[20px] text-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(108,92,231,.16), rgba(108,92,231,.06))",
                border: "1px solid rgba(108,92,231,.19)",
              }}
            >
              {group.icon}
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-[19px] leading-tight font-extrabold text-white sm:text-[22px]">
                {group.name}
              </h1>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-white/45">
                <span>👥 {members.length}명</span>
                <span>·</span>
                <span>크루 {crews.length}개</span>
                <span>·</span>
                <span>시즌 {group.season}</span>
                <span>·</span>
                <span className="font-bold text-[#a29bfe]">
                  {group.currentWeek}주차
                </span>
              </p>
            </div>
          </div>

          {leader && (
            <div className="flex shrink-0 items-center gap-2">
              <InviteCodeBox code={group.inviteCode} compact />
            </div>
          )}
        </div>

        {/* 탭 */}
        <nav className="no-scrollbar -mb-px flex gap-1 overflow-x-auto">
          {tabs.map((t) => {
            const on = t.exact
              ? pathname === t.href
              : pathname.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 px-4 py-2.5 text-[13px] font-bold transition sm:px-5",
                  on
                    ? "grad-tab text-white shadow-[0_4px_16px_rgba(108,92,231,0.35)]"
                    : "border border-white/8 border-b-0 bg-white/4 text-white/60 hover:text-white",
                )}
              >
                <span>{t.icon}</span>
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
