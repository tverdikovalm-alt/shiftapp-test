import { MODE_CONFIG } from "../lib/modeConfig";
import { motion } from "framer-motion";

export default function ModeCard({ mode, isActive, onClick, children }) {
  const config = MODE_CONFIG[mode];
  const Icon = config.icon;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-xl border p-5 text-left transition-all duration-300 w-full
        ${
          isActive
            ? `${config.borderClass} ${config.bgLightClass} ${config.glowClass}`
            : "border-border bg-card hover:border-muted-foreground/20"
        }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div
            className={`flex items-center gap-2 mb-1 ${
              isActive ? config.textClass : "text-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-semibold">{config.label}</span>
          </div>
          <p className="text-xs text-muted-foreground">{config.description}</p>
        </div>
        {isActive && (
          <div
            className={`w-2 h-2 rounded-full ${config.bgClass} animate-pulse-glow`}
          />
        )}
      </div>
      {children}
    </motion.button>
  );
}
