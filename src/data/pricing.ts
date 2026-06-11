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
    blurb: "The local-first AI dev cockpit for solo builders.",
    features: [
      "Native desktop app — fully local-first",
      "Bring your own CLI — Claude, Codex, Cursor, OpenCode",
      "One local background agent",
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
    blurb: "The complete AI-native dev workflow for individuals.",
    featured: true,
    featuresLead: "Everything in Free, and:",
    features: [
      "Agent-native, multi-surface experience — Desktop / CLI / SDK",
      "Cloud & local background agents",
      "Billing and usage statistics",
      "Workflow-readiness dashboard",
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
    blurb: "Expanded limits and cloud runners for power users.",
    featuresLead: "Everything in Plus, and:",
    features: [
      "Expanded rolling rate limits — ~5× the usage of Plus",
      "Managed cloud runners for remote background agents",
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
    blurb: "For growing teams that need tailored plans.",
    features: [
      "Multiple team members — up to 150 seats",
      "Custom usage limits",
      "Dedicated onboarding and support",
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
