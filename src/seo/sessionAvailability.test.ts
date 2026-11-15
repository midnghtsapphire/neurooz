import { describe, expect, it, vi } from "vitest";
import { loadVisitorSession, withTimeout } from "./sessionAvailability";

describe("loadVisitorSession", () => {
  it("does not call Supabase when the project is not configured", async () => {
    const getSession = vi.fn();
    const result = await loadVisitorSession({ configured: false, getSession });
    expect(result).toEqual({ user: null, available: false });
    expect(getSession).not.toHaveBeenCalled();
  });

  it("returns the signed-in user when the session resolves", async () => {
    const result = await loadVisitorSession({
      configured: true,
      getSession: async () => ({ data: { session: { user: { id: "user-1" } } } }),
    });
    expect(result).toEqual({ user: { id: "user-1" }, available: true });
  });

  it("returns a signed-out home when the lookup rejects", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await loadVisitorSession({
      configured: true,
      getSession: async () => {
        throw new Error("network down");
      },
    });
    expect(result).toEqual({ user: null, available: false });
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it("returns a signed-out home when the lookup hangs", async () => {
    vi.useFakeTimers();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const pending = loadVisitorSession({
      configured: true,
      getSession: () => new Promise(() => {}),
      timeoutMs: 4000,
    });
    await vi.advanceTimersByTimeAsync(4000);
    await expect(pending).resolves.toEqual({ user: null, available: false });
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
    vi.useRealTimers();
  });
});

describe("withTimeout", () => {
  it("resolves when the promise finishes first", async () => {
    await expect(withTimeout(Promise.resolve("ok"), 1000, "lookup")).resolves.toBe("ok");
  });
});
