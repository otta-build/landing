import { expect, test, type Page } from "@playwright/test";

async function stubPulse(page: Page) {
  await page.route("https://pulse.otta.build/status", route =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        repos: 65,
        pr_cycle_p50_minutes: 9.2,
        event_types: {
          pr_merged: 1797,
          deploy_tag: 994,
          gate_verdict: 2762,
          issue_shipped: 604,
        },
      }),
    }),
  );
}

test("scenario controls update visible content and ARIA state", async ({ page }) => {
  await stubPulse(page);
  await page.goto("/");

  const visualProof = page.getByRole("button", { name: "Visual proof", exact: true });
  await visualProof.click();

  await expect(visualProof).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Gate failure", exact: true })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await expect(page.getByRole("region", { name: "PR #190 · responsive results grid" })).toBeVisible();
  await expect(page.getByRole("region", { name: "PR #184 · authentication regression" })).toBeHidden();
});

test("copy fallback keeps the command visible and announces recovery", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error("clipboard unavailable")) },
    });
  });
  await stubPulse(page);
  await page.goto("/");

  const copy = page.getByRole("button", {
    name: "Copy /plugin marketplace add otta-build/plugin",
    exact: true,
  });
  await copy.click();

  await expect(copy.locator("xpath=../following-sibling::*[@data-copy-status]"))
    .toHaveText("Select and copy");
  await expect(page.getByText("/plugin marketplace add otta-build/plugin", { exact: true })).toBeVisible();
});

test("mobile controls stay inside 390px and meet touch-target sizing", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await stubPulse(page);
  await page.goto("/");

  const measurements = await page.evaluate(() => {
    const selectors = ["[data-scenario-control]", "[data-copy-command]"];
    const heights = selectors.flatMap(selector =>
      [...document.querySelectorAll<HTMLElement>(selector)].map(el => el.getBoundingClientRect().height),
    );
    const copyRight = document.querySelector<HTMLElement>("[data-copy-command]")?.getBoundingClientRect().right;
    return {
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      minControlHeight: Math.min(...heights),
      copyRight,
      viewportWidth: document.documentElement.clientWidth,
    };
  });

  expect(measurements.overflow).toBe(false);
  expect(measurements.minControlHeight).toBeGreaterThanOrEqual(44);
  expect(measurements.copyRight).toBeLessThanOrEqual(measurements.viewportWidth);
});

test("the page remains understandable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4321/");

  expect(page.viewportSize()).toEqual({ width: 1440, height: 1000 });

  await expect(page.getByRole("heading", { name: "Let agents build. Make delivery prove itself." })).toBeVisible();
  await expect(page.getByRole("region", { name: "PR #184 · authentication regression" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "One delivery loop. Two native paths." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Keep the speed. Make completion demonstrable." })).toBeVisible();
  await expect(page.getByText("1,750", { exact: true })).toBeVisible();
  await expect(page.getByText("8 min", { exact: true })).toBeVisible();

  if (process.env.CAPTURE_REVIEW) {
    await page.screenshot({
      path: ".review-shots/dark-landing-no-js-1440.png",
      fullPage: true,
    });
  }

  await context.close();
});

test("reduced motion disables the ambient orb animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await stubPulse(page);
  await page.goto("/");

  await expect(page.locator(".hero-orb").first()).toHaveCSS("animation-name", "none");
});

test("waitlist errors retain input and restore submission", async ({ page }) => {
  await stubPulse(page);
  await page.route("**/api/waitlist", route =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "Try again later." }),
    }),
  );
  await page.goto("/");

  const email = page.getByLabel("Email address", { exact: true });
  await email.fill("qa@example.invalid");
  await page.locator("#waitlist-form").getByRole("button", { name: "Get access" }).click();

  await expect(page.locator("#waitlist-status")).toHaveText("Try again later.");
  await expect(email).toHaveValue("qa@example.invalid");
  await expect(page.locator("#waitlist-form").getByRole("button", { name: "Get access" })).toBeEnabled();
});

test("unknown paths keep a real 404 response", async ({ page }) => {
  const response = await page.goto("/definitely-not-a-page");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "This page didn't make it through the gate." })).toBeVisible();
});
