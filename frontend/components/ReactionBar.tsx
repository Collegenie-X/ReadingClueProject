"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, Button, cn, toast } from "./ui";
import type { ReactionType } from "@/lib/types";
import { addReaction, myReaction, reactionCounts } from "@/lib/store";
import { useCurrentUser, useStoreVersion } from "@/lib/useStore";

export const REACTIONS: {
  type: ReactionType;
  emoji: string;
  label: string;
  color: string;
  prompt: string;
  requireComment: boolean;
}[] = [
  {
    type: "agree",
    emoji: "🤝",
    label: "공감",
    color: "#22c55e",
    prompt: "어떤 점에서 같은 문제를 느끼셨나요?",
    requireComment: false,
  },
  {
    type: "symptom",
    emoji: "🔍",
    label: "증상",
    color: "#fbbf24",
    prompt: "이게 왜 원인이 아니라 증상 같나요?",
    requireComment: true,
  },
  {
    type: "rebut",
    emoji: "⚔️",
    label: "반론",
    color: "#ef4444",
    prompt: "반대편에서 보면 어떻게 보이나요?",
    requireComment: true,
  },
];

const MIN_LEN = 20;

export default function ReactionBar({
  cardId,
  size = "md",
}: {
  cardId: string;
  size?: "sm" | "md";
}) {
  useStoreVersion();
  const user = useCurrentUser();
  const router = useRouter();
  const [open, setOpen] = useState<ReactionType | null>(null);
  const [comment, setComment] = useState("");

  const counts = reactionCounts(cardId);
  const mine = myReaction(cardId);
  const active = REACTIONS.find((r) => r.type === open);
  const needsComment = active?.requireComment ?? false;
  const tooShort = needsComment && comment.trim().length < MIN_LEN;

  function handleClick(type: ReactionType) {
    if (!user) {
      toast("로그인하면 반응을 남길 수 있어요");
      router.push("/login");
      return;
    }
    setComment(mine?.type === type ? mine.comment : "");
    setOpen(type);
  }

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-2",
          size === "sm" ? "text-[12px]" : "text-[13px]",
        )}
      >
        {REACTIONS.map((r) => {
          const on = mine?.type === r.type;
          const n = counts[r.type];
          return (
            <button
              key={r.type}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClick(r.type);
              }}
              className={cn(
                "flex items-center gap-1.5 border font-bold transition",
                size === "sm" ? "px-2 py-1" : "px-3 py-1.5",
              )}
              style={{
                color: on ? "#fff" : r.color,
                background: on ? r.color : `${r.color}14`,
                borderColor: on ? r.color : `${r.color}33`,
              }}
              title={r.label}
            >
              <span>{r.emoji}</span>
              <span>{n}</span>
            </button>
          );
        })}
      </div>

      <Modal
        open={!!open}
        onClose={() => setOpen(null)}
        title={
          active ? (
            <span className="flex items-center gap-2">
              <span>{active.emoji}</span>
              <span style={{ color: active.color }}>{active.label} 남기기</span>
            </span>
          ) : (
            ""
          )
        }
        footer={
          <>
            <Button variant="square" onClick={() => setOpen(null)}>
              취소
            </Button>
            <Button
              variant="pill"
              disabled={tooShort}
              onClick={() => {
                if (!open) return;
                addReaction(cardId, open, comment.trim());
                toast(`${active?.emoji} 반응이 등록되었습니다`);
                setOpen(null);
                setComment("");
              }}
            >
              등록하기
            </Button>
          </>
        }
      >
        <p className="mb-3 text-[13px] text-white/60">{active?.prompt}</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          autoFocus
          placeholder={
            needsComment
              ? "왜 그렇게 생각했는지 20자 이상 적어주세요"
              : "한 줄 남겨도 좋아요 (선택)"
          }
          className="input-rc resize-none"
        />
        <div className="mt-2 flex items-center justify-between text-[12px]">
          <span
            className={cn(
              needsComment && tooShort ? "text-[#ef4444]" : "text-white/35",
            )}
          >
            {needsComment
              ? tooShort
                ? `${MIN_LEN}자 이상 입력해 주세요 (현재 ${comment.trim().length}자)`
                : `${comment.trim().length}자 ✓`
              : "선택 입력"}
          </span>
        </div>
        {needsComment && (
          <p className="mt-3 border-l-2 border-white/15 pl-3 text-[12px] leading-relaxed text-white/40">
            🔍과 ⚔️는 코멘트 없이 누를 수 없습니다.
            <br />
            좋아요만 누르는 문화를 구조로 막습니다.
          </p>
        )}
      </Modal>
    </>
  );
}
