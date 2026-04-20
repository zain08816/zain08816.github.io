export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  links: ProjectLink[];
  htmlBody: string;
  sourcePath: string;
}
