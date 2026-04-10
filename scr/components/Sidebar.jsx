import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Zap,
  Wallet,
  Lightbulb,
  FolderKanban,
  Fingerprint,
  Target,
  Repeat,
  BookOpen,
  CalendarDays,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";
import { MODE_CONFIG } from "../lib/modeConfig";
import { base44 } from "@/api/base44Client";

const NAV_ITEMS = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/flow", icon: Zap, label: "Flow" },
  { path: "/calendar", icon: CalendarDays, label: "Calendar" },
  { path: "/goals", icon: Target, label: "Goals" },
  { path: "/habits", icon: Repeat, label: "Habits" },
  { path: "/journal", icon: BookOpen, label: "Journal" },
  { path: "/finance", icon: Wallet, label: "Finance" },
  { path: "/ideas", icon: Lightbulb, label: "Ideas" },
  { path: "/projects", icon: FolderKanban, label: "Projects" },
  { path: "/self-awareness", icon: BarChart2, label: "Self-Awareness" },
];

export default function Sidebar({ currentMode, onModeChange }) {
  const location = useLocation();
  const modeConfig = MODE_CONFIG[currentMode];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          SHIFT<span className={`${modeConfig.textClass} ml-1`}>_</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-mono">
          personal operating system
        </p>
      </div>

      {/* Mode Selector */}
      <div className="p-4 border-b border-sidebar-border">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-mono">
          Current Mode
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(MODE_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            const isActive = currentMode === key;
            return (
              <button
                key={key}
                onClick={() => onModeChange(key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200
                  ${
                    isActive
                      ? `${config.bgLightClass} ${config.textClass} border ${config.borderClass}`
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                ${
                  isActive
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-0.5">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <button
          onClick={() => base44.auth.logout()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
