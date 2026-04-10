import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { base44 } from "@/api/base44Client";

export default function AddTraitDialog({ open, onClose, onCreated }) {
  const [trait, setTrait] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("mindset");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!trait.trim()) return;
    setLoading(true);
    await base44.entities.IdentityTrait.create({
      trait: trait.trim(),
      description: description.trim(),
      category,
      alignment_score: 0,
      behavioral_indicators: [],
    });
    setTrait("");
    setDescription("");
    setLoading(false);
    onCreated?.();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">New Identity Trait</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Input
            placeholder="e.g. Independent, Creative, Disciplined"
            value={trait}
            onChange={(e) => setTrait(e.target.value)}
            className="bg-background border-border"
            autoFocus
          />
          <Textarea
            placeholder="What does this trait mean to you?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-background border-border resize-none"
            rows={2}
          />
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="discipline">Discipline</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="mindset">Mindset</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!trait.trim() || loading}
            className="w-full bg-mode-life hover:opacity-90 text-white"
          >
            {loading ? "Creating..." : "Add Trait"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
