import { describe, expect, test } from "bun:test";

const read = (path: string) => Bun.file(new URL(`../${path}`, import.meta.url)).text();

describe("landing repository source of truth", () => {
  test("README agrees with the production deploy workflow", async () => {
    const [readme, deployWorkflow] = await Promise.all([
      read("README.md"),
      read(".github/workflows/deploy.yml"),
    ]);

    expect(deployWorkflow).toContain("branches: [main]");
    expect(deployWorkflow).toContain("wrangler pages deploy dist --project-name otta --branch main");
    expect(readme).not.toContain("NOT the deployed source");
    expect(readme).not.toContain("does NOT deploy from this repo");
    expect(readme).toContain("production source for https://otta.build");
  });
});
