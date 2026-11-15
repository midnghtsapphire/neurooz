import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import OzCharacterSplash from "./OzCharacterSplash";

describe("OzCharacterSplash", () => {
  it("states the problem in a heading and names the landing images", () => {
    const html = renderToStaticMarkup(<OzCharacterSplash onComplete={() => {}} />);
    expect(html).toContain("<h1");
    expect(html).toContain("When your brain feels like a tornado");
    expect(html).toContain('alt="Emerald gateway at the start of the road"');
    expect(html).toContain('alt="Wizard at the center of the Neurooz circle"');
    expect(html).toContain('alt="Scarecrow, the figure for a crowded mind"');
    expect(html).toContain('alt="Tin Man, the figure for feelings and impulse spending"');
    expect(html).toContain('alt="Cowardly Lion, the figure for starting when fear says not to"');
    expect(html).not.toMatch(/alt=""/);
  });
});
