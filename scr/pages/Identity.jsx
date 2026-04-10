import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import TraitCard from "../components/TraitCard";
import AddTraitDialog from "../components/AddTraitDialog";
import { Plus, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Identity() {
  const [showAdd, setShowAdd] = useState(false);

  const { data: traits = [], refetch } = useQuery({
    queryKey: ["traits"],
    queryFn: () => base44.entities.IdentityTrait.list("-created_date", 50),
  });

  const avgAlignment =
    traits.length > 0
      ? Math.round(
          traits.reduce((s, t) => s + (t.alignment_score || 0), 0) /
            traits.length
        )
      : 0;

  const categories = [
    ...new Set(traits.map((t) => t.category).filter(Boolean)),
  ];

  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
              Evolve
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Identity</h1>
          </div>
          <Button
            onClick={() => setShowAdd(true)}
            className="bg-mode-life hover:opacity-90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Trait
          </Button>
        </div>

        {/* Overall Alignment */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Overall Alignment
              </p>
              <p className="text-4xl font-semibold tracking-tight text-mode-life mt-1">
                {avgAlignment}%
              </p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-mode-life/30 flex items-center justify-center">
              <Fingerprint className="w-6 h-6 text-mode-life" />
            </div>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-mode-life rounded-full transition-all duration-700"
              style={{ width: `${avgAlignment}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Traits by Category */}
      {categories.length > 0 ? (
        categories.map((cat) => (
          <div key={cat}>
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
              {cat}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {traits
                .filter((t) => t.category === cat)
                .map((trait) => (
                  <TraitCard key={trait.id} trait={trait} onUpdate={refetch} />
                ))}
            </div>
          </div>
        ))
      ) : traits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {traits.map((trait) => (
            <TraitCard key={trait.id} trait={trait} onUpdate={refetch} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Fingerprint className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Define who you want to become
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Add identity traits to start tracking alignment
          </p>
        </div>
      )}

      <AddTraitDialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={refetch}
      />
    </div>
  );
}
