import moment from "moment";

function getMoodColor(mood) {
  if (!mood) return "bg-secondary";
  if (mood <= 3) return "bg-destructive/60";
  if (mood <= 5) return "bg-mode-creative/40";
  if (mood <= 7) return "bg-mode-money/50";
  return "bg-mode-money/80";
}

export default function MoodCalendar({ entries }) {
  const today = moment();
  const startOfMonth = today.clone().startOf("month");
  const endOfMonth = today.clone().endOf("month");
  const startDay = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1; // Mon start

  const daysInMonth = endOfMonth.date();
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

  const entryByDate = {};
  entries.forEach((e) => {
    const d = moment(e.date).format("YYYY-MM-DD");
    entryByDate[d] = e;
  });

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startDay + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return null;
    const date = today.clone().date(dayNum).format("YYYY-MM-DD");
    const entry = entryByDate[date];
    const isToday = date === today.format("YYYY-MM-DD");
    const isFuture = dayNum > today.date();
    return { dayNum, date, entry, isToday, isFuture };
  });

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Mood Calendar
        </h3>
        <p className="text-xs font-mono text-muted-foreground">
          {today.format("MMMM YYYY")}
        </p>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div
            key={i}
            className="text-center text-[10px] font-mono text-muted-foreground py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell) return <div key={i} />;
          return (
            <div
              key={i}
              className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-mono transition-all
                ${cell.isFuture ? "opacity-20" : ""}
                ${cell.isToday ? "ring-1 ring-primary" : ""}
                ${
                  cell.entry
                    ? getMoodColor(cell.entry.mood)
                    : cell.isFuture
                    ? "bg-transparent"
                    : "bg-secondary/40"
                }
              `}
              title={cell.entry ? `Mood: ${cell.entry.mood}/10` : ""}
            >
              <span
                className={
                  cell.entry ? "text-white/80" : "text-muted-foreground"
                }
              >
                {cell.dayNum}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 text-[10px] font-mono text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-destructive/60" />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-mode-creative/40" />
          <span>Okay</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-mode-money/80" />
          <span>Good</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-secondary/40" />
          <span>No entry</span>
        </div>
      </div>
    </div>
  );
}
