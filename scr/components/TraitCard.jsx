import { Trash2, Plus, Minus } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function TraitCard({ trait, onUpdate }) {
  const indicators = trait.behavioral_indicators || [];

  const handleAlignmentChange = async (delta) => {
    const newScore = Math.min(
      100,
      Math.max(0, (trait.alignment_score || 0) + delta)
    );
    await base44.entities.IdentityTrait.update(trait.id, {
      alignment_score: newScore,
    });
    onUpdate?.();
  };

  const handleDelete = async () => {
    await base44.entities.IdentityTrait.delete(trait.id);
    onUpdate?.();
  };

  const score = trait.alignment_score || 0;

  return (
    <div className="group bg-card border border-border rounded-xl p-5 hover:border-mode-life/30 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {trait.trait}
          </h3>
          {trait.description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {trait.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleAlignmentChange(-5)}
            className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-sm font-mono font-semibold text-mode-life min-w-[36px] text-center">
            {score}%
          </span>
          <button
            onClick={() => handleAlignmentChange(5)}
            className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-mode-life rounded-full transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Behavioral Indicators */}
      {indicators.length > 0 && (
        <div className="space-y-1.5">
          {indicators.map((ind, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{ind.action}</span>
              <span className="font-mono text-foreground/70">
                {ind.current_count || 0} / {ind.frequency_target || "?"}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
