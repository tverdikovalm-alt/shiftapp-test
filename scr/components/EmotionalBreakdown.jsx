import { EMOTIONAL_TAGS } from "../lib/modeConfig";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#ef4444", "#f59e0b", "#6b7280"];

export default function EmotionalBreakdown({ transactions }) {
  const breakdown = EMOTIONAL_TAGS.map((tag) => {
    const matching = transactions.filter((t) => t.emotional_tag === tag.value);
    const total = matching.reduce((s, t) => s + (t.amount || 0), 0);
    return {
      name: tag.label,
      value: total,
      emoji: tag.emoji,
      count: matching.length,
    };
  }).filter((b) => b.value > 0);

  if (breakdown.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
          Emotional Spending
        </h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          Add expenses with emotional tags to see patterns
        </p>
      </div>
    );
  }

  const total = breakdown.reduce((s, b) => s + b.value, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
        Emotional Spending
      </h3>

      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={breakdown}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
            >
              {breakdown.map((entry, i) => (
                <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `$${value.toLocaleString()}`}
              contentStyle={{
                background: "hsl(240 8% 7%)",
                border: "1px solid hsl(240 5% 14%)",
                borderRadius: "8px",
                color: "hsl(0 0% 93%)",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        {breakdown.map((b, i) => (
          <div
            key={b.name}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="text-foreground/80">
                {b.emoji} {b.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-xs">
                {Math.round((b.value / total) * 100)}%
              </span>
              <span className="font-mono text-xs">
                ${b.value.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
