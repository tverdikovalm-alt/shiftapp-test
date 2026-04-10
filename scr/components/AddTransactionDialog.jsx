import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { EMOTIONAL_TAGS } from "../lib/modeConfig";

export default function AddTransactionDialog({ open, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [emotionalTag, setEmotionalTag] = useState("neutral");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !amount) return;
    setLoading(true);
    await base44.entities.Transaction.create({
      title: title.trim(),
      amount: Number(amount),
      type,
      category: category.trim(),
      emotional_tag: emotionalTag,
      date: new Date().toISOString(),
    });
    setTitle("");
    setAmount("");
    setCategory("");
    setLoading(false);
    onCreated?.();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">New Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Input
            placeholder="What was it for?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background border-border"
            autoFocus
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Amount
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 block">
                Type
              </label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Input
            placeholder="Category (e.g. Food, Rent, Freelance)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-background border-border"
          />
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2 block">
              Emotional Tag
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONAL_TAGS.map((tag) => (
                <button
                  key={tag.value}
                  onClick={() => setEmotionalTag(tag.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                    ${
                      emotionalTag === tag.value
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {tag.emoji} {tag.label}
                </button>
              ))}
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !amount || loading}
            className="w-full bg-mode-money hover:opacity-90 text-white"
          >
            {loading ? "Saving..." : "Save Transaction"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
