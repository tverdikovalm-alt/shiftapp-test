import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import moment from "moment";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Activity, Brain, Battery, Eye } from "lucide-react";

function ScoreRing({ score, label, color, icon: Icon }) {
  const r = 28;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-4">
        {label}
      </p>
      <div className="relative w-20 h-20 mb-3">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="4"
          />
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-semibold" style={{ color }}>
        {score}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">/ 100</p>
    </div>
  );
}

export default function SelfAwareness() {
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => base44.entities.Task.list("-created_date", 200),
  });
  const { data: habits = [] } = useQuery({
    queryKey: ["habits"],
    queryFn: () => base44.entities.Habit.list("-created_date", 100),
  });
  const { data: journal = [] } = useQuery({
    queryKey: ["journal"],
    queryFn: () => base44.entities.JournalEntry.list("-created_date", 30),
  });
  const { data: goals = [] } = useQuery({
    queryKey: ["goals"],
    queryFn: () => base44.entities.Goal.list("-created_date", 50),
  });

  const last7 = moment().subtract(7, "days");
  const last30 = moment().subtract(30, "days");

  // Productivity Score
  const recentTasks = tasks.filter(
    (t) => t.updated_date && moment(t.updated_date).isAfter(last7)
  );
  const completedRecent = tasks.filter(
    (t) =>
      t.status === "completed" &&
      t.completed_date &&
      moment(t.completed_date).isAfter(last7)
  );
  const productivityScore =
    recentTasks.length > 0
      ? Math.min(
          100,
          Math.round(
            (completedRecent.length / Math.max(recentTasks.length, 1)) * 100
          )
        )
      : 0;

  // Recovery Score — based on avg energy from journal
  const recentJournal = journal.filter((e) => moment(e.date).isAfter(last7));
  const avgEnergy =
    recentJournal.length > 0
      ? recentJournal.reduce((s, e) => s + (e.energy || 5), 0) /
        recentJournal.length
      : 5;
  const recoveryScore = Math.round((avgEnergy / 10) * 100);

  // Self-Awareness Score — journal consistency + depth
  const journalThisMonth = journal.filter((e) =>
    moment(e.date).isAfter(last30)
  );
  const daysWithJournal = new Set(
    journalThisMonth.map((e) => moment(e.date).format("YYYY-MM-DD"))
  ).size;
  const depthBonus = journalThisMonth.filter(
    (e) => e.what_did_i_do || e.proud_of || e.what_was_hard
  ).length;
  const selfAwarenessScore = Math.min(
    100,
    Math.round((daysWithJournal / 30) * 60 + (depthBonus / 30) * 40)
  );

  // Mood trend (last 14 days)
  const moodTrend = Array.from({ length: 14 }, (_, i) => {
    const date = moment()
      .subtract(13 - i, "days")
      .format("YYYY-MM-DD");
    const entry = journal.find(
      (e) => moment(e.date).format("YYYY-MM-DD") === date
    );
    return {
      day: moment(date).format("M/D"),
      mood: entry?.mood || null,
      energy: entry?.energy || null,
    };
  });

  // Insights
  const insights = [];
  if (productivityScore > 70 && recoveryScore < 50)
    insights.push({
      text: "High productivity, low recovery. Consider rest.",
      type: "warning",
    });
  if (productivityScore < 30)
    insights.push({
      text: "Low task completion this week. What's blocking you?",
      type: "info",
    });
  if (selfAwarenessScore > 60)
    insights.push({
      text: "Consistent reflection is building self-knowledge.",
      type: "positive",
    });
  if (recentJournal.length === 0)
    insights.push({
      text: "No journal entries this week. Reflection creates clarity.",
      type: "info",
    });

  const activeGoals = goals.filter((g) => g.status === "active").length;
  const coreGoals = goals.filter(
    (g) => g.priority === "core" && g.status === "active"
  ).length;

  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-6">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
            Analytics
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Self-Awareness
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Scores are directional signals, not judgments.
          </p>
        </div>

        {/* Score Rings */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <ScoreRing
            score={productivityScore}
            label="Productivity"
            color="hsl(var(--mode-money))"
            icon={Activity}
          />
          <ScoreRing
            score={recoveryScore}
            label="Recovery"
            color="hsl(var(--mode-life))"
            icon={Battery}
          />
          <ScoreRing
            score={selfAwarenessScore}
            label="Self-Awareness"
            color="hsl(var(--mode-focus))"
            icon={Eye}
          />
        </div>
      </motion.div>

      {/* Mood + Energy Trend */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
          14-Day Trend
        </h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={moodTrend}>
              <defs>
                <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--mode-life))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--mode-life))"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--mode-creative))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--mode-creative))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                interval={2}
              />
              <YAxis hide domain={[1, 10]} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="mood"
                stroke="hsl(var(--mode-life))"
                fill="url(#moodGrad)"
                strokeWidth={2}
                dot={false}
                connectNulls={false}
                name="Mood"
              />
              <Area
                type="monotone"
                dataKey="energy"
                stroke="hsl(var(--mode-creative))"
                fill="url(#energyGrad)"
                strokeWidth={2}
                dot={false}
                connectNulls={false}
                name="Energy"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-mode-life rounded" />
            <span>Mood</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-mode-creative rounded" />
            <span>Energy</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2">
            Tasks Done
          </p>
          <p className="text-2xl font-semibold">{completedRecent.length}</p>
          <p className="text-xs text-muted-foreground">this week</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2">
            Reflections
          </p>
          <p className="text-2xl font-semibold">{daysWithJournal}</p>
          <p className="text-xs text-muted-foreground">days this month</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2">
            Active Goals
          </p>
          <p className="text-2xl font-semibold">{activeGoals}</p>
          <p className="text-xs text-muted-foreground">{coreGoals} core</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2">
            Avg Energy
          </p>
          <p className="text-2xl font-semibold">{avgEnergy.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">last 7 days</p>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
            Insights
          </h3>
          <div className="space-y-3">
            {insights.map((ins, i) => (
              <div key={i} className="flex items-start gap-3">
                <Brain
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    ins.type === "warning"
                      ? "text-destructive"
                      : ins.type === "positive"
                      ? "text-mode-money"
                      : "text-muted-foreground"
                  }`}
                />
                <p className="text-sm text-foreground/80">{ins.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
