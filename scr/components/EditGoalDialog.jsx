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

export default function EditGoalDialog({
  open,
  onClose,
  goal,
  traits = [],
  onUpdated,
}) {
  const [form, setForm] = useState({});
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  useEffect(() => {
    if (goal) {
      setForm({
        name: goal.name || "",
        goal_type: goal.goal_type || "process",
        priority: goal.priority || "secondary",
        mode: goal.mode || "focus",
        deadline_type: goal.deadline_type || "open",
        deadline_date: goal.deadline_date || "",
        rolling_days: goal.rolling_days || "",
        frequency_type: goal.frequency_type || "flexible",
        frequency_count: goal.frequency_count || "",
        duration_type: goal.duration_type || "none",
        duration_minutes: goal.duration_minutes || "",
        linked_trait_id: goal.linked_trait_id || "",
        status: goal.status || "active",
        notes: goal.notes || "",
        micro_actions_raw: (goal.micro_actions || []).join("\n"),
      });
    }
  }, [goal]);

  const handleSave = async () => {
    const microActions = form.micro_actions_raw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    await base44.entities.Goal.update(goal.id, {
      ...form,
      rolling_days: form.rolling_days ? Number(form.rolling_days) : null,
      frequency_count: form.frequency_count
        ? Number(form.frequency_count)
        : null,
      duration_minutes: form.duration_minutes
        ? Number(form.duration_minutes)
        : null,
      linked_trait_id: form.linked_trait_id || null,
      micro_actions: microActions,
      micro_actions_raw: undefined,
    });
    onUpdated?.();
    onClose();
  };

  if (!goal) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Input
            value={form.name || ""}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Goal name"
            className="bg-background border-border"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Type
              </label>
              <Select
                value={form.goal_type}
                onValueChange={(v) => set("goal_type", v)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outcome">Outcome-based</SelectItem>
                  <SelectItem value="process">Process-based</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                  <SelectItem value="core">🔴 Core</SelectItem>
                  <SelectItem value="secondary">🟡 Secondary</SelectItem>
                  <SelectItem value="optional">⚪ Optional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="abandoned">Abandoned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
              Micro Actions (one per line)
            </label>
            <Textarea
              value={form.micro_actions_raw || ""}
              onChange={(e) => set("micro_actions_raw", e.target.value)}
              className="bg-background border-border resize-none"
              rows={3}
            />
          </div>
          {traits.length > 0 && (
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Linked Trait
              </label>
              <Select
                value={form.linked_trait_id || ""}
                onValueChange={(v) => set("linked_trait_id", v)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>None</SelectItem>
                  {traits.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.trait}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
