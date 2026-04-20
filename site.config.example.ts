/**
 * Example fragments — copy fields into `site.config.ts`.
 * Do not import this file from production code.
 */
export const exampleWelcomeOptions = {
  welcomeMode: "full" as const,
  welcomeShowAsciiBanner: true,
  welcomeShowCommandCatalog: true,
  welcomeCatalogIntro: "Available commands (also try `help`):",
};

export const exampleMotdLines = [
  "Welcome. Type `help` for available commands.",
];

export const exampleAsciiBanner = [
  "  ___       _ ",
  " | __| _ _ (_)___ ",
  " | _| | '_|| / _ \\",
  " |_| |_| |_||_|___/",
].join("\n");
