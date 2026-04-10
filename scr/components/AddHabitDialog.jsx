import { useState } from "react";
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

export default function AddHabitDialog({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [habitType, setHabitType] = useState("binary");
  const [mode, setMode] = useState("focus");
  const [frequencyType, setFrequencyType] = useState("daily");
  const [frequencyCount, setFrequencyCount] = useState("");
  const [specificDays, setSpecificDays] = useState([]);
  const [durationMinutes, setDurationMinutes] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleDay = (d) =>
    setSpecificDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await base44.entities.Habit.create({
      name: name.trim(),
      habit_type: habitType,
      mode,
      frequency_type: frequencyType,
      frequency_count: frequencyCount ? Number(frequencyCount) : null,
      specific_days: specificDays,
      duration_minutes: durationMinutes ? Number(durationMinutes) : null,
      status: "active",
      check_ins: [],
    });
    setName("");
    setFrequencyCount("");
    setSpecificDays([]);
    setDurationMinutes("");
    setLoading(false);
    onCreated?.();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Habit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Input
            placeholder="Habit name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-background border-border"
            autoFocus
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Type
              </label>
              <Select value={habitType} onValueChange={setHabitType}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="binary">Binary (done/not done)</SelectItem>
                  <SelectItem value="measurable">Measurable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Mode
              </label>
              <Select value={mode} onValueChange={setMode}>
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

          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
              Frequency
            </label>
            <Select value={frequencyType} onValueChange={setFrequencyType}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly_x">X times/week</SelectItem>
                <SelectItem value="specific_days">Specific days</SelectItem>
                <SelectItem value="flexible">Flexible quota</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(frequencyType === "weekly_x" || frequencyType === "flexible") && (
            <Input
              type="number"
              placeholder="How many times per week?"
              value={frequencyCount}
              onChange={(e) => setFrequencyCount(e.target.value)}
              className="bg-background border-border"
            />
          )}

          {frequencyType === "specific_days" && (
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2 block">
                Select Days
              </label>
              <div className="flex gap-1.5">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all
                      ${
                        specificDays.includes(d)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {d[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Input
            type="number"
            placeholder="Target duration (minutes, optional)"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            className="bg-background border-border"
          />

          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || loading}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Habit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
