import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { canonicalUrl, metaForPath } from "@/seo/site";

function upsertHead(selector: string, create: () => HTMLElement, attribute: string, value: string): void {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = create();
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

    upsertHead(
      'meta[name="description"]',
      () => {
        const element = document.createElement("meta");
        element.setAttribute("name", "description");
        return element;
      },
      "content",
      meta.description,
    );
    upsertHead(
      'meta[property="og:title"]',
      () => {
        const element = document.createElement("meta");
        element.setAttribute("property", "og:title");
        return element;
      },
      "content",
      meta.title,
    );
    upsertHead(
      'meta[property="og:description"]',
      () => {
        const element = document.createElement("meta");
        element.setAttribute("property", "og:description");
        return element;
      },
      "content",
      meta.description,
    );
    upsertHead(
      'meta[property="og:url"]',
      () => {
        const element = document.createElement("meta");
        element.setAttribute("property", "og:url");
        return element;
      },
      "content",
      url,
    );
    upsertHead(
      'meta[name="twitter:title"]',
      () => {
        const element = document.createElement("meta");
        element.setAttribute("name", "twitter:title");
        return element;
      },
      "content",
      meta.title,
    );
    upsertHead(
      'meta[name="twitter:description"]',
      () => {
        const element = document.createElement("meta");
        element.setAttribute("name", "twitter:description");
        return element;
      },
      "content",
      meta.description,
    );
    upsertHead(
      'link[rel="canonical"]',
      () => {
        const element = document.createElement("link");
        element.setAttribute("rel", "canonical");
        return element;
      },
      "href",
      url,
    );
  }, [pathname]);

  return null;
}
