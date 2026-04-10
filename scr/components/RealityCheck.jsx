import { AlertCircle, TrendingDown, TrendingUp, Activity } from "lucide-react";
import moment from "moment";

function generateInsights(tasks, transactions, ideas, traits) {
  const insights = [];

  const completedThisWeek = tasks.filter(
    (t) =>
      t.status === "completed" &&
      moment(t.completed_date).isAfter(moment().subtract(7, "days"))
  );
  const moneyTasks = completedThisWeek.filter((t) => t.mode === "money");
  const creativeTasks = completedThisWeek.filter((t) => t.mode === "creative");

  if (moneyTasks.length === 0 && completedThisWeek.length > 0) {
    insights.push({
      type: "warning",
      text: "No income-generating tasks completed this week.",
      icon: TrendingDown,
    });
  }

  const impulsiveSpending = transactions.filter(
    (t) => t.type === "expense" && t.emotional_tag === "impulsive"
  );
  if (impulsiveSpending.length > 2) {
    const total = impulsiveSpending.reduce((s, t) => s + (t.amount || 0), 0);
    insights.push({
      type: "warning",
      text: `$${total.toLocaleString()} in impulsive spending detected.`,
      icon: AlertCircle,
    });
  }

  const rawIdeas = ideas.filter((i) => i.status === "raw");
  if (rawIdeas.length > 10) {
    insights.push({
      type: "info",
      text: `${rawIdeas.length} unstructured ideas waiting. Consider reviewing.`,
      icon: Activity,
    });
  }

  if (completedThisWeek.length >= 5) {
    insights.push({
      type: "positive",
      text: `Strong week: ${completedThisWeek.length} tasks completed.`,
      icon: TrendingUp,
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: "info",
      text: "Start adding tasks and tracking activity to see insights here.",
      icon: Activity,
    });
  }

  return insights;
}

export default function RealityCheck({ tasks, transactions, ideas, traits }) {
  const insights = generateInsights(tasks, transactions, ideas, traits);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
        Reality Check
      </h3>
      <div className="space-y-3">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          const colorMap = {
            warning: "text-destructive",
            positive: "text-mode-money",
            info: "text-muted-foreground",
          };
          return (
            <div key={i} className="flex items-start gap-3">
              <Icon
                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  colorMap[insight.type]
                }`}
              />
              <p className="text-sm text-foreground/80">{insight.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
