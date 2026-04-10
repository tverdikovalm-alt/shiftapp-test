import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { MODE_CONFIG } from "../lib/modeConfig";
import StatCard from "../components/StatCard";
import ModeCard from "../components/ModeCard";
import TaskItem from "../components/TaskItem";
import RealityCheck from "../components/RealityCheck";
import {
  Zap,
  Wallet,
  Lightbulb,
  Target,
  TrendingUp,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import moment from "moment";

export default function Dashboard() {
  const { currentMode, setCurrentMode } = useOutletContext();
  const modeConfig = MODE_CONFIG[currentMode];

  const { data: tasks = [], refetch: refetchTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => base44.entities.Task.list("-created_date", 50),
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => base44.entities.Transaction.list("-created_date", 50),
  });

  const { data: ideas = [] } = useQuery({
    queryKey: ["ideas"],
    queryFn: () => base44.entities.Idea.list("-created_date", 20),
  });

  const { data: traits = [] } = useQuery({
    queryKey: ["traits"],
    queryFn: () => base44.entities.IdentityTrait.list("-created_date", 10),
  });

  const activeTasks = tasks.filter(
    (t) => t.status === "active" || t.status === "suggested"
  );
  const completedToday = tasks.filter(
    (t) =>
      t.status === "completed" &&
      moment(t.completed_date).isSame(moment(), "day")
  );
  const modeTasks = activeTasks
    .filter((t) => t.mode === currentMode)
    .slice(0, 5);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + (t.amount || 0), 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + (t.amount || 0), 0);
  const safeToSpend = totalIncome - totalExpenses;

  const avgAlignment =
    traits.length > 0
      ? Math.round(
          traits.reduce((s, t) => s + (t.alignment_score || 0), 0) /
            traits.length
        )
      : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
            {moment().format("dddd, MMMM D")}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${modeConfig.bgLightClass} ${modeConfig.textClass}`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${modeConfig.bgClass} animate-pulse`}
          />
          <span className="text-xs font-medium">{modeConfig.label} Mode</span>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Active Tasks"
          value={activeTasks.length}
          sublabel={`${completedToday.length} done today`}
          icon={Zap}
        />
        <StatCard
          label="Safe to Spend"
          value={`$${safeToSpend.toLocaleString()}`}
          sublabel="current balance"
          icon={Wallet}
          colorClass={safeToSpend >= 0 ? "text-mode-money" : "text-destructive"}
        />
        <StatCard
          label="Ideas"
          value={ideas.length}
          sublabel={`${ideas.filter((i) => i.status === "raw").length} raw`}
          icon={Lightbulb}
          colorClass="text-mode-creative"
        />
        <StatCard
          label="Alignment"
          value={`${avgAlignment}%`}
          sublabel="identity score"
          icon={Target}
          colorClass="text-mode-life"
        />
      </div>

      {/* Mode Selection */}
      <div>
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
          Select Mode
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(MODE_CONFIG).map(([key, config]) => (
            <ModeCard
              key={key}
              mode={key}
              isActive={currentMode === key}
              onClick={() => setCurrentMode(key)}
            />
          ))}
        </div>
      </div>

      {/* Current Mode Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {modeConfig.label} Tasks
            </h2>
            <span className="text-xs text-muted-foreground">
              {modeTasks.length} active
            </span>
          </div>
          {modeTasks.length > 0 ? (
            <div className="space-y-2">
              {modeTasks.map((task) => (
                <TaskItem key={task.id} task={task} onUpdate={refetchTasks} />
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No active tasks in {modeConfig.label} mode
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Head to Flow to add some
              </p>
            </div>
          )}
        </div>

        {/* Reality Check */}
        <RealityCheck
          tasks={tasks}
          transactions={transactions}
          ideas={ideas}
          traits={traits}
        />
      </div>
    </div>
  );
}
