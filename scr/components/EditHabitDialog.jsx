import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { MODE_CONFIG } from "../lib/modeConfig";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function EditHabitDialog({ open, onClose, habit, onUpdated }) {
  const [form, setForm] = useState({});
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (habit) {
      setForm({
        name: habit.name || "",
        habit_type: habit.habit_type || "binary",
        mode: habit.mode || "focus",
        frequency_type: habit.frequency_type || "daily",
        frequency_count: habit.frequency_count || "",
        specific_days: habit.specific_days || [],
        duration_minutes: habit.duration_minutes || "",
        status: habit.status || "active",
      });
    }
  }, [habit]);

  const toggleDay = (d) =>
    set(
      "specific_days",
      form.specific_days?.includes(d)
        ? form.specific_days.filter((x) => x !== d)
        : [...(form.specific_days || []), d]
    );

  const handleSave = async () => {
    await base44.entities.Habit.update(habit.id, {
      ...form,
      frequency_count: form.frequency_count
        ? Number(form.frequency_count)
        : null,
      duration_minutes: form.duration_minutes
        ? Number(form.duration_minutes)
        : null,
    });
    onUpdated?.();
    onClose();
  };

  const handleDelete = async () => {
    await base44.entities.Habit.delete(habit.id);
    onUpdated?.();
    onClose();
  };

  if (!habit) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Input
            value={form.name || ""}
            onChange={(e) => set("name", e.target.value)}
            className="bg-background border-border"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Mode
              </label>
              <Select value={form.mode} onValueChange={(v) => set("mode", v)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MODE_CONFIG).map(([k, c]) => (
                    <SelectItem key={k} value={k}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Status
              </label>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", v)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
              Frequency
            </label>
            <Select
              value={form.frequency_type}
              onValueChange={(v) => set("frequency_type", v)}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly_x">X times/week</SelectItem>
                <SelectItem value="specific_days">Specific days</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.frequency_type === "specific_days" && (
            <div className="flex gap-1.5">
              {DAYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDay(d)}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all
                    ${
                      form.specific_days?.includes(d)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                >
                  {d[0]}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1">
              Save
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              className="text-destructive hover:text-destructive border-destructive/30"
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
