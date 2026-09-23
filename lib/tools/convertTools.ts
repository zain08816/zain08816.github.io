import { base64ToUtf8 } from "./encodeTools";

function queryObject(params: URLSearchParams): Record<string, string | string[]> {
  const query: Record<string, string | string[]> = {};
  for (const key of new Set(params.keys())) {
    const all = params.getAll(key);
    query[key] = all.length === 1 ? (all[0] ?? "") : all;
  }
  return query;
}

export function parseUrl(input: string): string {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    throw new Error("Enter an absolute URL, including http:// or https://");
  }
  return JSON.stringify(
    {
      href: url.href,
      protocol: url.protocol,
      username: url.username,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      query: queryObject(url.searchParams),
    },
    null,
    2
  );
}

export function parseQuery(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Enter a query string or URL");
  let params: URLSearchParams;
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    try {
      params = new URL(trimmed).searchParams;
    } catch {
      throw new Error("Enter a query string or an absolute URL");
    }
  } else {
    const q = trimmed.startsWith("?") ? trimmed.slice(1) : trimmed;
    params = new URLSearchParams(q);
  }
  const query = queryObject(params);
  if (Object.keys(query).length === 0) {
    throw new Error("No query parameters found");
  }
  return JSON.stringify(query, null, 2);
}

export function buildQuery(input: string): string {
  const value: unknown = JSON.parse(input);
  const params = new URLSearchParams();
  if (Array.isArray(value)) {
    for (const row of value) {
      if (!Array.isArray(row) || row.length < 2) {
        throw new Error('Expected pairs like ["q", "cats"]');
      }
      params.append(String(row[0]), String(row[1]));
    }
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (Array.isArray(item)) {
        for (const entry of item) params.append(key, String(entry));
      } else if (item != null) {
        params.append(key, String(item));
      }
    }
  } else {
    throw new Error("Expected a JSON object or an array of pairs");
  }
  return params.toString();
}

function decodeJwtPart(segment: string): unknown {
  let cleaned = segment.replace(/-/g, "+").replace(/_/g, "/");
  const remainder = cleaned.length % 4;
  if (remainder === 1) throw new Error("JWT segment is not valid Base64");
  if (remainder > 0) cleaned += "=".repeat(4 - remainder);
  try {
    return JSON.parse(base64ToUtf8(cleaned));
  } catch {
    throw new Error("JWT segment is not valid JSON");
  }
}

export function decodeJwt(input: string): string {
  const token = input.trim().replace(/^Bearer\s+/i, "");
  const parts = token.split(".");
  if (parts.length < 2 || !parts[0] || !parts[1]) {
    throw new Error("Enter a JWT (header.payload.signature)");
  }
  const header = decodeJwtPart(parts[0]);
  const payload = decodeJwtPart(parts[1]);
  const lines = [
    "Header",
    JSON.stringify(header, null, 2),
    "",
    "Payload",
    JSON.stringify(payload, null, 2),
  ];
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const record = payload as Record<string, unknown>;
    if (typeof record.exp === "number") {
      lines.push("", `exp: ${new Date(record.exp * 1000).toISOString()}`);
    }
    if (typeof record.iat === "number") {
      lines.push(`iat: ${new Date(record.iat * 1000).toISOString()}`);
    }
  }
  if (parts[2]) {
    lines.push("", "Signature is present and was not verified.");
  }
  return lines.join("\n");
}

export function unixToUtc(input: string): string {
  const trimmed = input.trim();
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) {
    throw new Error("Enter a Unix timestamp in seconds or milliseconds");
  }
  const n = Number(trimmed);
  if (!Number.isFinite(n)) {
    throw new Error("Enter a Unix timestamp in seconds or milliseconds");
  }
  const asMs = Math.abs(n) >= 1e11;
  const date = new Date(asMs ? n : n * 1000);
  if (Number.isNaN(date.getTime())) {
    throw new Error("That timestamp is out of range");
  }
  const unit = asMs ? "milliseconds" : "seconds";
  return `${date.toISOString()}\n(interpreted as ${unit})`;
}

export function utcToUnix(input: string): string {
  const date = new Date(input.trim());
  if (Number.isNaN(date.getTime())) {
    throw new Error("Enter a date like 2024-06-01T12:00:00Z");
  }
  const ms = date.getTime();
  return `${Math.floor(ms / 1000)}\n${ms} ms`;
}

function clampByte(n: number, label: string): number {
  if (!Number.isInteger(n) || n < 0 || n > 255) {
    throw new Error(`${label} must be an integer from 0 to 255`);
  }
  return n;
}

export function hexToRgb(input: string): string {
  let hex = input.trim().replace(/^#/, "");
  if (hex.length === 3 || hex.length === 4) {
    hex = Array.from(hex, (ch) => ch + ch).join("");
  }
  if (!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(hex)) {
    throw new Error("Enter a hex color like #1a2b3c");
  }
  const n = Number.parseInt(hex.slice(0, 6), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  if (hex.length === 8) {
    const alpha = Number.parseInt(hex.slice(6), 16) / 255;
    return `rgba(${r}, ${g}, ${b}, ${Number(alpha.toFixed(3))})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

export function rgbToHex(input: string): string {
  const match =
    input
      .trim()
      .match(
        /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i
      ) ?? input.trim().match(/^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)$/);
  if (!match) throw new Error("Enter a color like rgb(26, 43, 60)");
  const r = clampByte(Number(match[1]), "Red");
  const g = clampByte(Number(match[2]), "Green");
  const b = clampByte(Number(match[3]), "Blue");
  const hex = [r, g, b]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("");
  const alpha = match[4];
  if (alpha !== undefined) {
    const a = Number(alpha);
    if (!Number.isFinite(a) || a < 0 || a > 1) {
      throw new Error("Alpha must be a number from 0 to 1");
    }
    const byte = Math.round(a * 255)
      .toString(16)
      .padStart(2, "0");
    return `#${hex}${byte}`;
  }
  return `#${hex}`;
}

function csvCell(value: string, delimiter: string): string {
  if (
    value.includes(delimiter) ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r")
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function cellString(value: unknown): string {
  if (value == null) return "";
  switch (typeof value) {
    case "string":
      return value;
    case "number":
    case "boolean":
    case "bigint":
      return String(value);
    case "object":
      return JSON.stringify(value);
    case "undefined":
    case "function":
    case "symbol":
      return "";
  }
  return "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseTable(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const src = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < src.length; i++) {
    const ch = src[i] ?? "";
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"' && field.length === 0) {
      inQuotes = true;
      continue;
    }
    if (ch === delimiter) {
      row.push(field);
      field = "";
      continue;
    }
    if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
      continue;
    }
    field += ch;
  }

  if (inQuotes) throw new Error("Unclosed quote in the table");
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  while (rows.length > 0 && rows[rows.length - 1]?.every((cell) => cell === "")) {
    rows.pop();
  }
  return rows;
}

export function jsonToDelimited(input: string, delimiter: string): string {
  const value: unknown = JSON.parse(input);
  let rows: Record<string, unknown>[];
  if (Array.isArray(value)) {
    if (!value.every(isRecord)) {
      throw new Error("Expected a JSON array of objects");
    }
    rows = value;
  } else if (isRecord(value)) {
    rows = [value];
  } else {
    throw new Error("Expected a JSON object or an array of objects");
  }

  const keys: string[] = [];
  for (const record of rows) {
    for (const key of Object.keys(record)) {
      if (!keys.includes(key)) keys.push(key);
    }
  }
  const lines = [keys.map((key) => csvCell(key, delimiter)).join(delimiter)];
  for (const record of rows) {
    lines.push(
      keys.map((key) => csvCell(cellString(record[key]), delimiter)).join(delimiter)
    );
  }
  return lines.join("\n");
}

export function delimitedToJson(input: string, delimiter: string): string {
  const table = parseTable(input, delimiter);
  const header = table[0];
  if (!header || header.every((cell) => cell === "")) {
    throw new Error("No header row found");
  }
  const objects = table.slice(1).map((record) => {
    const obj: Record<string, string> = {};
    header.forEach((key, index) => {
      if (!key) return;
      obj[key] = record[index] ?? "";
    });
    return obj;
  });
  return JSON.stringify(objects, null, 2);
}
