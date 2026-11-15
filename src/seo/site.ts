/**
 * Public site facts used by the HTML shell, route titles, and sitemap.
 * Keep claims limited to what the product actually does.
 */

export const CANONICAL_ORIGIN = "https://neurooz.com";

export const DEFAULT_TITLE = "Neurooz — when your ADHD brain feels like a tornado";

export const DEFAULT_DESCRIPTION =
  "Neurooz is for ADHD and neurodivergent minds. Capture a tornado of thoughts, pause impulse spending, and take one small next step when starting feels too big.";

export const PROBLEM_AUDIENCE = "For ADHD, autism, AuDHD, and other neurodivergent minds";

export const PROBLEM_HEADLINE = "When your brain feels like a tornado";

export const PROBLEM_BODY =
  "Neurooz is a productivity and financial-guardian app for the moments thoughts will not stay put, a task feels too big to start, and money leaves before you can stop it. Dump the storm, hold the impulse, and take one small step.";

/**
 * neurooz.com is served at the domain root on Cloudflare Pages and on the droplet.
 * A subpath such as /neurooz/ would break asset URLs.
 */
export const SITE_BASE = "/";

export const OG_IMAGE_PATH = "/neurooz-logo.png";
export const OG_IMAGE_ALT = "Neurooz logo";
export const OG_IMAGE_WIDTH = 1440;
export const OG_IMAGE_HEIGHT = 1536;

export const SITEMAP_LASTMOD = "2026-11-14";

/** Static routes from src/App.tsx. Parameterized and splat routes are omitted. */
export const SITEMAP_PATHS = [
  "/",
  "/projects",
  "/auth",
  "/pricing",
  "/business-setup",
  "/tax-forms",
  "/saved-forms",
  "/vine-tracker",
  "/rental-management",
  "/tax-rules",
  "/donations",
  "/subscriptions",
  "/tax-credits-calculator",
  "/employer-benefits",
  "/1099-center",
  "/structure-calculator",
  "/oz-engine",
  "/the-crossing",
  "/onboarding",
  "/er-dashboard",
  "/er-settings",
  "/company-wizard",
  "/tax-wizard",
  "/tornado-alley",
  "/learn",
  "/impulse-control",
  "/medication-tracker",
  "/rewards",
  "/tasks",
  "/tasks/today",
  "/epstein",
  "/tasks/someday",
  "/tasks/calendar",
  "/tasks/routines",
  "/admin/docs",
  "/admin/docs/overview",
  "/admin/docs/implementation",
  "/admin/docs/database",
  "/admin/docs/code",
  "/admin/docs/deployment",
  "/admin/docs/research",
  "/admin/docs/changelog",
  "/admin/test-script",
  "/cognitive-growth",
] as const;

const ROUTE_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  "/auth": {
    title: "Sign in to Neurooz",
    description:
      "Come back to Neurooz, or create an account. The app is for ADHD and neurodivergent minds when the plan will not stay in your head.",
  },
  "/pricing": {
    title: "Neurooz plans",
    description:
      "Plans for Neurooz, the productivity and financial-guardian app for ADHD and neurodivergent minds. A live account is required before a paid plan can start.",
  },
  "/tornado-alley": {
    title: "Tornado Alley — overwhelm recovery",
    description:
      "When everything is swirling, dump the thoughts and use the breathing pacer. Tornado Alley is the overwhelm recovery place inside Neurooz.",
  },
  "/impulse-control": {
    title: "Pause an impulse purchase",
    description:
      "Check a purchase before it happens. Neurooz can hold an impulse spend so you can decide later, instead of in the moment.",
  },
  "/oz-engine": {
    title: "Oz Engine — match the screen to your mind",
    description:
      "The Oz Engine watches cognitive load and the time of day, then suggests a mode so the screen can meet an ADHD or neurodivergent mind where it is.",
  },
  "/learn": {
    title: "Oz Engine field guide",
    description:
      "A plain-language guide to cognitive modes, the Neurooz tools, and how they are meant to be used when your brain is crowded.",
  },
  "/cognitive-growth": {
    title: "Cognitive growth",
    description: "See which cognitive mode you have been in. Neurooz keeps that history in this browser.",
  },
  "/tasks": {
    title: "Tasks for a crowded mind",
    description:
      "A short list for today and a place for everything else. Built for ADHD task switching, when the whole list is too big to start.",
  },
  "/tasks/today": {
    title: "Today's short list",
    description: "The few tasks for today, so a crowded mind has one small place to start.",
  },
  "/onboarding": {
    title: "Start Neurooz",
    description: "Tell Neurooz where you are so the first step can stay small.",
  },
  "/medication-tracker": {
    title: "Medication notes",
    description:
      "A place to note medication timing next to the rest of the day. Neurooz does not give medical advice.",
  },
  "/projects": {
    title: "Projects",
    description: "Keep projects from disappearing into a pile of open loops.",
  },
  "/rewards": {
    title: "Rewards",
    description: "Points and streaks for finished steps, when an account is available.",
  },
};

export function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  const withSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return withSlash.length > 1 && withSlash.endsWith("/") ? withSlash.slice(0, -1) : withSlash;
}

export function metaForPath(pathname: string): { title: string; description: string } {
  const path = normalizePath(pathname);
  return ROUTE_META[path] ?? { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
}

export function canonicalUrl(pathname: string): string {
  const path = normalizePath(pathname);
  return path === "/" ? `${CANONICAL_ORIGIN}/` : `${CANONICAL_ORIGIN}${path}`;
}

export function ogImageUrl(origin = CANONICAL_ORIGIN): string {
  return `${origin}${OG_IMAGE_PATH}`;
}

export function renderSitemap(origin = CANONICAL_ORIGIN, lastmod = SITEMAP_LASTMOD): string {
  const urls = SITEMAP_PATHS.map((path) => {
    const loc = path === "/" ? `${origin}/` : `${origin}${path}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
