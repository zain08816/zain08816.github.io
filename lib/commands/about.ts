import type { CommandDef } from "@/lib/shell/types";

/** Condensed mirror of the public /about page for the terminal. */
export const about: CommandDef = {
  name: "about",
  category: "navigation",
  summary: "About me",
  usage: "about",
  run(_argv, opts, ctx) {
    if (opts.help) {
      return {
        stdout: ["usage: about"],
        stderr: [],
        exitCode: 0,
      };
    }

    const site = ctx.site;
    const resume = new URL("/about/", site.canonicalUrl).href;
    const { github, linkedin, email } = site.links;
    const skills = site.skills.join(", ");

    const lines = [
      "Zain Ali · Software Engineer, Mastercard · New York metro",
      "",
      "Rutgers University–New Brunswick — B.A. Computer Science & Psychology.",
      "",
      "Experience:",
      "  Mastercard — Software Engineer (Aug 2022–present)",
      "  Walmart Global Tech — Software Engineer (Oct 2021–Jul 2022)",
      "  Mastercard — SWE Intern (May 2021–Aug 2021)",
      "  HackRU — Frontend Developer (Jan 2020–Jun 2021)",
      "  Rutgers AIAA — Team Captain, RUAutonomous (Jun 2020–May 2021)",
      "",
      `Technical: ${skills}`,
      "",
      `LinkedIn  ${linkedin}`,
      `GitHub    ${github}`,
    ];

    if (email) {
      lines.push(`Email     ${email}`);
    }

    lines.push("", `Full page: ${resume}`);

    return {
      stdout: lines,
      stderr: [],
      exitCode: 0,
    };
  },
};
