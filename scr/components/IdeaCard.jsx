import { Trash2, ArrowUpRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import moment from "moment";

const moodEmoji = {
  excited: "🔥",
  calm: "🧘",
  frustrated: "😤",
  inspired: "✨",
  neutral: "💭",
};

const statusColor = {
  raw: "text-mode-creative",
  structured: "text-mode-focus",
  developing: "text-mode-money",
  archived: "text-muted-foreground",
};

export default function IdeaCard({ idea, view, onUpdate }) {
  const handleDelete = async () => {
    await base44.entities.Idea.delete(idea.id);
    onUpdate?.();
  };

  const cycleStatus = async () => {
    const order = ["raw", "structured", "developing", "archived"];
    const current = order.indexOf(idea.status || "raw");
    const next = order[(current + 1) % order.length];
    await base44.entities.Idea.update(idea.id, { status: next });
    onUpdate?.();
  };

  if (view === "list") {
    return (
      <div className="group flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-all">
        <span className="text-sm">{moodEmoji[idea.mood] || "💭"}</span>
        <p className="flex-1 text-sm text-foreground truncate">
          {idea.content}
        </p>
        <button
          onClick={cycleStatus}
          className={`text-[10px] uppercase font-mono ${
            statusColor[idea.status] || ""
          }`}
        >
          {idea.status || "raw"}
        </button>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="group relative bg-card border border-border rounded-xl p-4 hover:border-mode-creative/30 transition-all">
      <div className="flex items-start justify-between mb-2">
        <span className="text-lg">{moodEmoji[idea.mood] || "💭"}</span>
        <button
          onClick={cycleStatus}
          className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-accent ${
            statusColor[idea.status] || ""
          }`}
        >
          {idea.status || "raw"}
        </button>
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed mb-3">
        {idea.content}
      </p>
      {idea.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {idea.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground font-mono">
          {moment(idea.created_date).fromNow()}
        </span>
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
