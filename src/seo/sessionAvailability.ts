export const SESSION_LOOKUP_TIMEOUT_MS = 4000;

export function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        if (error instanceof Error) {
          reject(error);
          return;
        }
        reject(new Error(typeof error === "string" ? error : "unknown error"));
      },
    );
  });
}

export interface VisitorSession<TUser> {
  user: TUser | null;
  available: boolean;
}

/**
 * The home page must render when Supabase was not configured at build time,
 * or when the session request hangs or fails. Callers show the signed-out home.
 */
export async function loadVisitorSession<TUser>(options: {
  configured: boolean;
  getSession: () => Promise<{ data: { session: { user: TUser } | null } }>;
  timeoutMs?: number;
}): Promise<VisitorSession<TUser>> {
  if (!options.configured) {
    return { user: null, available: false };
  }
  try {
    const result = await withTimeout(
      options.getSession(),
      options.timeoutMs ?? SESSION_LOOKUP_TIMEOUT_MS,
      "Supabase session lookup",
    );
    return { user: result.data.session?.user ?? null, available: true };
  } catch (error) {
    console.error("[Neurooz] Supabase session lookup failed. Showing the signed-out home.", error);
    return { user: null, available: false };
  }
}
