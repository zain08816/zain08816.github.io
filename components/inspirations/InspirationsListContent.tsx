import Link from "next/link";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import type { Inspiration } from "@/lib/inspirations/types";
import styles from "@/app/inspirations/inspirations.module.css";

export function InspirationsListContent({
  inspirations,
  showNav = true,
}: {
  inspirations: Inspiration[];
  showNav?: boolean;
}) {
  return (
    <>
      {showNav && (
        <PageBreadcrumb
          segments={[
            { label: "Desktop", href: "/" },
            { label: "Inspirations" },
          ]}
        />
      )}
      <h1 className={styles.h1}>Inspirations</h1>
      <ul className={styles.list}>
        {inspirations.map((item) => (
          <li key={item.slug}>
            {item.date ? (
              <time className={styles.date} dateTime={item.date}>
                {item.date}
              </time>
            ) : null}
            {item.href ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
            ) : (
              <Link href={`/inspirations/${item.slug}/`}>{item.title}</Link>
            )}
            {item.source ? (
              <span className={styles.source}> — {item.source}</span>
            ) : null}
            {item.note ? <p className={styles.note}>{item.note}</p> : null}
          </li>
        ))}
      </ul>
      {inspirations.length === 0 && (
        <p className={styles.empty}>
          No inspirations yet — add Markdown under content/inspirations/
        </p>
      )}
    </>
  );
}
