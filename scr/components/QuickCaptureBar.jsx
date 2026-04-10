import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";

export default function QuickCaptureBar({ onCreated }) {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(false);

  const moods = [
    { value: "excited", emoji: "🔥" },
    { value: "calm", emoji: "🧘" },
    { value: "frustrated", emoji: "😤" },
    { value: "inspired", emoji: "✨" },
    { value: "neutral", emoji: "💭" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    await base44.entities.Idea.create({
      content: content.trim(),
      mood: mood || "neutral",
      status: "raw",
      type: "idea",
    });
    setContent("");
    setMood(null);
    setLoading(false);
    onCreated?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-xl p-4"
    >
      <div className="flex items-center gap-3">
        <Sparkles className="w-4 h-4 text-mode-creative flex-shrink-0" />
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Capture an idea, fragment, or thought..."
          className="bg-transparent border-0 focus-visible:ring-0 px-0 text-sm placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={!content.trim() || loading}
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-mode-creative/10 text-mode-creative flex items-center justify-center hover:bg-mode-creative/20 transition-all disabled:opacity-30"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex items-center gap-1.5 mt-3 ml-7">
        <span className="text-[10px] text-muted-foreground font-mono mr-1">
          mood:
        </span>
        {moods.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMood(mood === m.value ? null : m.value)}
            className={`w-7 h-7 rounded-md flex items-center justify-center text-sm transition-all
              ${
                mood === m.value
                  ? "bg-accent scale-110"
                  : "hover:bg-accent/50 opacity-50 hover:opacity-100"
              }`}
          >
            {m.emoji}
          </button>
        ))}
      </div>
    </form>
  );
}
