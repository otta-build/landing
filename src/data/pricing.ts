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
    blurb: "The open delivery discipline for individual builders using Claude Code or Codex.",
    features: [
      "Native Claude Code commands and Codex skills",
      "Issue-linked acceptance criteria and pull-request evidence",
      "Test-first build workflow and local pre-push gate",
      "Builder, reviewer, QA, and DevOps specialist stages",
      "Optional hosted or self-hosted Pulse integration",
      "Community support",
    ],
    cta: { label: "Get access", href: SITE.waitlistUrl },
  },
  {
    id: "plus",
    index: "02",
    name: "Plus",
    price: "$20",
    period: "/mo",
    group: "individual",
    blurb:
      "Early access to managed delivery evidence and guided setup for independent builders.",
    featured: true,
    featuresLead: "Everything in Free, and:",
    features: [
      "Managed Pulse onboarding",
      "Extended issue, pull-request, release, and deploy history",
      "Opt-in agent telemetry setup",
      "Priority onboarding and feedback channel",
    ],
    cta: { label: "Get access", href: SITE.waitlistUrl },
  },
  {
    id: "pro",
    index: "03",
    name: "Pro",
    price: "$100",
    period: "/mo",
    group: "individual",
    blurb:
      "Early access for consultants and power users coordinating evidence across more repositories.",
    featuresLead: "Everything in Plus, and:",
    features: [
      "Multi-repository Pulse portfolio",
      "Extended lifecycle and gate-verdict history",
      "Guided release and deployment-verification setup",
      "Dedicated onboarding support",
      "Early access to new features",
    ],
    cta: { label: "Get access", href: SITE.waitlistUrl },
  },
  {
    id: "teams",
    index: "04",
    name: "Teams",
    price: "Contact",
    group: "team",
    blurb:
      "The early-access roadmap for engineering leads who need shared policy, evidence, and delivery accountability.",
    features: [
      "Shared repository onboarding and policy templates",
      "Team lifecycle and merge-gate evidence",
      "Dedicated onboarding and support",
      "Managed Pulse deployment options",
      "Reviewable LEARN-policy rollout",
      "Custom governance and retention planning",
    ],
    cta: { label: "Book a call", href: SITE.bookingUrl },
  },
];

export const individualTiers = pricingTiers.filter((t) => t.group === "individual");
export const teamTiers = pricingTiers.filter((t) => t.group === "team");
