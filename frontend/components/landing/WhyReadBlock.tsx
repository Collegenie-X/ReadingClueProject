import Reveal from "@/components/Reveal";
import Highlight from "@/components/ui/Highlight";
import { ECOSYSTEM } from "@/lib/landing";
import OecdTabs from "./OecdTabs";

const WHY = ECOSYSTEM.why;
const OECD = WHY.oecd;

/**
 * 생태계 섹션 하단 — "왜 읽어야 하는가 / 어디까지 발전시켜야 하는가"
 * 경험(책) × 제작(프로젝트·마찰) = 창의 · 융합 이라는 논지를 공식 → 사다리 순으로 보여준다
 */
/** 공식 사이의 연산자 — 은은한 발광 링으로 강조해 '곱셈'이라는 논지를 눈에 띄게 만든다 */
function FormulaOp({ symbol, color }: { symbol: string; color: string }) {
  return (
    <div className="flex items-center justify-center py-1 lg:py-0">
      <span
        className="flex h-10 w-10 items-center justify-center rounded-full text-[20px] font-black"
        style={{
          color,
          background: `${color}1a`,
          border: `1px solid ${color}59`,
          boxShadow: `0 0 22px ${color}40`,
        }}
      >
        {symbol}
      </span>
    </div>
  );
}

export default function WhyReadBlock() {
  return (
    <Reveal delay={160} className="mt-14 md:mt-20">
      <div className="rounded-[26px] border border-white/8 bg-white/[.02] p-6 md:p-10">
        {/* 논지 */}
        <p className="text-[11px] font-bold tracking-[0.18em] text-violet-300/70">{WHY.eyebrow}</p>
        <h3 className="mt-2 text-[24px] leading-tight font-black text-white md:text-[30px]">
          {WHY.titleA}{" "}
          <span className="bg-gradient-to-r from-violet-300 to-emerald-300 bg-clip-text text-transparent">
            {WHY.titleHi}
          </span>
        </h3>
        <p className="mt-3 max-w-[62ch] text-[13.5px] leading-relaxed text-white/50 md:text-[14.5px]">
          <Highlight text={WHY.desc} color="#a78bfa" />
        </p>

        {/* 공식 — 경험 × 제작 = 창의·융합 */}
        <div className="mt-8 grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          {WHY.formula.terms.map((t, i) => (
            <div key={t.label} className="contents">
              {i > 0 && <FormulaOp symbol="×" color="#8b5cf6" />}
              <div
                className="rounded-[20px] border p-5"
                style={{ borderColor: `${t.color}33`, background: `${t.color}0a` }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[18px]"
                    style={{ background: `${t.color}1f`, border: `1px solid ${t.color}3d` }}
                  >
                    {t.emoji}
                  </span>
                  <span>
                    <span className="block text-[15px] font-black text-white">{t.label}</span>
                    <span className="block text-[11.5px] font-bold" style={{ color: t.color }}>
                      {t.sub}
                    </span>
                  </span>
                </div>
                <p className="mt-3 text-[12.5px] leading-relaxed text-white/45">
                  <Highlight text={t.desc} color={t.color} />
                </p>
              </div>
            </div>
          ))}

          <FormulaOp symbol="=" color={WHY.formula.result.color} />

          <div
            className="rounded-[20px] border p-5"
            style={{
              borderColor: `${WHY.formula.result.color}4d`,
              background: `${WHY.formula.result.color}12`,
            }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-[18px]"
                style={{
                  background: `${WHY.formula.result.color}26`,
                  border: `1px solid ${WHY.formula.result.color}59`,
                }}
              >
                {WHY.formula.result.emoji}
              </span>
              <span className="text-[15px] font-black text-white">{WHY.formula.result.label}</span>
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-white/55">
              <Highlight text={WHY.formula.result.desc} color={WHY.formula.result.color} />
            </p>
          </div>
        </div>

        <p className="mt-3 text-[11.5px] leading-relaxed text-white/35">
          <Highlight text={WHY.formula.caption} color={WHY.formula.result.color} />
        </p>

        {/* OECD 인재상 — 우리가 말하는 '창의·융합'의 출처와 정의 */}
        <div className="mt-10 border-t border-white/8 pt-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/25 bg-sky-500/10 px-2.5 py-1 text-[10.5px] font-bold text-sky-300">
            📘 {OECD.badge}
          </span>
          <h4 className="mt-3 text-[17px] font-black text-white md:text-[19px]">{OECD.title}</h4>
          <p className="mt-1.5 max-w-[70ch] text-[13px] leading-relaxed text-white/45">
            <Highlight text={OECD.desc} color="#38bdf8" />
          </p>

          <OecdTabs />

          {/* 출처 — 기본은 접어 둔다 */}
          <details className="group mt-6 rounded-[16px] border border-white/8 bg-white/[.015] p-4">
            <summary className="cursor-pointer list-none text-[10.5px] font-bold tracking-wider text-white/35 hover:text-white/60">
              SOURCES · 출처 3건 <span className="group-open:hidden">＋</span>
              <span className="hidden group-open:inline">－</span>
            </summary>
            <ul className="mt-3 flex flex-col gap-2">
              {OECD.sources.map((s) => (
                <li key={s.label} className="text-[12px] leading-relaxed">
                  <span className="font-bold text-white/70">{s.label}</span>
                  <span className="block text-white/35">
                    <Highlight text={s.note} color="#38bdf8" tone="text" />
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] leading-relaxed text-white/25">{OECD.sourceNote}</p>
          </details>
        </div>

        {/* 사다리 — 어디까지 발전시켜야 하는가 */}
        <div className="mt-10 border-t border-white/8 pt-8">
          <h4 className="text-[17px] font-black text-white md:text-[19px]">{WHY.ladderTitle}</h4>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/45">
            <Highlight text={WHY.ladderDesc} color="#a78bfa" />
          </p>

          <ol className="mt-6 grid gap-2.5 md:grid-cols-5">
            {WHY.ladder.map((s) => (
              <li
                key={s.no}
                className="rounded-[18px] border p-4"
                style={{
                  borderColor: s.weak ? "rgba(255,255,255,.08)" : `${s.color}3d`,
                  background: s.weak ? "rgba(255,255,255,.015)" : `${s.color}0f`,
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="text-[11px] font-black tracking-wider"
                    style={{ color: s.weak ? "rgba(255,255,255,.3)" : s.color }}
                  >
                    {s.no}
                  </span>
                  <span
                    className="rounded-full px-1.5 py-px text-[9.5px] font-bold"
                    style={{
                      background: s.weak ? "rgba(255,255,255,.06)" : `${s.color}26`,
                      color: s.weak ? "rgba(255,255,255,.35)" : s.color,
                    }}
                  >
                    {s.state}
                  </span>
                </div>
                <p
                  className="mt-2 text-[15px] font-black"
                  style={{ color: s.weak ? "rgba(255,255,255,.45)" : "#fff" }}
                >
                  {s.name}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-white/40">
                  <Highlight text={s.desc} color={s.weak ? "#94a3b8" : s.color} tone={s.weak ? "text" : "mark"} />
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-6 rounded-[16px] border border-violet-400/20 bg-violet-500/[.07] p-4 text-[13px] leading-relaxed text-white/65">
            <Highlight text={WHY.closing} color="#a78bfa" />
          </p>
        </div>
      </div>
    </Reveal>
  );
}
