import Link from "next/link";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import type { Essay } from "@/lib/essays/types";
import styles from "@/app/essays/essays.module.css";

export function EssaysListContent({
  essays,
  showNav = true,
}: {
  essays: Essay[];
  showNav?: boolean;
}) {
  return (
    <>
      {showNav && (
        <PageBreadcrumb
          segments={[{ label: "Desktop", href: "/" }, { label: "Essays" }]}
        />
      )}
      <h1 className={styles.h1}>Essays</h1>
      <ul className={styles.list}>
        {essays.map((essay) => (
          <li key={essay.slug}>
            {essay.date ? (
              <time className={styles.date} dateTime={essay.date}>
                {essay.date}
              </time>
            ) : null}
            <Link href={`/essays/${essay.slug}/`}>{essay.title}</Link>
            {essay.summary ? (
              <span className={styles.summary}> — {essay.summary}</span>
            ) : null}
          </li>
        ))}
      </ul>
      {essays.length === 0 && (
        <p className={styles.empty}>
          No essays yet — add Markdown under content/essays/
        </p>
      )}
    </>
  );
}
