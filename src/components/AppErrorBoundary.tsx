import { Component, type ErrorInfo, type ReactNode } from "react";
import { PROBLEM_AUDIENCE, PROBLEM_BODY, PROBLEM_HEADLINE } from "@/seo/site";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

/**
 * Last-resort screen when a render throws. The home page text stays visible
 * so a broken child does not leave a blank document.
 */
export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[Neurooz] The screen failed to render.", error, info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="max-w-xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-200">{PROBLEM_AUDIENCE}</p>
          <h1 className="mt-3 text-3xl font-bold">{PROBLEM_HEADLINE}</h1>
          <p className="mt-4 text-white/80">{PROBLEM_BODY}</p>
          <p className="mt-6 text-white/70">
            This screen hit an error before it could finish drawing. Reloading brings the home page back.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              className="rounded-md bg-emerald-500 px-4 py-2 font-semibold text-slate-950"
              onClick={() => window.location.reload()}
            >
              Reload Neurooz
            </button>
            <a className="underline" href="/">
              Back to the start
            </a>
          </div>
        </div>
      </main>
    );
  }
}
