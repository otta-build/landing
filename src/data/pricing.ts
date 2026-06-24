import { SITE } from "../config";

export type PricingTier = {
  id: string;
  index: string; // "01".."04"
  name: string;
  price: string; // "$20" | "Contact" | "Free"
  period?: string; // "/mo"
  blurb: string;
  /** "individual" → first row (3-up); "team" → second row */
  group: "individual" | "team";
  /** Heading shown above the feature list, e.g. "Everything in Plus, and:" */
  featuresLead?: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
};

export const pricingTiers: PricingTier[] = [
  {
    id: "free",
    index: "01",
    name: "Free",
    price: "Free",
    group: "individual",
    blurb: "The local-first AI dev cockpit for individual builders and teams.",
    features: [
      "Native desktop app — fully local-first",
      "Bring your own CLI — Claude, Codex, Cursor, OpenCode",
      "Unlimited local background agents",
      "Personal DORA metrics — 30-day delivery history (own repos)",
      "PR cycle time + review depth — 7-day teaser",
      "Community support",
    ],
    cta: { label: "Join waitlist", href: SITE.waitlistUrl },
  },
  {
    id: "plus",
    index: "02",
    name: "Plus",
    price: "$20",
    period: "/mo",
    group: "individual",
    blurb:
      "Your workflow follows you: synced memory, cloud runner, 90-day delivery insight — code never leaves your machine.",
    featured: true,
    featuresLead: "Everything in Free, and:",
    features: [
      "Agent-native, multi-surface experience — Desktop / CLI / SDK",
      "One managed cloud runner — background jobs when your laptop is closed",
      "Memory + brain sync — cross-device, always fresh",
      "90-day delivery metrics — DORA, PR cycle time, code quality trends",
    ],
    cta: { label: "Join waitlist", href: SITE.waitlistUrl },
  },
  {
    id: "pro",
    index: "03",
    name: "Pro",
    price: "$100",
    period: "/mo",
    group: "individual",
    blurb:
      "Three dedicated cloud runners and full-year delivery analytics for power users and consultants.",
    featuresLead: "Everything in Plus, and:",
    features: [
      "Three dedicated managed cloud runners (24/7 availability)",
      "Full 1-year delivery history — DORA + PR review flow + code quality + Linear flow",
      "CI/CD deploy verification — automated health checks on every deploy",
      "SPACE / DevEx personal surveys — satisfaction, collaboration, flow tracking",
      "Early access to new features",
    ],
    cta: { label: "Join waitlist", href: SITE.waitlistUrl },
  },
  {
    id: "teams",
    index: "04",
    name: "Teams",
    price: "Contact",
    group: "team",
    blurb:
      "For engineering leads who need delivery accountability across the whole team: shared memory, team DORA, Linear-flow dashboards, and enterprise controls.",
    features: [
      "Multiple team members — up to 150 seats",
      "Custom usage limits",
      "Dedicated onboarding and support",
      "Team DORA rollups with industry benchmarks",
      "Linear flow metrics — cycle time per ticket, WIP, flow efficiency",
      "Business delivery dashboards — engineering impact mapped to OKRs",
      "Single Sign-On (SSO) integration",
      "SAML / SCIM provisioning",
      "Zero Data Retention (ZDR)",
      "Admin controls — model selection, autonomy level, access controls, deny lists",
    ],
    cta: { label: "Book a call", href: SITE.bookingUrl },
  },
];

export const individualTiers = pricingTiers.filter((t) => t.group === "individual");
export const teamTiers = pricingTiers.filter((t) => t.group === "team");
