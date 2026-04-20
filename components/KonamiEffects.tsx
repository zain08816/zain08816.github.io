"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./KonamiEffects.module.css";

interface ConfettiPiece {
  id: number;
  leftPct: number;
  delayMs: number;
  durationMs: number;
  driftPx: number;
  rotateDeg: number;
  color: string;
}

type KonamiEffect = {
  id: string;
  run: () => void;
};

interface KonamiEffectDetail {
  effectId: string;
}

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
] as const;

const CONFETTI_COLORS = [
  "#7dd3fc",
  "#a78bfa",
  "#34d399",
  "#facc15",
  "#fb7185",
  "#f97316",
];

export function KonamiEffects() {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const clearTimerRef = useRef<number | null>(null);
  const seqIndexRef = useRef(0);

  const triggerConfetti = useCallback(() => {
    const count = 96;
    const pieces: ConfettiPiece[] = Array.from({ length: count }, (_, idx) => ({
      id: Date.now() + idx,
      leftPct: Math.random() * 100,
      delayMs: Math.floor(Math.random() * 480),
      durationMs: 2600 + Math.floor(Math.random() * 1800),
      driftPx: Math.round((Math.random() - 0.5) * 320),
      rotateDeg: 360 + Math.round(Math.random() * 640),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!,
    }));

    setConfettiPieces(pieces);
    if (clearTimerRef.current !== null) {
      window.clearTimeout(clearTimerRef.current);
    }
    clearTimerRef.current = window.setTimeout(() => {
      setConfettiPieces([]);
      clearTimerRef.current = null;
    }, 5600);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      return;
    }

    const effects: KonamiEffect[] = [{ id: "confetti", run: triggerConfetti }];

    const onKey = (e: KeyboardEvent) => {
      const expected = KONAMI_SEQUENCE[seqIndexRef.current];
      const actual = e.code === "KeyB" || e.code === "KeyA" ? e.code : e.key;
      if (actual === expected) {
        seqIndexRef.current += 1;
      } else {
        seqIndexRef.current = actual === KONAMI_SEQUENCE[0] ? 1 : 0;
      }

      if (seqIndexRef.current === KONAMI_SEQUENCE.length) {
        seqIndexRef.current = 0;
        const selected = effects[Math.floor(Math.random() * effects.length)];
        selected.run();
        window.dispatchEvent(
          new CustomEvent<KonamiEffectDetail>("konami:effect", {
            detail: { effectId: selected.id },
          })
        );
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [triggerConfetti]);

  useEffect(() => {
    return () => {
      if (clearTimerRef.current !== null) {
        window.clearTimeout(clearTimerRef.current);
      }
    };
  }, []);

  if (confettiPieces.length === 0) return null;

  return (
    <div className={styles.layer} aria-hidden>
      {confettiPieces.map((piece) => (
        <span
          key={piece.id}
          className={styles.piece}
          style={
            {
              left: `${piece.leftPct}%`,
              backgroundColor: piece.color,
              animationDelay: `${piece.delayMs}ms`,
              animationDuration: `${piece.durationMs}ms`,
              "--drift": `${piece.driftPx}px`,
              "--spin": `${piece.rotateDeg}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
