import { getAllEssays } from "@/lib/essays/loadEssays";
import { EssaysListContent } from "@/components/essays/EssaysListContent";
import styles from "./essays.module.css";

export default async function EssaysIndexPage() {
  const essays = await getAllEssays();

  return (
    <div className={styles.page}>
      <EssaysListContent essays={essays} showNav />
    </div>
  );
}
