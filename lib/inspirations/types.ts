export interface Inspiration {
  slug: string;
  title: string;
  /** Who made it / where it came from */
  source: string;
  href: string;
  /** Short note in your voice */
  note: string;
  /** ISO date string (YYYY-MM-DD) when noticed */
  date: string;
  sourcePath: string;
}
