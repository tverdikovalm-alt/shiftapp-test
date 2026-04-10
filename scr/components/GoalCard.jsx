import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { MODE_CONFIG } from "../lib/modeConfig";
import { Trash2, Edit2, Zap, ChevronDown, ChevronUp } from "lucide-react";
import moment from "moment";
import EditGoalDialog from "./EditGoalDialog";

const STATUS_STYLE = {
  active: "text-mode-money bg-mode-money/10",
  paused: "text-muted-foreground bg-muted",
  completed: "text-mode-life bg-mode-life/10",
  abandoned: "text-destructive bg-destructive/10",
};

export default function GoalCard({ goal, traits, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const modeConfig = goal.mode ? MODE_CONFIG[goal.mode] : null;
  const linkedTrait = traits?.find((t) => t.id === goal.linked_trait_id);

  const handleDelete = async () => {
    await base44.entities.Goal.delete(goal.id);
    onUpdate?.();
  };

  const updateRate = async (delta) => {
    const newRate = Math.min(
      100,
      Math.max(0, (goal.completion_rate || 0) + delta)
    );
    await base44.entities.Goal.update(goal.id, { completion_rate: newRate });
    onUpdate?.();
  };

  const daysLeft = goal.deadline_date
    ? moment(goal.deadline_date).diff(moment(), "days")
    : null;

  return (
    <>
      <div className="group bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-all">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 mr-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-foreground">
                {goal.name}
              </h3>
              {modeConfig && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${modeConfig.bgLightClass} ${modeConfig.textClass} font-mono`}
                >
                  {modeConfig.label}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-muted-foreground">
              <span>
                {goal.goal_type === "outcome" ? "Outcome" : "Process"}
              </span>
              {goal.frequency_type && (
                <span>· {goal.frequency_type.replace("_", " ")}</span>
              )}
              {daysLeft !== null && (
                <span className={daysLeft < 3 ? "text-destructive" : ""}>
                  ·{" "}
                  {daysLeft >= 0
                    ? `${daysLeft}d left`
                    : `${Math.abs(daysLeft)}d overdue`}
                </span>
              )}
            </div>
          </div>
          <span
            className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full flex-shrink-0 ${
              STATUS_STYLE[goal.status] || STATUS_STYLE.active
            }`}
          >
            {goal.status || "active"}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1">
            <span>Progress</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => updateRate(-5)}
                className="hover:text-foreground transition-colors"
              >
                −
              </button>
              <span className="text-foreground">
                {goal.completion_rate || 0}%
              </span>
              <button
                onClick={() => updateRate(5)}
                className="hover:text-foreground transition-colors"
              >
                +
              </button>
            </div>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${goal.completion_rate || 0}%` }}
            />
          </div>
        </div>

        {/* Linked trait */}
        {linkedTrait && (
          <p className="text-[10px] text-muted-foreground mb-2">
            🧬 {linkedTrait.trait}
          </p>
        )}

        {/* Micro actions */}
        {goal.micro_actions?.length > 0 && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <Zap className="w-3 h-3" />
              Quick actions
              {expanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
            {expanded && (
              <div className="mt-2 space-y-1">
                {goal.micro_actions.map((action, i) => (
                  <div
                    key={i}
                    className="text-xs text-muted-foreground bg-accent/50 rounded-md px-3 py-1.5"
                  >
                    {action}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border mt-3">
          <button
            onClick={() => setShowEdit(true)}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <EditGoalDialog
        open={showEdit}
        onClose={() => setShowEdit(false)}
        goal={goal}
        traits={traits}
        onUpdated={onUpdate}
      />
    </>
  );
}
