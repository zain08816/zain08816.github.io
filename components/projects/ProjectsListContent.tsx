import Link from "next/link";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import type { Project } from "@/lib/projects/types";
import styles from "@/app/projects/projects.module.css";

export function ProjectsListContent({
  projects,
  showNav = true,
}: {
  projects: Project[];
  showNav?: boolean;
}) {
  return (
    <>
      {showNav && (
        <PageBreadcrumb
          segments={[{ label: "Desktop", href: "/" }, { label: "Projects" }]}
        />
      )}
      <h1 className={styles.h1}>Projects</h1>
      <ul className={styles.list}>
        {projects.map((p) => (
          <li key={p.slug}>
            <Link href={`/projects/${p.slug}/`}>{p.title}</Link>
            <span className={styles.summary}> — {p.summary}</span>
          </li>
        ))}
      </ul>
      {projects.length === 0 && (
        <p className={styles.empty}>
          No projects yet — add Markdown under content/projects/
        </p>
      )}
    </>
  );
}
