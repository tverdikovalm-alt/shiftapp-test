import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import HabitRow from "../components/HabitRow";
import AddHabitDialog from "../components/AddHabitDialog";
import WeeklyHabitAnalytics from "../components/WeeklyHabitAnalytics";
import { Button } from "@/components/ui/button";
import { Plus, Repeat } from "lucide-react";
import { motion } from "framer-motion";
import moment from "moment";

export default function Habits() {
  const [showAdd, setShowAdd] = useState(false);

  const { data: habits = [], refetch } = useQuery({
    queryKey: ["habits"],
    queryFn: () => base44.entities.Habit.list("-created_date", 100),
  });

  const activeHabits = habits.filter((h) => h.status === "active");
  const archivedHabits = habits.filter((h) => h.status !== "active");

  const last7Days = Array.from({ length: 7 }, (_, i) =>
    moment()
      .subtract(6 - i, "days")
      .format("YYYY-MM-DD")
  );

  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
              Repeat
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Habits</h1>
          </div>
          <Button
            onClick={() => setShowAdd(true)}
            className="bg-primary hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Habit
          </Button>
        </div>

        {/* Week grid */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center border-b border-border px-4 py-2">
            <div className="flex-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Habit
            </div>
            <div className="flex gap-1">
              {last7Days.map((d) => (
                <div
                  key={d}
                  className={`w-8 text-center text-[10px] font-mono ${
                    moment(d).isSame(moment(), "day")
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {moment(d).format("dd")[0]}
                </div>
              ))}
            </div>
          </div>

          {activeHabits.length > 0 ? (
            activeHabits.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                last7Days={last7Days}
                onUpdate={refetch}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <Repeat className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No active habits. Build consistency.
              </p>
            </div>
          )}
        </div>

        {/* Weekly Analytics */}
        <WeeklyHabitAnalytics habits={habits} />

        {/* Archived */}
        {archivedHabits.length > 0 && (
          <div>
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
              Archived
            </h2>
            <div className="space-y-1">
              {archivedHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground bg-card border border-border"
                >
                  <span className="flex-1">{habit.name}</span>
                  <span className="text-[10px] font-mono">{habit.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <AddHabitDialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={refetch}
      />
    </div>
  );
}
