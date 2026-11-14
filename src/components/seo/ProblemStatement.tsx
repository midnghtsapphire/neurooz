import { PROBLEM_AUDIENCE, PROBLEM_BODY, PROBLEM_HEADLINE } from "@/seo/site";

interface ProblemStatementProps {
  tone?: "on-dark" | "on-light";
  id?: string;
}

export function ProblemStatement({ tone = "on-dark", id }: ProblemStatementProps) {
  const heading = tone === "on-dark" ? "text-white" : "text-foreground";
  const body = tone === "on-dark" ? "text-white/90" : "text-muted-foreground";
  const kicker = tone === "on-dark" ? "text-emerald-100" : "text-primary";

  return (
    <header id={id} className="mx-auto max-w-2xl text-center">
      <p className={`text-sm font-medium uppercase tracking-wide ${kicker}`}>{PROBLEM_AUDIENCE}</p>
      <h1 className={`mt-2 text-3xl font-bold leading-tight md:text-4xl ${heading}`}>{PROBLEM_HEADLINE}</h1>
      <p className={`mt-3 text-base leading-relaxed md:text-lg ${body}`}>{PROBLEM_BODY}</p>
    </header>
  );
}
