import { SITE } from "../config";

export type PricingTier = {
  id: string;
  index: string; // "01".."05"
  name: string;
  price: string; // "$20" | "Contact"
  period?: string; // "/mo"
  blurb: string;
  /** Heading shown above the feature list, e.g. "Everything in Pro, and:" */
  featuresLead?: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
};

export const pricingTiers: PricingTier[] = [
  {
    id: "pro",
    index: "01",
    name: "Pro",
    price: "$20",
    period: "/mo",
    blurb: "The complete AI-native dev workflow for individuals.",
    features: [
      "Agent-native, multi-surface experience — Desktop / CLI / SDK",
      "Cloud & local background agents",
      "Billing and usage statistics",
      "Workflow-readiness dashboard",
    ],
    cta: { label: "Join waitlist", href: SITE.waitlistUrl },
  },
  {
    id: "plus",
    index: "02",
    name: "Plus",
    price: "$100",
    period: "/mo",
    blurb: "Expanded limits for heavy individual use.",
    featuresLead: "Everything in Pro, and:",
    features: [
      "Expanded rolling rate limits — ~5× the usage of Pro",
      "Managed cloud runners for remote background agents",
    ],
    cta: { label: "Join waitlist", href: SITE.waitlistUrl },
    featured: true,
  },
  {
    id: "max",
    index: "03",
    name: "Max",
    price: "$200",
    period: "/mo",
    blurb: "Maximum throughput and earliest access.",
    featuresLead: "Everything in Plus, and:",
    features: [
      "Expanded rolling rate limits — ~10× the usage of Pro",
      "Early access to new features",
    ],
    cta: { label: "Join waitlist", href: SITE.waitlistUrl },
  },
  {
    id: "teams",
    index: "04",
    name: "Teams",
    price: "Contact",
    blurb: "For growing teams that need tailored plans.",
    features: [
      "Multiple team members — up to 150 seats",
      "Custom usage limits",
      "Dedicated onboarding and support",
      "Single Sign-On (SSO) integration",
      "SAML / SCIM provisioning",
      "Zero Data Retention (ZDR)",
      "Basic admin controls — model selection, autonomy level, access controls, deny lists",
    ],
    cta: { label: "Book a call", href: SITE.bookingUrl },
  },
  {
    id: "enterprise",
    index: "05",
    name: "Enterprise",
    price: "Contact",
    blurb: "Every feature prior, at enterprise scale.",
    featuresLead: "Everything prior, and:",
    features: [
      "Unlimited team members",
      "Dedicated compute with partitioned inference pool",
      "Audit logging and activity trails",
      "Workflow-readiness improvement program",
      "Enterprise automation cookbook",
      "On-premise deployment options",
      "Full admin controls — encryption keys, data residency, retention, network policy",
      "Dedicated account manager + priority support with SLAs",
      "Custom onboarding program",
    ],
    cta: { label: "Book a call", href: SITE.bookingUrl },
  },
];
