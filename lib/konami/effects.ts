export const KONAMI_EFFECT_IDS = [
  "confetti",
  "matrix-rain",
  "lives-up",
  "crt-glitch",
  "gravity-flip",
  "invert",
  "boot-rewind",
  "cursor-multiplier",
  "starfield-warp",
  "sprite-walk",
] as const;

export type KonamiEffectId = (typeof KONAMI_EFFECT_IDS)[number];

export interface KonamiTriggerDetail {
  effectId?: KonamiEffectId | string;
}
