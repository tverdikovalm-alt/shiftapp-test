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

export default function AddProjectDialog({ open, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [concept, setConcept] = useState("");
  const [format, setFormat] = useState("other");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await base44.entities.Project.create({
      title: title.trim(),
      concept: concept.trim(),
      format,
      status: "concept",
    });
    setTitle("");
    setConcept("");
    setLoading(false);
    onCreated?.();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">New Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Input
            placeholder="Project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background border-border"
            autoFocus
          />
          <Textarea
            placeholder="What's the concept? Why does this matter?"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            className="bg-background border-border resize-none"
            rows={3}
          />
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
              Format
            </label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="campaign">Campaign</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="code">Code</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || loading}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
