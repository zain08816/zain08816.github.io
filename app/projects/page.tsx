import { getAllProjects } from "@/lib/projects/loadProjects";
import { ProjectsListContent } from "@/components/projects/ProjectsListContent";
import styles from "./projects.module.css";

export default async function ProjectsIndexPage() {
  const projects = await getAllProjects();

  return (
    <div className={styles.page}>
      <ProjectsListContent projects={projects} showNav />
    </div>
  );
}
