import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Zap,
  Wallet,
  Lightbulb,
  FolderKanban,
  Target,
  Repeat,
  BookOpen,
  CalendarDays,
  BarChart2,
  Menu,
} from "lucide-react";
import { MODE_CONFIG } from "../lib/modeConfig";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

export default function MobileNav({ currentMode, onModeChange }) {
  const location = useLocation();
  const modeConfig = MODE_CONFIG[currentMode];
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-semibold tracking-tight">
          SHIFT<span className={`${modeConfig.textClass}`}>_</span>
        </h1>

        <div className="flex items-center gap-2">
          {/* Mode pills */}
          <div className="flex gap-1">
            {Object.entries(MODE_CONFIG).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => onModeChange(key)}
                  className={`p-1.5 rounded-md transition-all ${
                    currentMode === key
                      ? `${config.bgLightClass} ${config.textClass}`
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="p-2 text-muted-foreground">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-64 bg-background border-border"
            >
              <nav className="mt-8 space-y-1">
                {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
                  const isActive = location.pathname === path;
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                        ${
                          isActive
                            ? "bg-accent text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
