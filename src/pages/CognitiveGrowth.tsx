/**
 * Cognitive Growth Dashboard (S1-005)
 *
 * Shows cognitive mode history, time-in-mode charts, and pattern insights.
 * Helps ADHD users understand and optimize their cognitive patterns.
 *
 * Route: /cognitive-growth
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  Zap,
  Heart,
  Sparkles,
  TrendingUp,
  Clock,
  BarChart3,
  ArrowLeft,
  RefreshCw,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useOzEngine } from "@/modules/oz-engine";
import { CognitiveModeWrapper } from "@/modules/oz-engine/components/CognitiveModeWrapper";
import { COGNITIVE_MODES } from "@/modules/oz-engine";
import type { CognitiveMode, ModeTimeSummary } from "@/modules/oz-engine";
import { cn } from "@/lib/utils";

// ─── Mode visual helpers ──────────────────────────────────────────────────────

const MODE_ICONS: Record<CognitiveMode, React.ReactNode> = {
  flow: <Brain className="h-5 w-5" />,
  power: <Zap className="h-5 w-5" />,
  recovery: <Heart className="h-5 w-5" />,
  creative: <Sparkles className="h-5 w-5" />,
};

const MODE_COLORS: Record<CognitiveMode, { pill: string; bar: string; text: string }> = {
  flow:     { pill: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", bar: "bg-emerald-500", text: "text-emerald-400" },
  power:    { pill: "bg-amber-500/20 text-amber-400 border-amber-500/30",       bar: "bg-amber-500",   text: "text-amber-400" },
  recovery: { pill: "bg-rose-500/20 text-rose-400 border-rose-500/30",          bar: "bg-rose-500",    text: "text-rose-400" },
  creative: { pill: "bg-violet-500/20 text-violet-400 border-violet-500/30",    bar: "bg-violet-500",  text: "text-violet-400" },
};

const DETECTION_REASON_LABELS: Record<string, string> = {
  time_morning_peak:        "Morning peak focus window (9am–noon)",
  time_afternoon_creative:  "Afternoon creative energy (2pm–6pm)",
  time_midday_rest:         "Post-lunch recovery dip (noon–2pm)",
  time_evening_executive:   "Evening executive review (6pm–10pm)",
  time_late_night_recovery: "Late-night recovery (10pm–5am)",
  time_early_morning_focus: "Early morning warm-up (5am–9am)",
  high_cognitive_load:      "High cognitive load detected (≥85%)",
  low_cognitive_load:       "Low cognitive load — planning window",
  manual:                   "Manually selected",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function CurrentModeCard({
  mode,
  detectedMode,
  setCognitiveMode,
}: {
  mode: CognitiveMode;
  detectedMode: { mode: CognitiveMode; reason: string; confidence: number };
  setCognitiveMode: (m: CognitiveMode) => void;
}) {
  const config = COGNITIVE_MODES[mode];
  const color = MODE_COLORS[mode];
  const isAutoMatch = detectedMode.mode === mode;

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Current Cognitive Mode
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-3 rounded-xl border text-xl", color.pill)}>
              {config.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{config.label}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{config.description}</p>
            </div>
          </div>

          {!isAutoMatch && (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5 text-xs"
              onClick={() => setCognitiveMode(detectedMode.mode)}
            >
              <RefreshCw className="h-3 w-3" />
              Switch to {COGNITIVE_MODES[detectedMode.mode].label}
            </Button>
          )}
        </div>

        {/* Auto-detection hint */}
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/40 p-3">
          {isAutoMatch ? (
            <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" />
          ) : (
            <Info className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          )}
          <div className="text-xs text-muted-foreground">
            {isAutoMatch ? (
              <span>
                <span className="text-primary font-medium">Auto-detected: </span>
                {DETECTION_REASON_LABELS[detectedMode.reason] ?? detectedMode.reason}
                {" "}({Math.round(detectedMode.confidence * 100)}% confidence)
              </span>
            ) : (
              <span>
                Oz Engine suggests{" "}
                <span className="font-medium text-foreground">
                  {COGNITIVE_MODES[detectedMode.mode].label}
                </span>{" "}
                — {DETECTION_REASON_LABELS[detectedMode.reason] ?? detectedMode.reason}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ModeSelectorRow({
  current,
  onChange,
}: {
  current: CognitiveMode;
  onChange: (m: CognitiveMode) => void;
}) {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Switch Mode
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(COGNITIVE_MODES) as CognitiveMode[]).map((m) => {
            const cfg = COGNITIVE_MODES[m];
            const color = MODE_COLORS[m];
            const isActive = m === current;
            return (
              <button
                key={m}
                onClick={() => onChange(m)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all",
                  isActive
                    ? cn(color.pill, "ring-2 ring-offset-2 ring-offset-card", color.bar.replace("bg-", "ring-"))
                    : "border-border/40 hover:border-primary/40 bg-card/40"
                )}
              >
                <span className="text-xl">{cfg.icon}</span>
                <span className={cn("text-xs font-medium", isActive && color.text)}>
                  {cfg.label}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function TimeInModeChart({ summary }: { summary: ModeTimeSummary[] }) {
  const total = summary.reduce((s, m) => s + m.totalMinutes, 0);

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Time in Each Mode
        </CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No mode history yet. Use the app for a while and check back!
          </p>
        ) : (
          <div className="space-y-3">
            {summary
              .sort((a, b) => b.totalMinutes - a.totalMinutes)
              .map((item) => {
                const cfg = COGNITIVE_MODES[item.mode];
                const color = MODE_COLORS[item.mode];
                const minutes = item.totalMinutes;
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                const label =
                  hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

                return (
                  <div key={item.mode}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{cfg.icon}</span>
                        <span className="text-sm font-medium">{cfg.label}</span>
                        <span className="text-xs text-muted-foreground">
                          × {item.sessionCount}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-xs font-medium tabular-nums", color.text)}>
                          {label}
                        </span>
                        <Badge variant="outline" className="text-[10px] h-4">
                          {item.percentOfTime}%
                        </Badge>
                      </div>
                    </div>
                    <Progress
                      value={item.percentOfTime}
                      className="h-2 bg-muted/40"
                    />
                  </div>
                );
              })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PatternInsights({ summary }: { summary: ModeTimeSummary[] }) {
  const sorted = [...summary].sort((a, b) => b.totalMinutes - a.totalMinutes);
  const dominant = sorted[0];
  const least = sorted[sorted.length - 1];
  const total = summary.reduce((s, m) => s + m.totalMinutes, 0);

  const insights = [];

  if (total === 0) {
    insights.push({
      icon: "🌱",
      text: "Start using the app to build your cognitive pattern history.",
    });
  } else {
    if (dominant && dominant.percentOfTime > 40) {
      insights.push({
        icon: COGNITIVE_MODES[dominant.mode].icon,
        text: `You spend most of your time in ${COGNITIVE_MODES[dominant.mode].label} mode (${dominant.percentOfTime}%). ${
          dominant.mode === "recovery"
            ? "Consider scheduling more focus time during your morning peak."
            : dominant.mode === "flow"
            ? "Great — protecting deep work time is a key ADHD superpower."
            : dominant.mode === "creative"
            ? "Your creative energy is strong — pair it with a focus session to ship ideas."
            : "Good structure — balance with recovery breaks to avoid burnout."
        }`,
      });
    }
    if (least && least.percentOfTime < 10 && least.totalMinutes > 0) {
      insights.push({
        icon: "💡",
        text: `You rarely use ${COGNITIVE_MODES[least.mode].label} mode. ${
          least.mode === "recovery"
            ? "Adding intentional rest periods can improve overall focus."
            : `Experimenting with ${COGNITIVE_MODES[least.mode].label} mode may reveal new strengths.`
        }`,
      });
    }
    if (total > 0) {
      insights.push({
        icon: "📈",
        text: `You've logged ${Math.round(total / 60)} hours of tracked cognitive time across ${summary.reduce((s, m) => s + m.sessionCount, 0)} sessions.`,
      });
    }
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Pattern Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 text-sm"
            >
              <span className="text-lg shrink-0">{insight.icon}</span>
              <p className="text-muted-foreground leading-relaxed">{insight.text}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentSessionsList({
  history,
}: {
  history: Array<{ mode: CognitiveMode; startedAt: string; endedAt: string | null }>;
}) {
  const recent = [...history].reverse().slice(0, 8);

  function formatDuration(start: string, end: string | null): string {
    const endTime = end ? new Date(end) : new Date();
    const diffMs = endTime.getTime() - new Date(start).getTime();
    const mins = Math.round(diffMs / 60_000);
    if (mins < 1) return "< 1m";
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No sessions recorded yet.
          </p>
        ) : (
          <div className="space-y-2">
            {recent.map((entry, i) => {
              const cfg = COGNITIVE_MODES[entry.mode];
              const color = MODE_COLORS[entry.mode];
              return (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("p-1.5 rounded-md text-sm border", color.pill)}>
                      {cfg.icon}
                    </span>
                    <div>
                      <p className={cn("text-sm font-medium", color.text)}>{cfg.label}</p>
                      <p className="text-xs text-muted-foreground">{formatTime(entry.startedAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium tabular-nums">
                      {formatDuration(entry.startedAt, entry.endedAt)}
                    </p>
                    {entry.endedAt === null && (
                      <Badge variant="outline" className="text-[10px] h-4 text-primary border-primary/30">
                        active
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CognitiveGrowth() {
  const {
    cognitiveMode,
    setCognitiveMode,
    detectedMode,
    modeHistory,
    modeSummary,
    clearModeHistory,
  } = useOzEngine();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <CognitiveModeWrapper mode={cognitiveMode} className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/oz-engine">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                Oz Engine
              </Button>
            </Link>
          </div>

          {modeHistory.length > 0 && (
            <div>
              {showClearConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Clear history?</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      clearModeHistory();
                      setShowClearConfirm(false);
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setShowClearConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground h-7"
                  onClick={() => setShowClearConfirm(true)}
                >
                  Clear history
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Cognitive Growth
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track how your brain works — and build patterns that support it.
          </p>
        </div>

        {/* Current Mode + detection */}
        <CurrentModeCard
          mode={cognitiveMode}
          detectedMode={detectedMode}
          setCognitiveMode={setCognitiveMode}
        />

        {/* Manual mode switcher */}
        <ModeSelectorRow current={cognitiveMode} onChange={setCognitiveMode} />

        {/* Time-in-mode chart */}
        <TimeInModeChart summary={modeSummary} />

        {/* Pattern insights */}
        <PatternInsights summary={modeSummary} />

        {/* Recent sessions */}
        <RecentSessionsList history={modeHistory} />

        {/* Footer hint */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          Powered by <span className="text-primary">Oz Engine™</span> · Mode history stored locally
        </p>
      </div>
    </CognitiveModeWrapper>
  );
}
