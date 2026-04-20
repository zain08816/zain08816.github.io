"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./KonamiEffects.module.css";
import type { KonamiTriggerDetail } from "@/lib/konami/effects";

interface ConfettiPiece {
  id: number;
  leftPct: number;
  delayMs: number;
  durationMs: number;
  driftPx: number;
  rotateDeg: number;
  color: string;
}

interface CursorGhost {
  id: number;
  leftPct: number;
  topPct: number;
  driftX: number;
  driftY: number;
  delayMs: number;
  durationMs: number;
}

interface StarfieldStar {
  id: number;
  angleDeg: number;
  delayMs: number;
  durationMs: number;
  hue: number;
}

interface SpriteWalkState {
  id: number;
  flipped: boolean;
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

const FALLBACK_CURSOR_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="28" viewBox="0 0 20 28" shape-rendering="geometricPrecision"><path d="M2 1 L2 21 L7 16.5 L10.2 24 L13 22.8 L9.9 15.4 L16 15.4 Z" fill="#ffffff" stroke="#000000" stroke-width="1.4" stroke-linejoin="miter"/></svg>'
  );

function readThemedCursorUrl(): string {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return FALLBACK_CURSOR_SVG;
  }
  const cursorValue = window.getComputedStyle(document.body).cursor;
  const match = cursorValue.match(/url\((?:"([^"]+)"|'([^']+)'|([^)]+))\)/);
  const url = match?.[1] ?? match?.[2] ?? match?.[3];
  return url ?? FALLBACK_CURSOR_SVG;
}

const BOOT_REWIND_LINES = [
  "[REWIND] zain08816.github.io BIOS v2.26 — cold boot",
  "[REWIND] POST ... memory test 65536K OK",
  "[REWIND] detecting IDE devices ... [ MAIN/README ]",
  "[REWIND] detecting IDE devices ... [ PROJECTS/* ]",
  "[REWIND] loading shell profile ................ OK",
  "[REWIND] mounting /home/guest .................. OK",
  "[REWIND] restoring konami buffer ............... OK",
  "[REWIND] resume normal operation ...",
];

const GRAVITY_FLIP_DURATION_MS = 3600;
const INVERT_DURATION_MS = 1500;
const BOOT_REWIND_DURATION_MS = 3200;
const CURSOR_MULTIPLIER_DURATION_MS = 1800;
const STARFIELD_WARP_DURATION_MS = 1900;
const SPRITE_WALK_DURATION_MS = 5400;

function CodeMonkeySprite() {
  return (
    <svg
      className={styles.spriteSvg}
      viewBox="0 0 20 22"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      aria-hidden
    >
      <rect x="3" y="2" width="2" height="3" fill="#4a2f18" />
      <rect x="15" y="2" width="2" height="3" fill="#4a2f18" />
      <rect x="3" y="3" width="1" height="1" fill="#d19a6a" />
      <rect x="16" y="3" width="1" height="1" fill="#d19a6a" />

      <rect x="5" y="1" width="10" height="1" fill="#4a2f18" />
      <rect x="4" y="2" width="12" height="1" fill="#4a2f18" />
      <rect x="4" y="3" width="1" height="6" fill="#4a2f18" />
      <rect x="15" y="3" width="1" height="6" fill="#4a2f18" />
      <rect x="5" y="9" width="10" height="1" fill="#4a2f18" />

      <rect x="5" y="2" width="10" height="2" fill="#7a4d2a" />

      <rect x="5" y="4" width="10" height="5" fill="#f1c9a0" />

      <rect x="6" y="5" width="3" height="1" fill="#111111" />
      <rect x="6" y="7" width="3" height="1" fill="#111111" />
      <rect x="6" y="6" width="1" height="1" fill="#111111" />
      <rect x="8" y="6" width="1" height="1" fill="#111111" />
      <rect x="11" y="5" width="3" height="1" fill="#111111" />
      <rect x="11" y="7" width="3" height="1" fill="#111111" />
      <rect x="11" y="6" width="1" height="1" fill="#111111" />
      <rect x="13" y="6" width="1" height="1" fill="#111111" />
      <rect x="9" y="6" width="2" height="1" fill="#111111" />
      <rect x="7" y="6" width="1" height="1" fill="#ffffff" />
      <rect x="12" y="6" width="1" height="1" fill="#ffffff" />

      <rect x="9" y="8" width="2" height="1" fill="#4a2f18" />

      <rect x="5" y="10" width="10" height="4" fill="#7a4d2a" />
      <rect x="5" y="10" width="1" height="4" fill="#4a2f18" />
      <rect x="14" y="10" width="1" height="4" fill="#4a2f18" />

      <rect x="3" y="12" width="2" height="3" fill="#4a2f18" />
      <rect x="15" y="12" width="2" height="3" fill="#4a2f18" />

      <rect x="4" y="13" width="12" height="3" fill="#3a3a46" />
      <rect x="5" y="13" width="10" height="2" fill="#0a0f18" />
      <rect x="6" y="13" width="2" height="1" fill="#7dfc91" />
      <rect x="9" y="13" width="1" height="1" fill="#7dfc91" />
      <rect x="11" y="13" width="2" height="1" fill="#7dfc91" />
      <rect x="7" y="14" width="1" height="1" fill="#7dfc91" />
      <rect x="9" y="14" width="2" height="1" fill="#7dfc91" />
      <rect x="12" y="14" width="1" height="1" fill="#7dfc91" />

      <rect x="4" y="15" width="2" height="1" fill="#d19a6a" />
      <rect x="14" y="15" width="2" height="1" fill="#d19a6a" />

      <rect x="3" y="16" width="14" height="2" fill="#2a2a34" />
      <rect x="3" y="18" width="14" height="1" fill="#1a1a22" />
      <rect x="5" y="17" width="1" height="1" fill="#111111" />
      <rect x="7" y="17" width="1" height="1" fill="#111111" />
      <rect x="9" y="17" width="1" height="1" fill="#111111" />
      <rect x="11" y="17" width="1" height="1" fill="#111111" />
      <rect x="13" y="17" width="1" height="1" fill="#111111" />

      <rect x="6" y="19" width="2" height="2" fill="#4a2f18" />
      <rect x="12" y="19" width="2" height="2" fill="#4a2f18" />
      <rect x="5" y="21" width="4" height="1" fill="#2a1808" />
      <rect x="11" y="21" width="4" height="1" fill="#2a1808" />
    </svg>
  );
}

export function KonamiEffects() {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [livesToast, setLivesToast] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [bootRewind, setBootRewind] = useState(false);
  const [cursorGhosts, setCursorGhosts] = useState<CursorGhost[]>([]);
  const [cursorUrl, setCursorUrl] = useState<string>(FALLBACK_CURSOR_SVG);
  const [starfieldStars, setStarfieldStars] = useState<StarfieldStar[]>([]);
  const [spriteWalk, setSpriteWalk] = useState<SpriteWalkState | null>(null);

  const clearTimerRef = useRef<number | null>(null);
  const livesTimerRef = useRef<number | null>(null);
  const glitchTimerRef = useRef<number | null>(null);
  const gravityTimerRef = useRef<number | null>(null);
  const invertTimerRef = useRef<number | null>(null);
  const bootTimerRef = useRef<number | null>(null);
  const cursorTimerRef = useRef<number | null>(null);
  const starfieldTimerRef = useRef<number | null>(null);
  const spriteTimerRef = useRef<number | null>(null);
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

  const triggerMatrixRain = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("matrix:rain", {
        detail: { variant: "default", durationMs: 3500, overlay: true },
      })
    );
  }, []);

  const triggerLivesUp = useCallback(() => {
    setLivesToast(false);
    if (livesTimerRef.current !== null) {
      window.clearTimeout(livesTimerRef.current);
    }
    window.requestAnimationFrame(() => setLivesToast(true));
    livesTimerRef.current = window.setTimeout(() => {
      setLivesToast(false);
      livesTimerRef.current = null;
    }, 2200);
  }, []);

  const triggerCrtGlitch = useCallback(() => {
    setGlitching(true);
    if (typeof document !== "undefined") {
      document.body.classList.remove(styles.shake!);
      void document.body.offsetWidth;
      document.body.classList.add(styles.shake!);
    }
    if (glitchTimerRef.current !== null) {
      window.clearTimeout(glitchTimerRef.current);
    }
    glitchTimerRef.current = window.setTimeout(() => {
      setGlitching(false);
      if (typeof document !== "undefined") {
        document.body.classList.remove(styles.shake!);
      }
      glitchTimerRef.current = null;
    }, 650);
  }, []);

  const triggerGravityFlip = useCallback(() => {
    if (typeof document === "undefined" || !styles.gravityFlip) return;
    const cls = styles.gravityFlip;
    document.body.classList.remove(cls);
    void document.body.offsetWidth;
    document.body.classList.add(cls);
    if (gravityTimerRef.current !== null) {
      window.clearTimeout(gravityTimerRef.current);
    }
    gravityTimerRef.current = window.setTimeout(() => {
      document.body.classList.remove(cls);
      gravityTimerRef.current = null;
    }, GRAVITY_FLIP_DURATION_MS);
  }, []);

  const triggerInvert = useCallback(() => {
    if (typeof document === "undefined" || !styles.invert) return;
    const cls = styles.invert;
    document.documentElement.classList.remove(cls);
    void document.documentElement.offsetWidth;
    document.documentElement.classList.add(cls);
    if (invertTimerRef.current !== null) {
      window.clearTimeout(invertTimerRef.current);
    }
    invertTimerRef.current = window.setTimeout(() => {
      document.documentElement.classList.remove(cls);
      invertTimerRef.current = null;
    }, INVERT_DURATION_MS);
  }, []);

  const triggerBootRewind = useCallback(() => {
    setBootRewind(false);
    if (bootTimerRef.current !== null) {
      window.clearTimeout(bootTimerRef.current);
    }
    window.requestAnimationFrame(() => setBootRewind(true));
    bootTimerRef.current = window.setTimeout(() => {
      setBootRewind(false);
      bootTimerRef.current = null;
    }, BOOT_REWIND_DURATION_MS);
  }, []);

  const triggerStarfieldWarp = useCallback(() => {
    const count = 140;
    const stars: StarfieldStar[] = Array.from({ length: count }, (_, idx) => ({
      id: Date.now() + idx,
      angleDeg: Math.floor(Math.random() * 360),
      delayMs: Math.floor(Math.random() * 320),
      durationMs: 950 + Math.floor(Math.random() * 650),
      hue: 190 + Math.floor(Math.random() * 40),
    }));
    setStarfieldStars(stars);
    if (starfieldTimerRef.current !== null) {
      window.clearTimeout(starfieldTimerRef.current);
    }
    starfieldTimerRef.current = window.setTimeout(() => {
      setStarfieldStars([]);
      starfieldTimerRef.current = null;
    }, STARFIELD_WARP_DURATION_MS);
  }, []);

  const triggerSpriteWalk = useCallback(() => {
    setSpriteWalk({
      id: Date.now(),
      flipped: Math.random() < 0.5,
    });
    if (spriteTimerRef.current !== null) {
      window.clearTimeout(spriteTimerRef.current);
    }
    spriteTimerRef.current = window.setTimeout(() => {
      setSpriteWalk(null);
      spriteTimerRef.current = null;
    }, SPRITE_WALK_DURATION_MS);
  }, []);

  const triggerCursorMultiplier = useCallback(() => {
    const count = 12;
    const ghosts: CursorGhost[] = Array.from({ length: count }, (_, idx) => ({
      id: Date.now() + idx,
      leftPct: 10 + Math.random() * 80,
      topPct: 15 + Math.random() * 70,
      driftX: Math.round((Math.random() - 0.5) * 480),
      driftY: Math.round((Math.random() - 0.5) * 360),
      delayMs: Math.floor(Math.random() * 240),
      durationMs: 1100 + Math.floor(Math.random() * 600),
    }));
    setCursorUrl(readThemedCursorUrl());
    setCursorGhosts(ghosts);
    if (cursorTimerRef.current !== null) {
      window.clearTimeout(cursorTimerRef.current);
    }
    cursorTimerRef.current = window.setTimeout(() => {
      setCursorGhosts([]);
      cursorTimerRef.current = null;
    }, CURSOR_MULTIPLIER_DURATION_MS);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const effects: KonamiEffect[] = [
      { id: "confetti", run: triggerConfetti },
      { id: "matrix-rain", run: triggerMatrixRain },
      { id: "lives-up", run: triggerLivesUp },
      { id: "crt-glitch", run: triggerCrtGlitch },
      { id: "gravity-flip", run: triggerGravityFlip },
      { id: "invert", run: triggerInvert },
      { id: "boot-rewind", run: triggerBootRewind },
      { id: "cursor-multiplier", run: triggerCursorMultiplier },
      { id: "starfield-warp", run: triggerStarfieldWarp },
      { id: "sprite-walk", run: triggerSpriteWalk },
    ];
    const byId = new Map(effects.map((e) => [e.id, e] as const));

    const runAndAnnounce = (selected: KonamiEffect) => {
      selected.run();
      window.dispatchEvent(
        new CustomEvent<KonamiEffectDetail>("konami:effect", {
          detail: { effectId: selected.id },
        })
      );
    };

    const onTrigger = (e: Event) => {
      const detail = (e as CustomEvent<KonamiTriggerDetail>).detail;
      const requested = detail?.effectId;
      const selected = requested
        ? byId.get(requested)
        : effects[Math.floor(Math.random() * effects.length)];
      if (!selected) return;
      runAndAnnounce(selected);
    };

    window.addEventListener("konami:trigger", onTrigger as EventListener);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let onKey: ((e: KeyboardEvent) => void) | null = null;
    if (!reducedMotion.matches) {
      onKey = (e: KeyboardEvent) => {
        const expected = KONAMI_SEQUENCE[seqIndexRef.current];
        const actual = e.code === "KeyB" || e.code === "KeyA" ? e.code : e.key;
        if (actual === expected) {
          seqIndexRef.current += 1;
        } else {
          seqIndexRef.current = actual === KONAMI_SEQUENCE[0] ? 1 : 0;
        }

        if (seqIndexRef.current === KONAMI_SEQUENCE.length) {
          seqIndexRef.current = 0;
          const selected = effects[Math.floor(Math.random() * effects.length)]!;
          runAndAnnounce(selected);
        }
      };
      window.addEventListener("keydown", onKey);
    }

    return () => {
      window.removeEventListener("konami:trigger", onTrigger as EventListener);
      if (onKey) window.removeEventListener("keydown", onKey);
    };
  }, [
    triggerConfetti,
    triggerMatrixRain,
    triggerLivesUp,
    triggerCrtGlitch,
    triggerGravityFlip,
    triggerInvert,
    triggerBootRewind,
    triggerCursorMultiplier,
    triggerStarfieldWarp,
    triggerSpriteWalk,
  ]);

  useEffect(() => {
    return () => {
      if (clearTimerRef.current !== null) {
        window.clearTimeout(clearTimerRef.current);
      }
      if (livesTimerRef.current !== null) {
        window.clearTimeout(livesTimerRef.current);
      }
      if (glitchTimerRef.current !== null) {
        window.clearTimeout(glitchTimerRef.current);
      }
      if (gravityTimerRef.current !== null) {
        window.clearTimeout(gravityTimerRef.current);
      }
      if (invertTimerRef.current !== null) {
        window.clearTimeout(invertTimerRef.current);
      }
      if (bootTimerRef.current !== null) {
        window.clearTimeout(bootTimerRef.current);
      }
      if (cursorTimerRef.current !== null) {
        window.clearTimeout(cursorTimerRef.current);
      }
      if (starfieldTimerRef.current !== null) {
        window.clearTimeout(starfieldTimerRef.current);
      }
      if (spriteTimerRef.current !== null) {
        window.clearTimeout(spriteTimerRef.current);
      }
      if (typeof document !== "undefined") {
        if (styles.shake) {
          document.body.classList.remove(styles.shake);
        }
        if (styles.gravityFlip) {
          document.body.classList.remove(styles.gravityFlip);
        }
        if (styles.invert) {
          document.documentElement.classList.remove(styles.invert);
        }
      }
    };
  }, []);

  const hasConfetti = confettiPieces.length > 0;
  const hasCursorGhosts = cursorGhosts.length > 0;
  const hasStarfield = starfieldStars.length > 0;
  const hasSprite = spriteWalk !== null;
  if (
    !hasConfetti &&
    !livesToast &&
    !glitching &&
    !bootRewind &&
    !hasCursorGhosts &&
    !hasStarfield &&
    !hasSprite
  )
    return null;

  return (
    <>
      {hasConfetti ? (
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
      ) : null}

      {livesToast ? (
        <div className={styles.livesToast} role="status" aria-live="polite">
          <span className={styles.livesToastLabel}>LIVES</span>
          <span className={styles.livesToastValue}>+30</span>
        </div>
      ) : null}

      {glitching ? <div className={styles.glitch} aria-hidden /> : null}

      {bootRewind ? (
        <div className={styles.bootLayer} aria-hidden>
          <div className={styles.bootPanel}>
            {BOOT_REWIND_LINES.map((line, idx) => (
              <div
                key={`${idx}-${line}`}
                className={styles.bootLine}
                style={
                  {
                    animationDelay: `${idx * 180}ms`,
                  } as CSSProperties
                }
              >
                {line}
              </div>
            ))}
            <span className={styles.bootCursor} aria-hidden>
              █
            </span>
          </div>
        </div>
      ) : null}

      {hasCursorGhosts ? (
        <div className={styles.cursorLayer} aria-hidden>
          {cursorGhosts.map((ghost) => (
            <span
              key={ghost.id}
              className={styles.cursorGhost}
              style={
                {
                  left: `${ghost.leftPct}%`,
                  top: `${ghost.topPct}%`,
                  animationDelay: `${ghost.delayMs}ms`,
                  animationDuration: `${ghost.durationMs}ms`,
                  backgroundImage: `url("${cursorUrl}")`,
                  "--cx": `${ghost.driftX}px`,
                  "--cy": `${ghost.driftY}px`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ) : null}

      {hasStarfield ? (
        <div className={styles.starfieldLayer} aria-hidden>
          {starfieldStars.map((star) => (
            <span
              key={star.id}
              className={styles.starfieldStar}
              style={
                {
                  animationDelay: `${star.delayMs}ms`,
                  animationDuration: `${star.durationMs}ms`,
                  "--angle": `${star.angleDeg}deg`,
                  "--hue": `${star.hue}`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ) : null}

      {spriteWalk ? (
        <div
          key={spriteWalk.id}
          className={styles.spriteLayer}
          aria-hidden
        >
          <div
            className={styles.spriteTrack}
            style={
              {
                animationDirection: spriteWalk.flipped ? "reverse" : "normal",
              } as CSSProperties
            }
          >
            <div className={styles.spriteBob}>
              <div
                className={styles.spriteFlip}
                style={
                  {
                    transform: spriteWalk.flipped ? "scaleX(-1)" : undefined,
                  } as CSSProperties
                }
              >
                <CodeMonkeySprite />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
