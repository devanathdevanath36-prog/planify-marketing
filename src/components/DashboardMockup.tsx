import { motion } from "framer-motion";
import { TrendingUp, Calendar, Target } from "lucide-react";

export function DashboardMockup() {
  const bars = [42, 68, 55, 80, 62, 90, 74];
  return (
    <div className="relative">
      <div className="absolute -inset-8 bg-gradient-brand opacity-20 blur-3xl rounded-full" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative glass rounded-2xl p-5 shadow-glow"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-muted-foreground">April plan</p>
            <p className="font-display text-lg font-semibold">Marketing overview</p>
          </div>
          <div className="rounded-full bg-gradient-brand px-3 py-1 text-xs font-medium text-white">
            On track
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: Target, label: "Budget", value: "$2,400" },
            { icon: TrendingUp, label: "ROAS", value: "3.4x" },
            { icon: Calendar, label: "Active", value: "5" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="rounded-xl bg-background/40 border border-border/40 p-3"
            >
              <s.icon className="h-3.5 w-3.5 text-primary mb-2" />
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
              <p className="font-display text-base font-semibold">{s.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-xl bg-background/40 border border-border/40 p-4">
          <div className="flex items-end gap-2 h-24">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.5 }}
                className="flex-1 rounded-t bg-gradient-to-t from-primary to-brand-glow"
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {[
            { name: "Spring Launch", chan: "Instagram", pct: 70 },
            { name: "Search Retargeting", chan: "Google", pct: 45 },
          ].map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="flex items-center justify-between rounded-lg bg-background/40 border border-border/40 p-2.5"
            >
              <div>
                <p className="text-xs font-medium">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">{c.chan}</p>
              </div>
              <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.pct}%` }}
                  transition={{ delay: 0.9 + i * 0.1, duration: 0.6 }}
                  className="h-full bg-gradient-brand"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}