import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import moment from "moment";

export default function JournalEntryCard({ entry, onUpdate }) {
  const [expanded, setExpanded] = useState(false);

  const handleDelete = async () => {
    await base44.entities.JournalEntry.delete(entry.id);
    onUpdate?.();
  };

  const moodBar = entry.mood ? Math.round((entry.mood / 10) * 100) : 0;
  const energyBar = entry.energy ? Math.round((entry.energy / 10) * 100) : 0;

  const extraFields = [
    { key: "what_did_i_do", label: "Did" },
    { key: "proud_of", label: "Proud of" },
    { key: "what_was_hard", label: "Hard" },
    { key: "energy_sources", label: "Energy" },
  ].filter((f) => entry[f.key]);

  return (
    <div className="group bg-card border border-border rounded-xl p-4 hover:border-border/60 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-foreground">
            {moment(entry.date).format("ddd, MMM D")}
          </p>
          <p className="text-[10px] font-mono text-muted-foreground">
            {moment(entry.date).fromNow()}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">mood</span>
            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-mode-life rounded-full"
                style={{ width: `${moodBar}%` }}
              />
            </div>
            <span>{entry.mood || "—"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">energy</span>
            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-mode-creative rounded-full"
                style={{ width: `${energyBar}%` }}
              />
            </div>
            <span>{entry.energy || "—"}</span>
          </div>
        </div>
      </div>

      {entry.free_text && (
        <p
          className={`text-sm text-foreground/80 mb-2 ${
            !expanded ? "line-clamp-2" : ""
          }`}
        >
          {entry.free_text}
        </p>
      )}

      {extraFields.length > 0 && expanded && (
        <div className="space-y-2 mt-3 pt-3 border-t border-border">
          {extraFields.map((f) => (
            <div key={f.key}>
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-0.5">
                {f.label}
              </p>
              <p className="text-sm text-foreground/70">{entry[f.key]}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        {(entry.free_text?.length > 80 || extraFields.length > 0) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
            {expanded ? "Less" : "More"}
          </button>
        )}
        <button
          onClick={handleDelete}
          className="ml-auto opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
