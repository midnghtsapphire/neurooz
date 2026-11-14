import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  CANONICAL_ORIGIN,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  PROBLEM_BODY,
  PROBLEM_HEADLINE,
  SITEMAP_PATHS,
  canonicalUrl,
  metaForPath,
  ogImageUrl,
  renderSitemap,
} from "./site";
import { PATH_SEGMENTS_TO_KEEP, restoreSpaPath, toGithubPages404Url } from "./spaRedirect";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function stripHtmlComments(source: string): string {
  return source.replace(/<!--[\s\S]*?-->/g, "");
}

function liveYaml(source: string): string {
  return source
    .split("\n")
    .filter((line) => !/^\s*#/.test(line))
    .join("\n");
}

describe("site facts", () => {
  it("uses the custom domain as the canonical origin", () => {
    expect(CANONICAL_ORIGIN).toBe("https://neurooz.com");
    expect(canonicalUrl("/")).toBe("https://neurooz.com/");
    expect(canonicalUrl("/tornado-alley")).toBe("https://neurooz.com/tornado-alley");
    expect(canonicalUrl("/tornado-alley/")).toBe("https://neurooz.com/tornado-alley");
  });

  it("states the audience and the problem in the default title and description", () => {
    expect(DEFAULT_TITLE.toLowerCase()).toContain("adhd");
    expect(DEFAULT_DESCRIPTION.toLowerCase()).toContain("neurodivergent");
    expect(DEFAULT_DESCRIPTION.toLowerCase()).toContain("impulse");
    expect(metaForPath("/").title).toBe(DEFAULT_TITLE);
    expect(metaForPath("/impulse-control").title.toLowerCase()).toContain("impulse");
    expect(metaForPath("/tornado-alley").description.toLowerCase()).toContain("overwhelm");
    expect(metaForPath("/unknown-page").description).toBe(DEFAULT_DESCRIPTION);
  });

  it("points the share image at the logo in public/", () => {
    expect(ogImageUrl()).toBe("https://neurooz.com/neurooz-logo.png");
    expect(fs.existsSync(path.join(root, "public", "neurooz-logo.png"))).toBe(true);
    expect(OG_IMAGE_WIDTH).toBe(1440);
    expect(OG_IMAGE_HEIGHT).toBe(1536);
  });
});

describe("published HTML and sitemap", () => {
  const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const liveHtml = stripHtmlComments(indexHtml);

  it("ships the problem statement, canonical URL, and JSON-LD without third-party tags", () => {
    expect(liveHtml).toContain(`<title>${DEFAULT_TITLE}</title>`);
    expect(liveHtml).toContain(`content="${DEFAULT_DESCRIPTION}"`);
    expect(liveHtml).toContain('<link rel="canonical" href="https://neurooz.com/" />');
    expect(liveHtml).toContain("https://neurooz.com/neurooz-logo.png");
    expect(liveHtml).toContain(PROBLEM_HEADLINE);
    expect(liveHtml).toContain(PROBLEM_BODY);
    expect(liveHtml).not.toContain("lovable.dev");
    expect(liveHtml).not.toContain("platform.twitter.com");
    expect(liveHtml).not.toContain("vercel.app");

    const jsonLd = liveHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    expect(jsonLd).not.toBeNull();
    const graph = JSON.parse(jsonLd?.[1] ?? "{}") as { "@graph": { "@type": string }[] };
    const types = graph["@graph"].map((node) => node["@type"]);
    expect(types).toEqual(expect.arrayContaining(["SoftwareApplication", "WebSite", "Organization"]));
    expect(JSON.stringify(graph)).not.toContain("aggregateRating");
    expect(JSON.stringify(graph)).not.toContain("review");
    expect(JSON.stringify(graph)).not.toContain("price");
  });

  it("lists every static app route in sitemap.xml and points robots.txt at it", () => {
    const app = fs.readFileSync(path.join(root, "src", "App.tsx"), "utf8");
    const declared = [...app.matchAll(/path="([^"]+)"/g)]
      .map((match) => match[1])
      .filter((routePath) => routePath !== "*" && !routePath.includes("*") && !routePath.includes(":"));
    expect([...declared].sort()).toEqual([...SITEMAP_PATHS].sort());

    const sitemap = fs.readFileSync(path.join(root, "public", "sitemap.xml"), "utf8");
    expect(sitemap).toBe(renderSitemap());
    expect(sitemap).toContain("https://neurooz.com/tornado-alley");
    expect(sitemap).not.toContain("vercel.app");

    const robots = fs.readFileSync(path.join(root, "public", "robots.txt"), "utf8");
    expect(robots).toContain("Sitemap: https://neurooz.com/sitemap.xml");
  });

  it("keeps the GitHub Pages redirect for a root custom domain", () => {
    const notFound = fs.readFileSync(path.join(root, "public", "404.html"), "utf8");
    expect(notFound).toContain("var pathSegmentsToKeep = 0;");
    expect(indexHtml).toContain("l.search[1] === '/'");
    expect(PATH_SEGMENTS_TO_KEEP).toBe(0);

    const redirected = toGithubPages404Url({
      protocol: "https:",
      hostname: "neurooz.com",
      port: "",
      pathname: "/tasks/today",
      search: "?a=1&b=2",
      hash: "#start",
    });
    expect(redirected).toBe("https://neurooz.com/?/tasks/today&a=1~and~b=2#start");
    const restored = restoreSpaPath({
      pathname: "/",
      search: "?/tasks/today&a=1~and~b=2",
      hash: "#start",
    });
    expect(restored).toBe("/tasks/today?a=1&b=2#start");
    expect(restoreSpaPath({ pathname: "/", search: "", hash: "" })).toBeNull();
  });
});

describe("production pointers", () => {
  it("points package.json and the README at neurooz.com", () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")) as {
      homepage: string;
      scripts: { deploy: string; "deploy:cf": string; "deploy:do": string };
    };
    expect(pkg.homepage).toBe("https://neurooz.com");
    expect(pkg.scripts["deploy:cf"]).toBe(
      "npm run build && npx wrangler pages deploy dist --project-name neurooz",
    );
    expect(pkg.scripts["deploy:do"]).toBe("bash deploy-server.sh");
    expect(pkg.scripts.deploy).toContain("gh-pages -d dist");

    const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
    const liveReadme = stripHtmlComments(readme);
    expect(liveReadme).toContain("## Live Deployment");
    expect(liveReadme).toContain("https://neurooz.com");
    expect(liveReadme).not.toContain("neurooz.vercel.app");
    expect(readme).toContain("neurooz.vercel.app");
  });

  it("keeps the Actions droplet job commented and deploys from this machine", () => {
    const workflow = fs.readFileSync(path.join(root, ".github", "workflows", "deploy.yml"), "utf8");
    const live = liveYaml(workflow);
    expect(workflow).toContain("2026-11-14");
    expect(workflow).toContain("locally");
    expect(workflow).toContain("appleboy/scp-action");
    expect(live).not.toContain("appleboy");
    expect(live).not.toContain("wrangler");
    expect(live).not.toContain("gh-pages");
    expect(live).not.toContain("branches:");
    expect(live).toContain("if: false");

    const redirects = fs.readFileSync(path.join(root, "public", "_redirects"), "utf8").replace(/\s+/g, " ");
    expect(redirects).toContain("/* /index.html 200");
    const headers = fs.readFileSync(path.join(root, "public", "_headers"), "utf8");
    expect(headers).toContain("/assets/*");
    expect(headers).toContain("max-age=31536000");
    expect(headers).toContain("nosniff");

    const nginx = fs.readFileSync(path.join(root, "nginx.conf"), "utf8");
    expect(nginx).toContain("server_name neurooz.com www.neurooz.com");
    expect(nginx).toContain("try_files $uri $uri/ /index.html;");
    expect(nginx).toContain("growlingeyes.com");

    const droplet = fs.readFileSync(path.join(root, "deploy-server.sh"), "utf8");
    expect(droplet).toContain("DEPLOY_HOST");
    expect(droplet).toContain("DEPLOY_USER");
    expect(droplet).toContain("rsync -az");
    expect(droplet).not.toMatch(/BEGIN OPENSSH|sshpass|password=/);

    const guide = fs.readFileSync(path.join(root, "DEPLOY.md"), "utf8");
    expect(guide).toContain("Cloudflare Pages");
    expect(guide).toContain("DigitalOcean");
    expect(guide).toContain("ns45.domaincontrol.com");
    expect(guide).toContain("ns46.domaincontrol.com");
    expect(guide).toContain("public/CNAME");
    expect(fs.readFileSync(path.join(root, "public", "CNAME"), "utf8").trim()).toBe("neurooz.com");
  });

  it("hashes built JS and CSS filenames and keeps the Vite base at the domain root", () => {
    const viteConfig = fs.readFileSync(path.join(root, "vite.config.ts"), "utf8");
    expect(viteConfig).toContain("base: SITE_BASE");
    expect(viteConfig).toContain("assets/[name]-[hash].js");
    expect(viteConfig).toContain('assets/[name]-[hash][extname]');
  });
});
