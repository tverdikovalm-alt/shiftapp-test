import { useState } from "react";
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

export default function AddGoalDialog({
  open,
  onClose,
  onCreated,
  traits = [],
}) {
  const [form, setForm] = useState({
    name: "",
    goal_type: "process",
    priority: "secondary",
    mode: "focus",
    deadline_type: "open",
    deadline_date: "",
    rolling_days: "",
    frequency_type: "flexible",
    frequency_count: "",
    duration_type: "none",
    duration_minutes: "",
    linked_trait_id: "",
    notes: "",
    micro_actions_raw: "",
  });
  const [loading, setLoading] = useState(false);
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setLoading(true);
    const microActions = form.micro_actions_raw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    await base44.entities.Goal.create({
      name: form.name.trim(),
      goal_type: form.goal_type,
      priority: form.priority,
      mode: form.mode,
      deadline_type: form.deadline_type,
      deadline_date: form.deadline_date || null,
      rolling_days: form.rolling_days ? Number(form.rolling_days) : null,
      frequency_type: form.frequency_type,
      frequency_count: form.frequency_count
        ? Number(form.frequency_count)
        : null,
      duration_type: form.duration_type,
      duration_minutes: form.duration_minutes
        ? Number(form.duration_minutes)
        : null,
      linked_trait_id: form.linked_trait_id || null,
      notes: form.notes,
      micro_actions: microActions,
      status: "active",
      completion_rate: 0,
    });
    setForm({
      name: "",
      goal_type: "process",
      priority: "secondary",
      mode: "focus",
      deadline_type: "open",
      deadline_date: "",
      rolling_days: "",
      frequency_type: "flexible",
      frequency_count: "",
      duration_type: "none",
      duration_minutes: "",
      linked_trait_id: "",
      notes: "",
      micro_actions_raw: "",
    });
    setLoading(false);
    onCreated?.();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Input
            placeholder="Goal name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="bg-background border-border"
            autoFocus
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
                  <SelectItem value="fixed">Fixed date</SelectItem>
                  <SelectItem value="rolling">Rolling</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.deadline_type === "fixed" && (
            <Input
              type="date"
              value={form.deadline_date}
              onChange={(e) => set("deadline_date", e.target.value)}
              className="bg-background border-border"
            />
          )}
          {form.deadline_type === "rolling" && (
            <Input
              type="number"
              placeholder="Complete within N days"
              value={form.rolling_days}
              onChange={(e) => set("rolling_days", e.target.value)}
              className="bg-background border-border"
            />
          )}

          <div className="grid grid-cols-2 gap-3">
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
                  <SelectItem value="flexible">Flexible quota</SelectItem>
                  <SelectItem value="one_time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(form.frequency_type === "weekly_x" ||
              form.frequency_type === "flexible") && (
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                  Times
                </label>
                <Input
                  type="number"
                  placeholder="3"
                  value={form.frequency_count}
                  onChange={(e) => set("frequency_count", e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
              Duration
            </label>
            <div className="flex gap-2">
              <Select
                value={form.duration_type}
                onValueChange={(v) => set("duration_type", v)}
              >
                <SelectTrigger className="bg-background border-border flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Completion-based</SelectItem>
                  <SelectItem value="fixed">Fixed duration</SelectItem>
                  <SelectItem value="minimum">Minimum</SelectItem>
                </SelectContent>
              </Select>
              {form.duration_type !== "none" && (
                <Input
                  type="number"
                  placeholder="min"
                  value={form.duration_minutes}
                  onChange={(e) => set("duration_minutes", e.target.value)}
                  className="bg-background border-border w-24"
                />
              )}
            </div>
          </div>

          {traits.length > 0 && (
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Link to Identity Trait
              </label>
              <Select
                value={form.linked_trait_id}
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

          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
              Micro actions (one per line)
            </label>
            <Textarea
              placeholder={"open file\nsketch idea\nreview references"}
              value={form.micro_actions_raw}
              onChange={(e) => set("micro_actions_raw", e.target.value)}
              className="bg-background border-border resize-none"
              rows={3}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!form.name.trim() || loading}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Goal"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
