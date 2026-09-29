import { notFound, redirect } from "next/navigation";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { getAllEssays } from "@/lib/essays/loadEssays";
import styles from "../essays.module.css";

/** Reserved when the collection is empty — static export needs ≥1 path. */
const EMPTY_PLACEHOLDER_SLUG = "_";

export async function generateStaticParams() {
  const essays = await getAllEssays();
  if (essays.length === 0) {
    return [{ slug: EMPTY_PLACEHOLDER_SLUG }];
  }
  return essays.map((essay) => ({ slug: essay.slug }));
}

export default async function EssayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const essays = await getAllEssays();
  if (essays.length === 0 || slug === EMPTY_PLACEHOLDER_SLUG) {
    redirect("/essays/");
  }
  const essay = essays.find((e) => e.slug === slug);
  if (!essay) notFound();

  return (
    <article className={styles.page}>
      <PageBreadcrumb
        segments={[
          { label: "Desktop", href: "/" },
          { label: "Essays", href: "/essays/" },
          { label: essay.title },
        ]}
      />
      <h1 className={styles.h1}>{essay.title}</h1>
      {essay.date ? (
        <p className={styles.lead}>
          <time dateTime={essay.date}>{essay.date}</time>
        </p>
      ) : null}
      {essay.summary ? <p className={styles.lead}>{essay.summary}</p> : null}
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: essay.htmlBody }}
      />
    </article>
  );
}
