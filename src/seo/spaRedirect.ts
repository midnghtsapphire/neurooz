/**
 * GitHub Pages serves index.html for "/" and 404.html for every other path.
 * public/404.html rewrites /tasks/today?a=1#x to /?/tasks/today&a=1#x.
 * The script in index.html restores that query into the real path before React Router reads it.
 * pathSegmentsToKeep is 0 because https://neurooz.com is the site root.
 */

export interface SpaLocation {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
}

export const PATH_SEGMENTS_TO_KEEP = 0;

export function toGithubPages404Url(
  location: SpaLocation,
  pathSegmentsToKeep = PATH_SEGMENTS_TO_KEEP,
): string {
  const pathPrefix = location.pathname.split("/").slice(0, 1 + pathSegmentsToKeep).join("/");
  const route = location.pathname
    .slice(1)
    .split("/")
    .slice(pathSegmentsToKeep)
    .join("/")
    .replace(/&/g, "~and~");
  const search = location.search ? "&" + location.search.slice(1).replace(/&/g, "~and~") : "";
  return (
    location.protocol +
    "//" +
    location.hostname +
    (location.port ? ":" + location.port : "") +
    pathPrefix +
    "/?/" +
    route +
    search +
    location.hash
  );
}

/** Inverse of the index.html history rewrite. Returns null when this load is not a Pages redirect. */
export function restoreSpaPath(location: Pick<SpaLocation, "pathname" | "search" | "hash">): string | null {
  if (location.search[1] !== "/") return null;
  const decoded = location.search
    .slice(1)
    .split("&")
    .map((part) => part.replace(/~and~/g, "&"))
    .join("?");
  return location.pathname.slice(0, -1) + decoded + location.hash;
}
