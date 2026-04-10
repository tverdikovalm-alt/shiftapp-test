export default function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  colorClass,
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
          {label}
        </span>
        {Icon && (
          <Icon
            className={`w-4 h-4 ${colorClass || "text-muted-foreground"}`}
          />
        )}
      </div>
      <p
        className={`text-2xl font-semibold tracking-tight ${
          colorClass || "text-foreground"
        }`}
      >
        {value}
      </p>
      {sublabel && (
        <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>
      )}
    </div>
  );
}
