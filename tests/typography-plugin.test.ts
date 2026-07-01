import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// LC issue #23: add @tailwindcss/typography ahead of blog/content pages.
// This is a config-readiness check, not a visual test — the plugin is not
// applied anywhere yet (AC2: no markup change, no "prose" class in use).

const landingRoot = join(import.meta.dir, "..");

describe("@tailwindcss/typography plugin registration (issue #23)", () => {
  test("is declared as a dependency in package.json", () => {
    const pkg = JSON.parse(
      readFileSync(join(landingRoot, "package.json"), "utf8")
    );
    expect(pkg.dependencies?.["@tailwindcss/typography"]).toBeDefined();
  });

  test("is registered via @plugin directive in the Tailwind v4 CSS entrypoint", () => {
    const css = readFileSync(
      join(landingRoot, "src/styles/global.css"),
      "utf8"
    );
    expect(css).toMatch(/@plugin\s+["']@tailwindcss\/typography["'];/);
  });
});
