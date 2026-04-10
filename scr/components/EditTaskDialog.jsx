import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { MODE_CONFIG } from "../lib/modeConfig";

export default function EditTaskDialog({
  open,
  onClose,
  task,
  goals = [],
  onUpdated,
}) {
  const [form, setForm] = useState({});
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        task_type: task.task_type || "regular",
        mode: task.mode || "focus",
        priority: task.priority || "medium",
        deadline_type: task.deadline_type || "none",
        deadline_date: task.deadline_date || "",
        estimated_minutes: task.estimated_minutes || "",
        energy_level: task.energy_level || "medium",
        time_of_day: task.time_of_day || "anytime",
        linked_goal_id: task.linked_goal_id || "",
        status: task.status || "active",
      });
    }
  }, [task]);

  const handleSave = async () => {
    await base44.entities.Task.update(task.id, {
      ...form,
      estimated_minutes: form.estimated_minutes
        ? Number(form.estimated_minutes)
        : null,
      linked_goal_id: form.linked_goal_id || null,
      deadline_date: form.deadline_date || null,
    });
    onUpdated?.();
    onClose();
  };

  const handleDelete = async () => {
    await base44.entities.Task.delete(task.id);
    onUpdated?.();
    onClose();
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Input
            value={form.title || ""}
            onChange={(e) => set("title", e.target.value)}
            className="bg-background border-border"
          />
          <Textarea
            value={form.description || ""}
            onChange={(e) => set("description", e.target.value)}
            className="bg-background border-border resize-none"
            rows={2}
            placeholder="Description (optional)"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Type
              </label>
              <Select
                value={form.task_type}
                onValueChange={(v) => set("task_type", v)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="quick">Quick</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Priority
              </label>
              <Select
                value={form.priority}
                onValueChange={(v) => set("priority", v)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">🔴 High</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="low">⚪ Low</SelectItem>
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="deferred">Deferred</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Deadline
              </label>
              <Select
                value={form.deadline_type}
                onValueChange={(v) => set("deadline_type", v)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="soft">Soft</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.deadline_type !== "none" && (
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                  Date
                </label>
                <Input
                  type="date"
                  value={form.deadline_date || ""}
                  onChange={(e) => set("deadline_date", e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Duration (min)
              </label>
              <Input
                type="number"
                placeholder="30"
                value={form.estimated_minutes || ""}
                onChange={(e) => set("estimated_minutes", e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Best Time
              </label>
              <Select
                value={form.time_of_day}
                onValueChange={(v) => set("time_of_day", v)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="anytime">Anytime</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {goals.length > 0 && (
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Linked Goal
              </label>
              <Select
                value={form.linked_goal_id || ""}
                onValueChange={(v) => set("linked_goal_id", v)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>None</SelectItem>
                  {goals.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button onClick={handleSave} className="flex-1">
              Save Changes
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
