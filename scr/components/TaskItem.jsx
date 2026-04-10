import { MODE_CONFIG } from "../lib/modeConfig";
import { Check, Clock, Edit2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useState } from "react";
import EditTaskDialog from "./EditTaskDialog";

export default function TaskItem({ task, onUpdate, goals = [] }) {
  const [showEdit, setShowEdit] = useState(false);
  const config = MODE_CONFIG[task.mode] || MODE_CONFIG.focus;
  const Icon = config.icon;

  const toggleComplete = async () => {
    const newStatus = task.status === "completed" ? "active" : "completed";
    await base44.entities.Task.update(task.id, {
      status: newStatus,
      completed_date:
        newStatus === "completed" ? new Date().toISOString() : null,
    });
    if (onUpdate) onUpdate();
  };

  const isCompleted = task.status === "completed";

  return (
    <div
      className={`group flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200
      ${
        isCompleted
          ? "border-border/50 bg-card/50 opacity-60"
          : `border-border bg-card hover:${config.bgLightClass} hover:${config.borderClass}`
      }`}
    >
      <button
        onClick={toggleComplete}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
          ${
            isCompleted
              ? `${config.bgClass} ${config.borderClass}`
              : `border-muted-foreground/30 hover:${config.borderClass}`
          }`}
      >
        {isCompleted && <Check className="w-3 h-3 text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm ${
            isCompleted
              ? "line-through text-muted-foreground"
              : "text-foreground"
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        {task.estimated_minutes && (
          <span className="flex items-center gap-1 text-[10px] font-mono">
            <Clock className="w-3 h-3" />
            {task.estimated_minutes}m
          </span>
        )}
        {task.deadline_type === "hard" && (
          <span className="text-[10px] text-destructive font-mono">hard</span>
        )}
        <Icon className={`w-3.5 h-3.5 ${config.textClass} opacity-50`} />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowEdit(true);
          }}
          className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-foreground transition-all"
        >
          <Edit2 className="w-3 h-3" />
        </button>
      </div>
      <EditTaskDialog
        open={showEdit}
        onClose={() => setShowEdit(false)}
        task={task}
        goals={goals}
        onUpdated={() => {
          setShowEdit(false);
          onUpdate?.();
        }}
      />
    </div>
  );
}
