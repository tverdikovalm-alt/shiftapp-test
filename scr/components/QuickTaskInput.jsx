import { useState } from "react";
import { Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { MODE_CONFIG } from "../lib/modeConfig";

export default function QuickTaskInput({ currentMode, onCreated }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const modeConfig = MODE_CONFIG[currentMode] || MODE_CONFIG.focus;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    await base44.entities.Task.create({
      title: value.trim(),
      mode: currentMode,
      task_type: "quick",
      status: "active",
      priority: "medium",
      deadline_type: "none",
    });
    setValue("");
    setLoading(false);
    onCreated?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border ${modeConfig.borderClass} ${modeConfig.bgLightClass} bg-opacity-50`}
    >
      <Zap className={`w-3.5 h-3.5 ${modeConfig.textClass} flex-shrink-0`} />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Quick task — just type and hit enter..."
        className="bg-transparent border-0 focus-visible:ring-0 px-0 text-sm placeholder:text-muted-foreground h-auto py-0"
        disabled={loading}
      />
      {value && (
        <kbd className="text-[10px] text-muted-foreground font-mono">↵</kbd>
      )}
    </form>
  );
}
