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

export default function AddTaskDialog({
  open,
  onClose,
  defaultMode,
  onCreated,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState(defaultMode || "focus");
  const [energy, setEnergy] = useState("medium");
  const [timeOfDay, setTimeOfDay] = useState("anytime");
  const [minutes, setMinutes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await base44.entities.Task.create({
      title: title.trim(),
      description: description.trim(),
      mode,
      energy_level: energy,
      time_of_day: timeOfDay,
      estimated_minutes: minutes ? Number(minutes) : null,
      status: "active",
    });
    setTitle("");
    setDescription("");
    setMinutes("");
    setLoading(false);
    onCreated?.();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Input
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background border-border"
            autoFocus
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-background border-border resize-none"
            rows={2}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Mode
              </label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MODE_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Energy
              </label>
              <Select value={energy} onValueChange={setEnergy}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Best Time
              </label>
              <Select value={timeOfDay} onValueChange={setTimeOfDay}>
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
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Duration (min)
              </label>
              <Input
                type="number"
                placeholder="30"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || loading}
            className={`w-full ${MODE_CONFIG[mode].bgClass} hover:opacity-90 text-white`}
          >
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
