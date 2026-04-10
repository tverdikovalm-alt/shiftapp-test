import { Trash2, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_STYLES = {
  concept: "text-mode-creative bg-mode-creative/10",
  planning: "text-mode-focus bg-mode-focus/10",
  active: "text-mode-money bg-mode-money/10",
  paused: "text-muted-foreground bg-muted",
  completed: "text-mode-life bg-mode-life/10",
};

export default function ProjectCard({ project, onUpdate }) {
  const components = project.components || [];
  const completedCount = components.filter((c) => c.completed).length;
  const progress =
    components.length > 0
      ? Math.round((completedCount / components.length) * 100)
      : 0;

  const handleDelete = async () => {
    await base44.entities.Project.delete(project.id);
    onUpdate?.();
  };

  const cycleStatus = async () => {
    const order = ["concept", "planning", "active", "paused", "completed"];
    const current = order.indexOf(project.status || "concept");
    const next = order[(current + 1) % order.length];
    await base44.entities.Project.update(project.id, { status: next });
    onUpdate?.();
  };

  return (
    <div className="group bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {project.title}
          </h3>
          {project.format && (
            <span className="text-[10px] uppercase font-mono text-muted-foreground">
              {project.format}
            </span>
          )}
        </div>
        <button
          onClick={cycleStatus}
          className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full ${
            STATUS_STYLES[project.status] || STATUS_STYLES.concept
          }`}
        >
          {project.status || "concept"}
        </button>
      </div>

      {project.concept && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {project.concept}
        </p>
      )}

      {/* Components Progress */}
      {components.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1.5">
            <span>Components</span>
            <span>
              {completedCount}/{components.length}
            </span>
          </div>
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {project.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border">
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
