import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import JournalEntryForm from "../components/JournalEntryForm";
import JournalEntryCard from "../components/JournalEntryCard";
import MoodCalendar from "../components/MoodCalendar";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import moment from "moment";

export default function Journal() {
  const { currentMode } = useOutletContext();
  const [showForm, setShowForm] = useState(false);

  const { data: entries = [], refetch } = useQuery({
    queryKey: ["journal"],
    queryFn: () => base44.entities.JournalEntry.list("-created_date", 50),
  });

  const todayEntry = entries.find((e) =>
    moment(e.date).isSame(moment(), "day")
  );

  // Insight: avg mood over last 7 days
  const recentEntries = entries.filter((e) =>
    moment(e.date).isAfter(moment().subtract(7, "days"))
  );
  const avgMood =
    recentEntries.length > 0
      ? (
          recentEntries.reduce((s, e) => s + (e.mood || 5), 0) /
          recentEntries.length
        ).toFixed(1)
      : null;
  const avgEnergy =
    recentEntries.length > 0
      ? (
          recentEntries.reduce((s, e) => s + (e.energy || 5), 0) /
          recentEntries.length
        ).toFixed(1)
      : null;

  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
              Reflect
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Journal</h1>
          </div>
          {avgMood && (
            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
              <span>
                7d mood: <span className="text-foreground">{avgMood}/10</span>
              </span>
              <span>
                energy: <span className="text-foreground">{avgEnergy}/10</span>
              </span>
            </div>
          )}
        </div>

        {/* Today's Entry or Prompt */}
        {!todayEntry || showForm ? (
          <JournalEntryForm
            currentMode={currentMode}
            existingEntry={todayEntry}
            onSaved={() => {
              refetch();
              setShowForm(false);
            }}
            onCancel={todayEntry ? () => setShowForm(false) : undefined}
          />
        ) : (
          <div
            className="bg-card border border-primary/30 rounded-xl p-5 cursor-pointer hover:border-primary/50 transition-all"
            onClick={() => setShowForm(true)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Today
              </span>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span>
                  Mood:{" "}
                  <span className="text-foreground">
                    {todayEntry.mood || "—"}/10
                  </span>
                </span>
                <span>
                  Energy:{" "}
                  <span className="text-foreground">
                    {todayEntry.energy || "—"}/10
                  </span>
                </span>
              </div>
            </div>
            <p className="text-sm text-foreground/80 line-clamp-2">
              {todayEntry.free_text ||
                todayEntry.what_did_i_do ||
                "Tap to edit today's entry"}
            </p>
          </div>
        )}
      </motion.div>

      {/* Mood Calendar */}
      {entries.length > 0 && <MoodCalendar entries={entries} />}

      {/* Past Entries */}
      {entries.filter((e) => !moment(e.date).isSame(moment(), "day")).length >
        0 && (
        <div>
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
            Previous Entries
          </h2>
          <div className="space-y-3">
            {entries
              .filter((e) => !moment(e.date).isSame(moment(), "day"))
              .map((entry) => (
                <JournalEntryCard
                  key={entry.id}
                  entry={entry}
                  onUpdate={refetch}
                />
              ))}
          </div>
        </div>
      )}

      {entries.length === 0 && !showForm && (
        <div className="text-center py-16">
          <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Start your first reflection above
          </p>
        </div>
      )}
    </div>
  );
}
