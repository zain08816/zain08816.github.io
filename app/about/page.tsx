import type { Metadata } from "next";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { siteConfig } from "@/site.config";
import { AboutContent } from "@/components/about/AboutContent";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: `About — ${siteConfig.siteTitle}`,
  description:
    "Software engineer background: experience at Mastercard and Walmart Global Tech, education at Rutgers, and selected skills.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <article className={styles.page}>
      <PageBreadcrumb
        segments={[{ label: "Desktop", href: "/" }, { label: "About" }]}
      />
      <AboutContent site={siteConfig} />
    </article>
  );
}
