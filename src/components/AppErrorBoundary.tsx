import { Component, type ErrorInfo, type ReactNode } from "react";
import { ProblemStatement } from "@/components/seo/ProblemStatement";

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
        <div className="max-w-xl">
          <ProblemStatement tone="on-dark" />
          <p className="mt-6 text-center text-white/70">
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
