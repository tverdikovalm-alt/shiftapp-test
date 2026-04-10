import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { MODE_CONFIG } from "../lib/modeConfig";
import { Edit2 } from "lucide-react";
import moment from "moment";
import EditHabitDialog from "./EditHabitDialog";

export default function HabitRow({ habit, last7Days, onUpdate }) {
  const [showEdit, setShowEdit] = useState(false);
  const modeConfig = habit.mode ? MODE_CONFIG[habit.mode] : null;

  const getCheckIn = (date) => {
    return (habit.check_ins || []).find((c) => c.date === date);
  };

  const toggleCheckIn = async (date) => {
    const existing = getCheckIn(date);
    let checkIns = [...(habit.check_ins || [])];

    if (existing) {
      // Cycle: done → partial → skipped → (remove)
      const cycle = { done: "partial", partial: "skipped", skipped: null };
      const next = cycle[existing.status];
      if (next === null) {
        checkIns = checkIns.filter((c) => c.date !== date);
      } else {
        checkIns = checkIns.map((c) =>
          c.date === date ? { ...c, status: next } : c
        );
      }
    } else {
      checkIns.push({ date, status: "done" });
    }

    await base44.entities.Habit.update(habit.id, { check_ins: checkIns });
    onUpdate?.();
  };

  const getStatusStyle = (status) => {
    if (!status) return "bg-secondary hover:bg-accent";
    if (status === "done")
      return modeConfig ? `${modeConfig.bgClass} opacity-90` : "bg-primary";
    if (status === "partial") return "bg-mode-creative/40";
    if (status === "skipped") return "bg-destructive/20";
    return "bg-secondary";
  };

  // Compute streak
  const streak = (() => {
    let s = 0;
    const today = moment().format("YYYY-MM-DD");
    for (let i = 0; i < 30; i++) {
      const d = moment().subtract(i, "days").format("YYYY-MM-DD");
      const ci = getCheckIn(d);
      if (ci && ci.status === "done") s++;
      else if (i > 0) break;
    }
    return s;
  })();

  return (
    <>
      <div className="group flex items-center border-b border-border last:border-0 px-4 py-3 hover:bg-accent/30 transition-all">
        <div className="flex-1 min-w-0 mr-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-foreground truncate">{habit.name}</p>
            {modeConfig && (
              <span
                className={`text-[10px] px-1.5 rounded ${modeConfig.bgLightClass} ${modeConfig.textClass} font-mono hidden sm:inline`}
              >
                {modeConfig.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
            {habit.frequency_type && (
              <span>{habit.frequency_type.replace("_", " ")}</span>
            )}
            {streak > 1 && (
              <span className="text-mode-creative">· {streak} streak</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 mr-2">
          {last7Days.map((date) => {
            const ci = getCheckIn(date);
            const isToday = moment(date).isSame(moment(), "day");
            return (
              <button
                key={date}
                onClick={() => toggleCheckIn(date)}
                className={`w-8 h-8 rounded-md transition-all duration-200 ${getStatusStyle(
                  ci?.status
                )}
                  ${isToday ? "ring-1 ring-primary/50" : ""}`}
                title={ci ? ci.status : "Not done"}
              />
            );
          })}
        </div>

        <button
          onClick={() => setShowEdit(true)}
          className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-foreground transition-all"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <EditHabitDialog
        open={showEdit}
        onClose={() => setShowEdit(false)}
        habit={habit}
        onUpdated={onUpdate}
      />
    </>
  );
}
