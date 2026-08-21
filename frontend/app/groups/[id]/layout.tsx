"use client";

import { use } from "react";
import Link from "next/link";
import GroupNav from "@/components/GroupNav";
import { EmptyState } from "@/components/ui";
import { getGroup } from "@/lib/store";
import { useMounted, useStoreVersion } from "@/lib/useStore";

export default function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const mounted = useMounted();
  useStoreVersion();

  if (!mounted) return null;

  const group = getGroup(id);

  if (!group) {
    return (
      <div className="shell py-16">
        <EmptyState
          icon="🔍"
          title="그룹을 찾을 수 없어요"
          desc="삭제되었거나 잘못된 주소일 수 있습니다."
          action={
            <>
              <Link href="/readmate?tab=community" className="btn btn-pill">
                독서 스페이스로
              </Link>
              <Link href="/" className="btn btn-square">
                홈으로
              </Link>
            </>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <GroupNav group={group} />
      {children}
    </div>
  );
}
