import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth
      .me()
      .then(setUser)
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8 pb-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
          Configure
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      </motion.div>

      {/* Profile */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
          Profile
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {user?.full_name || "Loading..."}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
          About SHIFT
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          SHIFT is your personal operating system — integrating financial
          control, creative processes, emotional states, and daily activity into
          a single adaptive environment that reflects your real behavior instead
          of forcing rigid structures.
        </p>
        <p className="text-xs text-muted-foreground mt-4 font-mono">v1.0.0</p>
      </div>

      <Button
        variant="outline"
        onClick={() => base44.auth.logout()}
        className="text-muted-foreground hover:text-destructive"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
