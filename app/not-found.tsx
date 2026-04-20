import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <div className={styles.breadcrumbRow}>
        <PageBreadcrumb
          segments={[{ label: "Desktop", href: "/" }, { label: "Not found" }]}
        />
      </div>
      <h1 className={styles.title}>404</h1>
      <p className={styles.text}>Nothing here — this URL does not exist.</p>
    </div>
  );
}
