import Link from "next/link";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { findTool, TOOLS } from "@/lib/tools/catalog";
import { TOOLS_INDEX_PATH, toolPath } from "@/lib/tools/paths";
import { TOOL_CATEGORIES } from "@/lib/tools/types";
import { siteConfig } from "@/site.config";
import { ToolsApp } from "./ToolsApp";
import styles from "./ToolsScreen.module.css";

export const TOOLS_INDEX_TITLE = "Developer tools";

export const TOOLS_INDEX_DESCRIPTION =
  "Free in-browser tools to format, minify, escape, stringify, and parse JSON, encode and decode Base64, and convert URLs, HTML, hashes, timestamps, and CSV. Nothing you paste leaves the browser.";

function absolute(path: string): string {
  const base = siteConfig.canonicalUrl.replace(/\/$/, "");
  return `${base}${path}`;
}

function jsonLdScript(data: unknown) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export function ToolsScreen({ toolId }: { toolId?: string }) {
  const tool = toolId ? findTool(toolId) : undefined;
  const title = tool?.name ?? TOOLS_INDEX_TITLE;
  const description = tool?.blurb ?? TOOLS_INDEX_DESCRIPTION;
  const pagePath = tool ? toolPath(tool.id) : TOOLS_INDEX_PATH;
  const related = tool
    ? TOOLS.filter(
        (item) => item.category === tool.category && item.id !== tool.id
      )
    : [];
  const categoryLabel = TOOL_CATEGORIES.find(
    (category) => category.id === tool?.category
  )?.label;

  const breadcrumb = jsonLdScript({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absolute("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: TOOLS_INDEX_TITLE,
            item: absolute(TOOLS_INDEX_PATH),
          },
          ...(tool
            ? [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: tool.name,
                  item: absolute(pagePath),
                },
              ]
            : []),
        ],
      },
      tool
        ? {
            "@type": "WebApplication",
            name: tool.name,
            url: absolute(pagePath),
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            browserRequirements: "Requires JavaScript",
            isAccessibleForFree: true,
            description: tool.blurb,
          }
        : {
            "@type": "ItemList",
            name: TOOLS_INDEX_TITLE,
            url: absolute(TOOLS_INDEX_PATH),
            itemListElement: TOOLS.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              url: absolute(toolPath(item.id)),
              description: item.blurb,
            })),
          },
    ],
  });

  return (
    <article className={styles.page}>
      {breadcrumb}
      <PageBreadcrumb
        segments={[
          { label: "Desktop", href: "/" },
          tool
            ? { label: "Tools", href: TOOLS_INDEX_PATH }
            : { label: "Tools" },
          ...(tool ? [{ label: tool.name }] : []),
        ]}
      />
      <h1 className={styles.h1}>{title}</h1>
      <p className={styles.lead}>{description}</p>
      <p className={styles.note}>
        Paste text and press the button. The conversion runs on this device.
      </p>
      <div className={styles.frame}>
        <ToolsApp
          initialToolId={tool?.id}
          linkTools={Boolean(tool)}
          hideHeader={Boolean(tool)}
        />
      </div>

      {tool?.sample ? (
        <section className={styles.section} aria-labelledby="tool-example">
          <h2 id="tool-example" className={styles.h2}>
            Example input
          </h2>
          <pre className={styles.sample}>
            <code>{tool.sample}</code>
          </pre>
        </section>
      ) : null}

      {tool ? (
        <section className={styles.section} aria-labelledby="related-tools">
          <h2 id="related-tools" className={styles.h2}>
            More {categoryLabel} tools
          </h2>
          <ul className={styles.list}>
            {related.map((item) => (
              <li key={item.id}>
                <Link href={toolPath(item.id)}>{item.name}</Link>
                <span className={styles.blurb}> — {item.blurb}</span>
              </li>
            ))}
          </ul>
          <p className={styles.note}>
            <Link href={TOOLS_INDEX_PATH}>All developer tools</Link>
          </p>
        </section>
      ) : (
        <section className={styles.section} aria-labelledby="all-tools">
          <h2 id="all-tools" className={styles.h2}>
            All tools
          </h2>
          {TOOL_CATEGORIES.map((category) => {
            const items = TOOLS.filter((item) => item.category === category.id);
            return (
              <div key={category.id} className={styles.group}>
                <h3 className={styles.h3}>{category.label}</h3>
                <ul className={styles.list}>
                  {items.map((item) => (
                    <li key={item.id}>
                      <Link href={toolPath(item.id)}>{item.name}</Link>
                      <span className={styles.blurb}> — {item.blurb}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      )}
    </article>
  );
}
