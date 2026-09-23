const BASE64_CHUNK = 0x8000;

export function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i += BASE64_CHUNK) {
    const end = Math.min(i + BASE64_CHUNK, bytes.length);
    for (let j = i; j < end; j++) {
      binary += String.fromCharCode(bytes[j] ?? 0);
    }
  }
  return btoa(binary);
}

export function base64ToUtf8(b64: string): string {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function normalizeBase64(input: string): string {
  let cleaned = input.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  if (!cleaned) throw new Error("Enter a Base64 string");
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(cleaned)) {
    throw new Error("Not valid Base64");
  }
  const remainder = cleaned.length % 4;
  if (remainder === 1) throw new Error("Not valid Base64");
  if (remainder > 0) cleaned += "=".repeat(4 - remainder);
  return cleaned;
}

export function encodeBase64(input: string): string {
  return utf8ToBase64(input);
}

export function decodeBase64(input: string): string {
  try {
    return base64ToUtf8(normalizeBase64(input));
  } catch (err) {
    if (err instanceof Error && err.message === "Not valid Base64") throw err;
    throw new Error("Not valid Base64");
  }
}

/** URL-safe Base64 without padding, the form used in JWTs. */
export function encodeBase64Url(input: string): string {
  return utf8ToBase64(input)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function encodeUrl(input: string): string {
  return encodeURIComponent(input);
}

export function decodeUrl(input: string): string {
  try {
    return decodeURIComponent(input.replace(/\+/g, " "));
  } catch {
    throw new Error("Not valid percent-encoding");
  }
}

const HTML_ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const HTML_NAMED: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00a0",
};

export function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (ch) => HTML_ESCAPE[ch] ?? ch);
}

export function unescapeHtml(input: string): string {
  return input.replace(
    /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]+);/g,
    (match, body: string) => {
      if (body.startsWith("#")) {
        const hex = body[1] === "x" || body[1] === "X";
        const code = hex
          ? Number.parseInt(body.slice(2), 16)
          : Number.parseInt(body.slice(1), 10);
        if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return match;
        return String.fromCodePoint(code);
      }
      return HTML_NAMED[body] ?? match;
    }
  );
}

export function textToHex(input: string): string {
  const bytes = new TextEncoder().encode(input);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(" ");
}

export function hexToText(input: string): string {
  const hex = input.replace(/0x/gi, "").replace(/[^0-9a-fA-F]/g, "");
  if (!hex) throw new Error("Enter hex bytes");
  if (hex.length % 2 !== 0) throw new Error("Hex length must be even");
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new Error("Those bytes are not valid UTF-8");
  }
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

export async function hashText(input: string): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error("This browser cannot hash text");
  }
  const data = new TextEncoder().encode(input);
  const algos = ["SHA-1", "SHA-256", "SHA-512"] as const;
  const lines: string[] = [];
  for (const algo of algos) {
    const digest = await crypto.subtle.digest(algo, data);
    lines.push(`${algo}  ${toHex(digest)}`);
  }
  return lines.join("\n");
}

export function newUuid(): string {
  if (!globalThis.crypto?.randomUUID) {
    throw new Error("This browser cannot generate a UUID");
  }
  return crypto.randomUUID();
}
