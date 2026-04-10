import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import GoalCard from "../components/GoalCard";
import AddGoalDialog from "../components/AddGoalDialog";
import { Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Goals() {
  const { currentMode } = useOutletContext();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");

  const { data: goals = [], refetch } = useQuery({
    queryKey: ["goals"],
    queryFn: () => base44.entities.Goal.list("-created_date", 100),
  });

  const { data: traits = [] } = useQuery({
    queryKey: ["traits"],
    queryFn: () => base44.entities.IdentityTrait.list("-created_date", 50),
  });

  const filtered =
    filter === "all"
      ? goals
      : filter === "mode"
      ? goals.filter((g) => g.mode === currentMode)
      : goals.filter((g) => g.status === filter);

  const byPriority = {
    core: filtered.filter((g) => g.priority === "core"),
    secondary: filtered.filter((g) => g.priority === "secondary"),
    optional: filtered.filter((g) => g.priority === "optional"),
  };

  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
              Pursuit
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Goals</h1>
          </div>
          <Button
            onClick={() => setShowAdd(true)}
            className="bg-primary hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {[
            { key: "all", label: "All" },
            { key: "mode", label: "Current Mode" },
            { key: "active", label: "Active" },
            { key: "paused", label: "Paused" },
            { key: "completed", label: "Completed" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all
                ${
                  filter === f.key
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Goals by Priority */}
      {["core", "secondary", "optional"].map(
        (priority) =>
          byPriority[priority].length > 0 && (
            <div key={priority}>
              <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
                {priority === "core"
                  ? "🔴 Core"
                  : priority === "secondary"
                  ? "🟡 Secondary"
                  : "⚪ Optional"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {byPriority[priority].map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    traits={traits}
                    onUpdate={refetch}
                  />
                ))}
              </div>
            </div>
          )
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Target className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No goals defined. What are you working toward?
          </p>
        </div>
      )}

      <AddGoalDialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={refetch}
        traits={traits}
      />
    </div>
  );
}
