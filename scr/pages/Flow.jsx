import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { MODE_CONFIG } from "../lib/modeConfig";
import TaskItem from "../components/TaskItem";
import AddTaskDialog from "../components/AddTaskDialog";
import QuickTaskInput from "../components/QuickTaskInput";
import ModeCard from "../components/ModeCard";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Flow() {
  const { currentMode, setCurrentMode } = useOutletContext();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");
  const modeConfig = MODE_CONFIG[currentMode];

  const { data: tasks = [], refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => base44.entities.Task.list("-created_date", 100),
  });

  const { data: goals = [] } = useQuery({
    queryKey: ["goals"],
    queryFn: () => base44.entities.Goal.list("-created_date", 50),
  });

  const filteredTasks = tasks.filter((t) => {
    if (filter === "mode") return t.mode === currentMode;
    if (filter === "active")
      return t.status === "active" || t.status === "suggested";
    if (filter === "completed") return t.status === "completed";
    return true;
  });

  const groupedByMode = {};
  filteredTasks.forEach((t) => {
    if (!groupedByMode[t.mode]) groupedByMode[t.mode] = [];
    groupedByMode[t.mode].push(t);
  });

  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
              Adaptive
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Daily Flow
            </h1>
          </div>
          <Button
            onClick={() => setShowAdd(true)}
            className={`${modeConfig.bgClass} hover:opacity-90 text-white`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Quick Task */}
        <div className="mb-6">
          <QuickTaskInput currentMode={currentMode} onCreated={refetch} />
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {Object.entries(MODE_CONFIG).map(([key, config]) => (
            <ModeCard
              key={key}
              mode={key}
              isActive={currentMode === key}
              onClick={() => setCurrentMode(key)}
            >
              <div className="mt-3 text-xs font-mono text-muted-foreground">
                {
                  tasks.filter(
                    (t) => t.mode === key && t.status !== "completed"
                  ).length
                }{" "}
                active
              </div>
            </ModeCard>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          {[
            { key: "all", label: "All" },
            { key: "mode", label: modeConfig.label },
            { key: "active", label: "Active" },
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

      {/* Task List */}
      <AnimatePresence mode="wait">
        {filter === "all" || filter === "active" || filter === "completed" ? (
          Object.entries(groupedByMode).map(([mode, modeTasks]) => (
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h3
                className={`text-xs font-mono uppercase tracking-widest ${
                  MODE_CONFIG[mode]?.textClass || "text-muted-foreground"
                } mb-2`}
              >
                {MODE_CONFIG[mode]?.label || mode}
              </h3>
              {modeTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  goals={goals}
                  onUpdate={refetch}
                />
              ))}
            </motion.div>
          ))
        ) : (
          <motion.div
            key="filtered"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                goals={goals}
                onUpdate={refetch}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {filteredTasks.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">
            No tasks yet. Start by adding one.
          </p>
        </div>
      )}

      <AddTaskDialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
        defaultMode={currentMode}
        onCreated={refetch}
      />
    </div>
  );
}
