import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import ProjectCard from "../components/ProjectCard";
import AddProjectDialog from "../components/AddProjectDialog";
import { Plus, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Projects() {
  const [showAdd, setShowAdd] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: projects = [], refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: () => base44.entities.Project.list("-created_date", 50),
  });

  const filtered =
    statusFilter === "all"
      ? projects
      : projects.filter((p) => p.status === statusFilter);

  return (
    <div className="space-y-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
              Build
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          </div>
          <Button
            onClick={() => setShowAdd(true)}
            className="bg-primary hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {["all", "concept", "planning", "active", "paused", "completed"].map(
            (s) => (
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
            )
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} onUpdate={refetch} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FolderKanban className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No projects yet. Transform ideas into reality.
          </p>
        </div>
      )}

      <AddProjectDialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={refetch}
      />
    </div>
  );
}
