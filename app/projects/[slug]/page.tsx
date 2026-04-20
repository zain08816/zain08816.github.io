import { notFound } from "next/navigation";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { getAllProjects } from "@/lib/projects/loadProjects";
import styles from "../projects.module.css";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projects = await getAllProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <article className={styles.page}>
      <PageBreadcrumb
        segments={[
          { label: "Desktop", href: "/" },
          { label: "Projects", href: "/projects/" },
          { label: project.title },
        ]}
      />
      <h1 className={styles.h1}>{project.title}</h1>
      <p className={styles.lead}>{project.summary}</p>
      {project.tags.length > 0 && (
        <p className={styles.lead}>Tags: {project.tags.join(", ")}</p>
      )}
      {project.links.length > 0 && (
        <ul className={styles.list}>
          {project.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: project.htmlBody }}
      />
    </article>
  );
}
