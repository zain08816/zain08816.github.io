export interface Essay {
  slug: string;
  title: string;
  summary: string;
  /** ISO date string (YYYY-MM-DD) when present */
  date: string;
  htmlBody: string;
  sourcePath: string;
}
