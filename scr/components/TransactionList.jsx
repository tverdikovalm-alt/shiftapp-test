import { TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { EMOTIONAL_TAGS } from "../lib/modeConfig";
import moment from "moment";

export default function TransactionList({ transactions, onUpdate }) {
  const handleDelete = async (id) => {
    await base44.entities.Transaction.delete(id);
    onUpdate?.();
  };

  return (
    <div>
      <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
        Recent Transactions
      </h3>
      <div className="space-y-1.5">
        {transactions.slice(0, 20).map((t) => {
          const isIncome = t.type === "income";
          const emotionalTag = EMOTIONAL_TAGS.find(
            (et) => et.value === t.emotional_tag
          );
          return (
            <div
              key={t.id}
              className="group flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-all"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isIncome ? "bg-mode-money/10" : "bg-destructive/10"
                }`}
              >
                {isIncome ? (
                  <TrendingUp className="w-4 h-4 text-mode-money" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-foreground truncate">{t.title}</p>
                  {emotionalTag && (
                    <span className="text-[10px] text-muted-foreground">
                      {emotionalTag.emoji}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {t.category && <span>{t.category}</span>}
                  {t.date && <span>· {moment(t.date).fromNow()}</span>}
                </div>
              </div>
              <span
                className={`text-sm font-mono font-medium ${
                  isIncome ? "text-mode-money" : "text-foreground"
                }`}
              >
                {isIncome ? "+" : "-"}${(t.amount || 0).toLocaleString()}
              </span>
              <button
                onClick={() => handleDelete(t.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
        {transactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
