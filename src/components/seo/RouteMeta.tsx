import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { canonicalUrl, metaForPath } from "@/seo/site";

function ensureHead(tag: "meta" | "link", keyName: string, key: string, attribute: string, value: string): void {
  const selector = `${tag}[${keyName}="${key}"]`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement(tag);
    element.setAttribute(keyName, key);
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

/** Sets the document title and description for the route currently on screen. */
export function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = metaForPath(pathname);
    const url = canonicalUrl(pathname);
    document.title = meta.title;
    ensureHead("meta", "name", "description", "content", meta.description);
    ensureHead("meta", "property", "og:title", "content", meta.title);
    ensureHead("meta", "property", "og:description", "content", meta.description);
    ensureHead("meta", "property", "og:url", "content", url);
    ensureHead("meta", "name", "twitter:title", "content", meta.title);
    ensureHead("meta", "name", "twitter:description", "content", meta.description);
    ensureHead("link", "rel", "canonical", "href", url);
  }, [pathname]);

  return null;
}
