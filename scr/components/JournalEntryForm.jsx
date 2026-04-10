import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp } from "lucide-react";
import moment from "moment";

const PROMPTS = [
  { key: "what_did_i_do", label: "What did I do today?" },
  { key: "proud_of", label: "What am I proud of?" },
  { key: "what_was_hard", label: "What felt difficult?" },
  { key: "energy_sources", label: "What gave / drained energy?" },
];

export default function JournalEntryForm({
  currentMode,
  existingEntry,
  onSaved,
  onCancel,
}) {
  const [mood, setMood] = useState(existingEntry?.mood || 5);
  const [energy, setEnergy] = useState(existingEntry?.energy || 5);
  const [freeText, setFreeText] = useState(existingEntry?.free_text || "");
  const [prompts, setPrompts] = useState({});
  const [showPrompts, setShowPrompts] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingEntry) {
      setMood(existingEntry.mood || 5);
      setEnergy(existingEntry.energy || 5);
      setFreeText(existingEntry.free_text || "");
      const p = {};
      PROMPTS.forEach((pr) => {
        p[pr.key] = existingEntry[pr.key] || "";
      });
      setPrompts(p);
    }
  }, [existingEntry]);

  const handleSave = async () => {
    setLoading(true);
    const data = {
      date: moment().toISOString(),
      mood,
      energy,
      free_text: freeText,
      current_mode: currentMode,
      ...prompts,
    };
    if (existingEntry) {
      await base44.entities.JournalEntry.update(existingEntry.id, data);
    } else {
      await base44.entities.JournalEntry.create(data);
    }
    setLoading(false);
    onSaved?.();
  };

  const moodLabel =
    mood <= 3
      ? "😔 Low"
      : mood <= 6
      ? "😐 Okay"
      : mood <= 8
      ? "😊 Good"
      : "🔥 Great";
  const energyLabel =
    energy <= 3 ? "🪫 Drained" : energy <= 6 ? "⚡ Moderate" : "⚡⚡ High";

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          {existingEntry ? "Edit today" : "Today's reflection"}
        </p>
        <p className="text-xs font-mono text-muted-foreground">
          {moment().format("ddd, MMM D")}
        </p>
      </div>

      {/* Mood & Energy sliders */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
              Mood
            </label>
            <span className="text-xs">{moodLabel}</span>
          </div>
          <Slider
            value={[mood]}
            onValueChange={([v]) => setMood(v)}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
              Energy
            </label>
            <span className="text-xs">{energyLabel}</span>
          </div>
          <Slider
            value={[energy]}
            onValueChange={([v]) => setEnergy(v)}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Free write */}
      <Textarea
        placeholder="Free write — no structure required..."
        value={freeText}
        onChange={(e) => setFreeText(e.target.value)}
        className="bg-background border-border resize-none"
        rows={3}
      />

      {/* Guided prompts */}
      <div>
        <button
          onClick={() => setShowPrompts(!showPrompts)}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPrompts ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
          Guided prompts (optional)
        </button>
        {showPrompts && (
          <div className="mt-3 space-y-3">
            {PROMPTS.map((prompt) => (
              <div key={prompt.key}>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                  {prompt.label}
                </label>
                <Textarea
                  value={prompts[prompt.key] || ""}
                  onChange={(e) =>
                    setPrompts((p) => ({ ...p, [prompt.key]: e.target.value }))
                  }
                  className="bg-background border-border resize-none"
                  rows={2}
                  placeholder="..."
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={loading} className="flex-1">
          {loading ? "Saving..." : existingEntry ? "Update" : "Save Reflection"}
        </Button>
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-border"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
