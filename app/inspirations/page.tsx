import { getAllInspirations } from "@/lib/inspirations/loadInspirations";
import { InspirationsListContent } from "@/components/inspirations/InspirationsListContent";
import styles from "./inspirations.module.css";

export default async function InspirationsIndexPage() {
  const inspirations = await getAllInspirations();

  return (
    <div className={styles.page}>
      <InspirationsListContent inspirations={inspirations} showNav />
    </div>
  );
}
