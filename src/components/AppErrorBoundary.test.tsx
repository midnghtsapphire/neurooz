import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AppErrorBoundary } from "./AppErrorBoundary";
import { PROBLEM_HEADLINE } from "@/seo/site";
import { RouteMeta } from "./seo/RouteMeta";

function Boom(): React.ReactElement {
  throw new Error("draw failed");
}

describe("AppErrorBoundary", () => {
  it("shows the problem and a reload action instead of an empty page", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <AppErrorBoundary>
          <Boom />
        </AppErrorBoundary>,
      );
    });

    expect(container.textContent).toContain(PROBLEM_HEADLINE);
    expect(container.textContent).toContain("Reload Neurooz");
    expect(container.querySelector("a")?.getAttribute("href")).toBe("/");
    expect(errorSpy).toHaveBeenCalled();

    await act(async () => {
      root.unmount();
    });
    container.remove();
    errorSpy.mockRestore();
  });
});

describe("RouteMeta", () => {
  async function renderAt(pathname: string): Promise<{ root: Root; container: HTMLDivElement }> {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={[pathname]}>
          <RouteMeta />
        </MemoryRouter>,
      );
    });
    return { root, container };
  }

  it("sets a route title and canonical URL for a public page", async () => {
    document.head.innerHTML = "";
    const { root, container } = await renderAt("/tornado-alley");
    expect(document.title).toBe("Tornado Alley — overwhelm recovery");
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute("content")).toContain(
      "overwhelm",
    );
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      "https://neurooz.com/tornado-alley",
    );
    await act(async () => {
      root.unmount();
    });
    container.remove();
  });
});
