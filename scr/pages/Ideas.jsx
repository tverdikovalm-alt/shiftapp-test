import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import IdeaCard from "../components/IdeaCard";
import QuickCaptureBar from "../components/QuickCaptureBar";
import { Lightbulb, Grid3X3, List } from "lucide-react";
import { motion } from "framer-motion";

export default function Ideas() {
  const [view, setView] = useState("grid");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: ideas = [], refetch } = useQuery({
    queryKey: ["ideas"],
    queryFn: () => base44.entities.Idea.list("-created_date", 100),
  });

  const filtered =
    statusFilter === "all"
      ? ideas
      : ideas.filter((i) => i.status === statusFilter);

  return (
    <div className="space-y-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
              Capture
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Ideas</h1>
          </div>
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-md transition-all ${
                view === "grid"
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded-md transition-all ${
                view === "list"
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Capture */}
        <QuickCaptureBar onCreated={refetch} />

        {/* Status Filters */}
        <div className="flex items-center gap-2 mt-6 mb-4">
          {["all", "raw", "structured", "developing", "archived"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all
                ${
                  statusFilter === s
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Ideas */}
      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
            : "space-y-2"
        }
      >
        {filtered.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} view={view} onUpdate={refetch} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Lightbulb className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Capture your first idea above
          </p>
        </div>
      )}
    </div>
  );
}
