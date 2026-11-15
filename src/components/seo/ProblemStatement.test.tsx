import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PROBLEM_AUDIENCE, PROBLEM_BODY, PROBLEM_HEADLINE } from "@/seo/site";
import { ProblemStatement } from "./ProblemStatement";

describe("ProblemStatement", () => {
  it("uses one heading and states who the app is for", () => {
    const html = renderToStaticMarkup(<ProblemStatement />);
    expect(html).toContain("<h1");
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain(PROBLEM_AUDIENCE);
    expect(html).toContain(PROBLEM_HEADLINE);
    expect(html).toContain(PROBLEM_BODY);
    expect(html.toLowerCase()).not.toContain("testimonial");
  });
});
