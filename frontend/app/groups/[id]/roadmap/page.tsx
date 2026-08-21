"use client";

import { Suspense, use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Button,
  Panel,
  PanelHeader,
  ProgressBar,
  Badge,
  Modal,
  Stat,
  toast,
} from "@/components/ui";
import {
  MissionRow,
  MissionDetail,
  SmileChips,
  ACT_LABEL,
  ACT_COLOR,
} from "@/components/MissionCard";
import {
  getGroup,
  hasSubmitted,
  isLeaderOf,
  myProgress,
  submitMission,
  weekProgress,
} from "@/lib/store";
import { MISSIONS, getMission, totalWeeks } from "@/lib/data";
import { useMounted, useStoreVersion } from "@/lib/useStore";
import { pct } from "@/lib/format";
import type { Act, MissionStatus } from "@/lib/types";

export default function GroupRoadmapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense fallback={null}>
      <RoadmapView groupId={id} />
    </Suspense>
  );
}

const ACTS: Act[] = [1, 2, 3];

/** lg 브레이크포인트 — 상세를 모달로 띄울지 판단 */
const DESKTOP_MQ = () => window.matchMedia("(min-width: 1024px)");

function RoadmapView({ groupId }: { groupId: string }) {
  const mounted = useMounted();
  useStoreVersion();
  const search = useSearchParams();
  const [picked, setPicked] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 데스크톱으로 넓어지면 모달을 닫아 body 스크롤 잠금을 푼다
  useEffect(() => {
    const mq = DESKTOP_MQ();
    const onChange = () => mq.matches && setModalOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!mounted) return null;
  const group = getGroup(groupId);
  if (!group) return null;

  const leader = isLeaderOf(groupId);
  const weeks = totalWeeks(group.roadmapType);
  const missions = MISSIONS.filter((m) => m.week <= weeks);

  const queryWeek = Number(search.get("week"));
  const initialWeek =
    Number.isFinite(queryWeek) && queryWeek >= 1 && queryWeek <= weeks
      ? queryWeek
      : Math.min(group.currentWeek, weeks);
  const selectedWeek = picked ?? initialWeek;
  const selected = getMission(selectedWeek);

  function statusOf(week: number): MissionStatus {
    if (hasSubmitted(groupId, week)) return "done";
    if (week === group!.currentWeek) return "doing";
    if (week > group!.currentWeek) return "locked";
    return "todo";
  }

  function handlePick(week: number) {
    setPicked(week);
    // 데스크톱은 우측 상세로 보여주므로 모달은 모바일(lg 미만)에서만 연다
    const isDesktop =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches;
    setModalOpen(!isDesktop);
  }

  function handleSubmit(week: number) {
    const m = getMission(week);
    if (!m) return;
    submitMission(groupId, week, m.title);
    toast(`주 ${week} 미션을 완료로 표시했습니다`);
    setModalOpen(false);
  }

  // ── 상단 진행률 ─────────────────────────
  const mine = myProgress(groupId);
  const doneWeeks = missions.filter((m) => {
    const wp = weekProgress(groupId, m.week);
    return wp.total > 0 && wp.done === wp.total;
  }).length;
  const currentProg = weekProgress(groupId, group.currentWeek);

  return (
    <div className="shell py-6 md:py-8">
      {/* ══════════ 진행률 ══════════ */}
      <Panel className="mb-5">
        <PanelHeader
          title="전체 진행률"
          desc={`${group.roadmapType} · 시즌 ${group.season} · 현재 ${group.currentWeek}주차`}
          action={
            leader ? (
              <Button
                variant="square"
                onClick={() => toast("곧 지원할 예정입니다")}
              >
                ✏️ 커스터마이징
              </Button>
            ) : undefined
          }
        />
        <div className="px-4 py-4">
          {leader ? (
            <>
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] text-white/45">
                  전원 완료한 주차
                </span>
                <span className="text-[13px] font-bold text-white">
                  {doneWeeks}/{weeks}주
                </span>
              </div>
              <ProgressBar value={doneWeeks} total={weeks} className="mt-2" />
              <div className="mt-4 grid grid-cols-3 divide-x divide-white/8 border-t border-white/8 pt-2">
                <Stat label="총 주차" value={weeks} suffix="주" />
                <Stat
                  label={`주 ${group.currentWeek} 제출`}
                  value={`${currentProg.done}/${currentProg.total}`}
                  color="#22c55e"
                />
                <Stat
                  label="이번 주 달성률"
                  value={pct(currentProg.done, currentProg.total)}
                  suffix="%"
                  color="#a29bfe"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] text-white/45">내 완료 미션</span>
                <span className="text-[13px] font-bold text-white">
                  {mine.done}/{mine.total}주 ({pct(mine.done, mine.total)}%)
                </span>
              </div>
              <ProgressBar value={mine.done} total={mine.total} className="mt-2" />
              <p className="mt-3 text-[12px] leading-relaxed text-white/45">
                주 1~8까지 완주하면 수료로 인정됩니다. 9주차부터는 선택 과정이에요.
              </p>
            </>
          )}
        </div>
      </Panel>

      {/* ══════════ 목록 + 상세 ══════════ */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* 좌: 미션 목록 */}
        <div className="space-y-5 lg:col-span-1">
          {ACTS.map((act) => {
            const list = missions.filter((m) => m.act === act);
            if (list.length === 0) return null;
            const stages = Array.from(
              new Set(list.flatMap((m) => m.smile)),
            );
            const range = `주 ${list[0].week}~${list[list.length - 1].week}`;

            return (
              <div key={act}>
                {act === 3 && (
                  <p className="mb-4 flex items-center gap-2 text-[12px] font-bold text-white/30">
                    <span className="h-px flex-1 bg-white/10" />
                    ┈┈ 분기점: 여기까지도 완주 인정 ┈┈
                    <span className="h-px flex-1 bg-white/10" />
                  </p>
                )}

                <Panel
                  style={{ borderColor: `${ACT_COLOR[act]}33` }}
                >
                  <div
                    className="flex flex-wrap items-center gap-2 border-b px-4 py-3"
                    style={{
                      background: `${ACT_COLOR[act]}12`,
                      borderColor: `${ACT_COLOR[act]}33`,
                    }}
                  >
                    <Badge color={ACT_COLOR[act]}>{ACT_LABEL[act]}</Badge>
                    <span className="text-[12px] text-white/40">{range}</span>
                    {act === 3 && (
                      <span className="text-[12px] font-bold text-white/45">
                        (선택)
                      </span>
                    )}
                    <span className="ml-auto shrink-0">
                      <SmileChips stages={stages} />
                    </span>
                  </div>

                  <div>
                    {list.map((m) => (
                      <MissionRow
                        key={m.week}
                        mission={m}
                        status={statusOf(m.week)}
                        progress={
                          leader ? weekProgress(groupId, m.week) : undefined
                        }
                        active={m.week === selectedWeek}
                        onClick={() => handlePick(m.week)}
                      />
                    ))}
                  </div>
                </Panel>
              </div>
            );
          })}
        </div>

        {/* 우: 상세 (데스크톱) */}
        <div className="hidden lg:col-span-1 lg:block">
          {selected && (
            <Panel className="sticky top-5">
              <MissionDetail
                mission={selected}
                group={group}
                done={hasSubmitted(groupId, selected.week)}
                onSubmit={() => handleSubmit(selected.week)}
              />
            </Panel>
          )}
        </div>
      </div>

      {/* 모바일 상세 모달 */}
      <div className="lg:hidden">
        <Modal
          open={modalOpen && !!selected}
          onClose={() => setModalOpen(false)}
          title={selected ? `주 ${selected.week} 미션` : ""}
          width={560}
        >
          {selected && (
            <MissionDetail
              mission={selected}
              group={group}
              done={hasSubmitted(groupId, selected.week)}
              onSubmit={() => handleSubmit(selected.week)}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}
