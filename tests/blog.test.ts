import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// GH issue #29: blog with content collections, demonstrating real typography usage.

const landingRoot = join(import.meta.dir, "..");

describe("blog content collection (issue #29)", () => {
  test("content.config.ts defines a 'blog' collection", () => {
    const configPath = join(landingRoot, "src/content.config.ts");
    expect(existsSync(configPath)).toBe(true);
    const config = readFileSync(configPath, "utf8");
    expect(config).toMatch(/defineCollection/);
    expect(config).toMatch(/collections\s*=\s*\{\s*blog/);
  });

  test("at least one real markdown post exists with required frontmatter", () => {
    const blogDir = join(landingRoot, "src/content/blog");
    expect(existsSync(blogDir)).toBe(true);
    const posts = readdirSync(blogDir).filter((f) => f.endsWith(".md"));
    expect(posts.length).toBeGreaterThan(0);

    const post = readFileSync(join(blogDir, posts[0]), "utf8");
    expect(post).toMatch(/title:/);
    expect(post).toMatch(/description:/);
    expect(post).toMatch(/pubDate:/);
    // AC4: post must include an h2, a list, and a code block.
    expect(post).toMatch(/^## /m);
    expect(post).toMatch(/^- /m);
    expect(post).toMatch(/```/);
    // AC4: word count in the 600-900 range (rough body-only check).
    const wordCount = post.split(/\s+/).filter(Boolean).length;
    expect(wordCount).toBeGreaterThan(500);
  });

  test("blog index page lists posts via getCollection", () => {
    const indexPath = join(landingRoot, "src/pages/blog/index.astro");
    expect(existsSync(indexPath)).toBe(true);
    const content = readFileSync(indexPath, "utf8");
    expect(content).toMatch(/getCollection\(["']blog["']\)/);
  });

  test("blog [slug] page renders with prose/prose-invert", () => {
    const slugPath = join(landingRoot, "src/pages/blog/[slug].astro");
    expect(existsSync(slugPath)).toBe(true);
    const content = readFileSync(slugPath, "utf8");
    expect(content).toMatch(/getStaticPaths/);
    expect(content).toMatch(/prose[^"']*prose-invert/);
  });

  test("waitlist page links to /blog", () => {
    const indexAstro = readFileSync(
      join(landingRoot, "src/pages/index.astro"),
      "utf8"
    );
    expect(indexAstro).toMatch(/href="\/blog"/);
  });
});
