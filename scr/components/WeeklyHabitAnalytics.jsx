import moment from "moment";
import { MODE_CONFIG } from "../lib/modeConfig";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

export default function WeeklyHabitAnalytics({ habits }) {
  const last7Days = Array.from({ length: 7 }, (_, i) =>
    moment()
      .subtract(6 - i, "days")
      .format("YYYY-MM-DD")
  );

  // Overall stats this week
  let totalExpected = 0;
  let totalDone = 0;
  const modeStats = {};

  habits
    .filter((h) => h.status === "active")
    .forEach((habit) => {
      const checkIns = habit.check_ins || [];
      const weekDone = last7Days.filter((d) =>
        checkIns.find((c) => c.date === d && c.status === "done")
      ).length;

      // Estimate expected frequency this week
      let expected = 7;
      if (
        habit.frequency_type === "weekly_x" ||
        habit.frequency_type === "flexible"
      ) {
        expected = habit.frequency_count || 3;
      } else if (habit.frequency_type === "specific_days") {
        expected = (habit.specific_days || []).length;
      }

      totalDone += weekDone;
      totalExpected += expected;

      const mode = habit.mode || "focus";
      if (!modeStats[mode]) modeStats[mode] = { done: 0, expected: 0 };
      modeStats[mode].done += weekDone;
      modeStats[mode].expected += expected;
    });

  const overallRate =
    totalExpected > 0 ? Math.round((totalDone / totalExpected) * 100) : 0;

  const modeData = Object.entries(modeStats).map(([mode, stats]) => ({
    mode,
    label: MODE_CONFIG[mode]?.label || mode,
    rate:
      stats.expected > 0 ? Math.round((stats.done / stats.expected) * 100) : 0,
    color: `hsl(var(--mode-${mode}))`,
  }));

  // Daily completion chart
  const dailyData = last7Days.map((date) => {
    const done = habits.filter(
      (h) =>
        h.status === "active" &&
        (h.check_ins || []).find((c) => c.date === date && c.status === "done")
    ).length;
    return { day: moment(date).format("dd"), done };
  });

  if (habits.filter((h) => h.status === "active").length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">
        Weekly Analytics
      </h3>

      {/* Overall */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-3xl font-semibold tracking-tight">
            {overallRate}%
          </p>
          <p className="text-xs text-muted-foreground">
            {totalDone} of {totalExpected} habits completed
          </p>
        </div>
        <div className="w-20 h-20">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeDasharray={`${overallRate} ${100 - overallRate}`}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Daily bar chart */}
      <div className="h-24 mb-5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyData} barSize={20}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis hide />
            <Bar dataKey="done" radius={[3, 3, 0, 0]}>
              {dailyData.map((_, i) => (
                <Cell
                  key={i}
                  fill={
                    i === 6 ? "hsl(var(--primary))" : "hsl(var(--secondary))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mode breakdown */}
      {modeData.length > 0 && (
        <div className="space-y-2">
          {modeData.map(({ mode, label, rate, color }) => (
            <div key={mode} className="flex items-center gap-3">
              <span
                className={`text-[10px] font-mono w-16 ${MODE_CONFIG[mode]?.textClass}`}
              >
                {label}
              </span>
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${rate}%`, background: color }}
                />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">
                {rate}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
