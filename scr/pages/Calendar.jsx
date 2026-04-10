import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MODE_CONFIG } from "../lib/modeConfig";
import EditTaskDialog from "../components/EditTaskDialog";
import AddTaskDialog from "../components/AddTaskDialog";
import moment from "moment";
import { motion } from "framer-motion";

const PRIORITY_DOT = {
  high: "bg-destructive",
  medium: "bg-mode-creative",
  low: "bg-muted-foreground",
};

export default function Calendar() {
  const { currentMode } = useOutletContext();
  const [view, setView] = useState("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [editTask, setEditTask] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addDate, setAddDate] = useState(null);

  const { data: tasks = [], refetch: refetchTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => base44.entities.Task.list("-created_date", 200),
  });
  const { data: habits = [] } = useQuery({
    queryKey: ["habits"],
    queryFn: () => base44.entities.Habit.list("-created_date", 100),
  });
  const { data: goals = [] } = useQuery({
    queryKey: ["goals"],
    queryFn: () => base44.entities.Goal.list("-created_date", 100),
  });

  const weekStart = moment().startOf("isoWeek").add(weekOffset, "weeks");
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    weekStart.clone().add(i, "days")
  );

  const getTasksForDay = (date) => {
    const dateStr = date.format("YYYY-MM-DD");
    return tasks.filter((t) => {
      if (t.status === "completed") return false;
      const dl = t.deadline_date
        ? moment(t.deadline_date).format("YYYY-MM-DD")
        : null;
      const sd = t.scheduled_date
        ? moment(t.scheduled_date).format("YYYY-MM-DD")
        : null;
      return dl === dateStr || sd === dateStr;
    });
  };

  const getHabitsForDay = (date) => {
    const dayName = date.format("ddd");
    const dayStr = date.format("YYYY-MM-DD");
    return habits
      .filter((h) => {
        if (h.status !== "active") return false;
        if (h.frequency_type === "daily") return true;
        if (h.frequency_type === "specific_days")
          return (h.specific_days || []).includes(dayName);
        return false;
      })
      .map((h) => {
        const ci = (h.check_ins || []).find((c) => c.date === dayStr);
        return { ...h, checkIn: ci };
      });
  };

  const getGoalDeadlinesForDay = (date) => {
    const dateStr = date.format("YYYY-MM-DD");
    return goals.filter(
      (g) =>
        g.deadline_date &&
        moment(g.deadline_date).format("YYYY-MM-DD") === dateStr
    );
  };

  const isToday = (date) => date.isSame(moment(), "day");
  const isOverloaded = (date) => getTasksForDay(date).length >= 5;

  return (
    <div className="space-y-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
              Schedule
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Calendar</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-secondary rounded-lg p-0.5 gap-0.5">
              {["week", "month"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all
                    ${
                      view === v
                        ? "bg-card text-foreground"
                        : "text-muted-foreground"
                    }`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
            <Button
              onClick={() => setShowAdd(true)}
              size="sm"
              className="bg-primary"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Task
            </Button>
          </div>
        </div>

        {/* Week navigation */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium">
            {weekStart.format("MMM D")} –{" "}
            {weekStart.clone().add(6, "days").format("MMM D, YYYY")}
          </span>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              className="text-xs text-muted-foreground hover:text-foreground ml-2"
            >
              Today
            </button>
          )}
        </div>
      </motion.div>

      {/* Week grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const dayTasks = getTasksForDay(day);
          const dayHabits = getHabitsForDay(day);
          const dayGoals = getGoalDeadlinesForDay(day);
          const overloaded = isOverloaded(day);

          return (
            <div
              key={day.format()}
              className={`min-h-32 rounded-xl border p-2 transition-all
                ${
                  isToday(day)
                    ? "border-primary/50 bg-primary/5"
                    : "border-border bg-card"
                }
                ${overloaded ? "border-destructive/30" : ""}
              `}
            >
              {/* Day header */}
              <div className="mb-2">
                <p
                  className={`text-[10px] font-mono uppercase tracking-widest ${
                    isToday(day) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {day.format("ddd")}
                </p>
                <p
                  className={`text-lg font-semibold leading-none ${
                    isToday(day) ? "text-primary" : "text-foreground"
                  }`}
                >
                  {day.format("D")}
                </p>
                {overloaded && (
                  <p className="text-[9px] text-destructive mt-0.5">
                    overloaded
                  </p>
                )}
              </div>

              {/* Tasks */}
              <div className="space-y-1">
                {dayTasks.slice(0, 4).map((task) => {
                  const modeConfig =
                    MODE_CONFIG[task.mode] || MODE_CONFIG.focus;
                  return (
                    <button
                      key={task.id}
                      onClick={() => setEditTask(task)}
                      className={`w-full text-left text-[10px] px-1.5 py-1 rounded-md ${modeConfig.bgLightClass} ${modeConfig.textClass} hover:opacity-80 transition-all truncate`}
                    >
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${
                          PRIORITY_DOT[task.priority] || "bg-muted-foreground"
                        }`}
                      />
                      {task.title}
                    </button>
                  );
                })}
                {dayTasks.length > 4 && (
                  <p className="text-[10px] text-muted-foreground pl-1">
                    +{dayTasks.length - 4} more
                  </p>
                )}

                {/* Habits */}
                {dayHabits.slice(0, 2).map((habit) => (
                  <div
                    key={habit.id}
                    className={`text-[10px] px-1.5 py-1 rounded-md border border-dashed transition-all
                    ${
                      habit.checkIn?.status === "done"
                        ? "border-mode-money/50 text-mode-money line-through opacity-60"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {habit.name}
                  </div>
                ))}

                {/* Goal deadlines */}
                {dayGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="text-[10px] px-1.5 py-1 rounded-md bg-mode-life/10 text-mode-life"
                  >
                    🎯 {goal.name}
                  </div>
                ))}

                {/* Add task shortcut */}
                <button
                  onClick={() => {
                    setAddDate(day.format("YYYY-MM-DD"));
                    setShowAdd(true);
                  }}
                  className="w-full text-[10px] text-muted-foreground hover:text-foreground py-0.5 opacity-0 hover:opacity-100 transition-all"
                >
                  + add
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
        {Object.entries(MODE_CONFIG).map(([k, c]) => (
          <div key={k} className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-sm ${c.bgLightClass}`} />
            <span>{c.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm border border-dashed border-border" />
          <span>Habit</span>
        </div>
      </div>

      {editTask && (
        <EditTaskDialog
          open={!!editTask}
          onClose={() => setEditTask(null)}
          task={editTask}
          goals={goals}
          onUpdated={() => {
            refetchTasks();
            setEditTask(null);
          }}
        />
      )}
      <AddTaskDialog
        open={showAdd}
        onClose={() => {
          setShowAdd(false);
          setAddDate(null);
        }}
        defaultMode={currentMode}
        onCreated={refetchTasks}
      />
    </div>
  );
}
