"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MatrixRain.module.css";

export type MatrixRainVariant = "default" | "red" | "blue";

interface MatrixRainDetail {
  variant?: MatrixRainVariant;
  durationMs?: number;
  message?: { title: string; sub?: string };
  /** Non-blocking mode: transparent background, no click/key dismissal, no hint. */
  overlay?: boolean;
}

// Katakana + digits + a few latin letters — the canonical Matrix character set.
const GLYPHS =
  "ｦｱｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIZ:.*+-<>¦｜=";

const FONT_SIZE = 16;
const DEFAULT_DURATION_MS = 9000;
const FADE_OUT_MS = 520;

interface VariantStyle {
  head: string;
  trail: string;
  fadeAlpha: number;
  speedBias: number;
}

const VARIANT_STYLES: Record<MatrixRainVariant, VariantStyle> = {
  default: {
    head: "#d7ffd9",
    trail: "#00ff66",
    fadeAlpha: 0.07,
    speedBias: 1,
  },
  red: {
    head: "#ffd7d7",
    trail: "#ff2b2b",
    fadeAlpha: 0.05,
    speedBias: 1.35,
  },
  blue: {
    head: "#d7ecff",
    trail: "#3fa9ff",
    fadeAlpha: 0.09,
    speedBias: 0.75,
  },
};

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const dismissTimerRef = useRef<number | null>(null);
  const leaveTimerRef = useRef<number | null>(null);
  const dropsRef = useRef<number[]>([]);
  const speedsRef = useRef<number[]>([]);
  const variantRef = useRef<MatrixRainVariant>("default");
  const overlayRef = useRef<boolean>(false);

  const [active, setActive] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [message, setMessage] = useState<MatrixRainDetail["message"] | null>(
    null
  );

  const stop = useCallback(() => {
    setLeaving(true);
    if (dismissTimerRef.current !== null) {
      window.clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    if (leaveTimerRef.current !== null) {
      window.clearTimeout(leaveTimerRef.current);
    }
    leaveTimerRef.current = window.setTimeout(() => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setActive(false);
      setLeaving(false);
      setMessage(null);
      leaveTimerRef.current = null;
    }, FADE_OUT_MS);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onTrigger = (event: Event) => {
      const custom = event as CustomEvent<MatrixRainDetail>;
      const detail = custom.detail ?? {};
      variantRef.current = detail.variant ?? "default";
      const overlayMode = detail.overlay ?? false;
      overlayRef.current = overlayMode;
      setOverlay(overlayMode);
      setMessage(detail.message ?? null);
      setLeaving(false);
      setActive(true);

      if (dismissTimerRef.current !== null) {
        window.clearTimeout(dismissTimerRef.current);
      }
      dismissTimerRef.current = window.setTimeout(
        () => stop(),
        detail.durationMs ?? DEFAULT_DURATION_MS
      );
    };

    window.addEventListener("matrix:rain", onTrigger as EventListener);
    return () => {
      window.removeEventListener("matrix:rain", onTrigger as EventListener);
    };
  }, [stop]);

  useEffect(() => {
    if (!active) return;
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const columns = Math.ceil(w / FONT_SIZE);
      const prevDrops = dropsRef.current;
      const prevSpeeds = speedsRef.current;
      dropsRef.current = Array.from(
        { length: columns },
        (_, i) => prevDrops[i] ?? Math.random() * -50
      );
      speedsRef.current = Array.from(
        { length: columns },
        (_, i) => prevSpeeds[i] ?? 0.6 + Math.random() * 0.9
      );

      if (overlayRef.current) {
        ctx.clearRect(0, 0, w, h);
      } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);
      }
    };
    resize();

    window.addEventListener("resize", resize);

    const onKey = (e: KeyboardEvent) => {
      if (overlayRef.current) return;
      e.preventDefault();
      stop();
    };
    window.addEventListener("keydown", onKey);

    let last = performance.now();
    const frameInterval = 1000 / 30;

    const tick = (now: number) => {
      rafRef.current = window.requestAnimationFrame(tick);
      if (now - last < frameInterval) return;
      last = now;

      const style = VARIANT_STYLES[variantRef.current];
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (overlayRef.current) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = `rgba(0, 0, 0, ${style.fadeAlpha * 1.8})`;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";
      } else {
        ctx.fillStyle = `rgba(0, 0, 0, ${style.fadeAlpha})`;
        ctx.fillRect(0, 0, w, h);
      }

      ctx.font = `${FONT_SIZE}px var(--font-terminal), ui-monospace, monospace`;
      ctx.textBaseline = "top";

      const drops = dropsRef.current;
      const speeds = speedsRef.current;

      for (let i = 0; i < drops.length; i++) {
        const ch = GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
        const x = i * FONT_SIZE;
        const y = drops[i]! * FONT_SIZE;

        ctx.fillStyle = style.head;
        ctx.fillText(ch, x, y);

        if (drops[i]! > 1) {
          ctx.fillStyle = style.trail;
          ctx.fillText(
            GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length)),
            x,
            y - FONT_SIZE
          );
        }

        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i]! += speeds[i]! * style.speedBias;
        }
      }
    };
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, stop]);

  useEffect(() => {
    return () => {
      if (dismissTimerRef.current !== null) {
        window.clearTimeout(dismissTimerRef.current);
      }
      if (leaveTimerRef.current !== null) {
        window.clearTimeout(leaveTimerRef.current);
      }
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  if (!active) return null;

  const layerClass = [
    styles.layer,
    leaving ? styles.leaving : "",
    overlay ? styles.overlay : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={layerClass}
      aria-hidden
      onClick={overlay ? undefined : stop}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      {message && (
        <div className={styles.message}>
          <div className={styles.messageTitle}>{message.title}</div>
          {message.sub && <div className={styles.messageSub}>{message.sub}</div>}
        </div>
      )}
      {!overlay && (
        <div className={styles.hint}>press any key · click to exit</div>
      )}
    </div>
  );
}
