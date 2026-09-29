import { notFound, redirect } from "next/navigation";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { getAllInspirations } from "@/lib/inspirations/loadInspirations";
import styles from "../inspirations.module.css";

/** Reserved when the collection is empty — static export needs ≥1 path. */
const EMPTY_PLACEHOLDER_SLUG = "_";

export async function generateStaticParams() {
  const inspirations = await getAllInspirations();
  if (inspirations.length === 0) {
    return [{ slug: EMPTY_PLACEHOLDER_SLUG }];
  }
  return inspirations.map((item) => ({ slug: item.slug }));
}

export default async function InspirationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const inspirations = await getAllInspirations();
  if (inspirations.length === 0 || slug === EMPTY_PLACEHOLDER_SLUG) {
    redirect("/inspirations/");
  }
  const item = inspirations.find((i) => i.slug === slug);
  if (!item) notFound();

  return (
    <article className={styles.page}>
      <PageBreadcrumb
        segments={[
          { label: "Desktop", href: "/" },
          { label: "Inspirations", href: "/inspirations/" },
          { label: item.title },
        ]}
      />
      <h1 className={styles.h1}>
        {item.href ? (
          <a href={item.href} target="_blank" rel="noopener noreferrer">
            {item.title}
          </a>
        ) : (
          item.title
        )}
      </h1>
      {item.source || item.date ? (
        <p className={styles.lead}>
          {item.source}
          {item.source && item.date ? " · " : null}
          {item.date ? <time dateTime={item.date}>{item.date}</time> : null}
        </p>
      ) : null}
      {item.note ? <p className={styles.note}>{item.note}</p> : null}
    </article>
  );
}
