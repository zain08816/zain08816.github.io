import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./PageBreadcrumb.module.css";

export type PageBreadcrumbSegment = {
  label: string;
  /** Omit on the current (last) segment */
  href?: string;
};

export function PageBreadcrumb({ segments }: { segments: PageBreadcrumbSegment[] }) {
  if (segments.length === 0) return null;

  const items: ReactNode[] = [];
  segments.forEach((seg, i) => {
    if (i > 0) {
      items.push(
        <li key={`sep-${i}`} className={styles.sep} aria-hidden="true">
          /
        </li>
      );
    }
    const key = `seg-${i}`;
    if (seg.href) {
      items.push(
        <li key={key}>
          <Link href={seg.href}>{seg.label}</Link>
        </li>
      );
    } else {
      items.push(
        <li key={key} aria-current="page">
          {seg.label}
        </li>
      );
    }
  });

  return (
    <nav className={styles.wrap} aria-label="Breadcrumb">
      <ol className={styles.list}>{items}</ol>
    </nav>
  );
}
