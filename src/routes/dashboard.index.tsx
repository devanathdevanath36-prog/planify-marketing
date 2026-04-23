import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Wallet, CalendarRange, TrendingUp, ArrowRight } from "lucide-react";
import { useStore, formatCurrency } from "@/lib/store";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

export const Route = createFileRoute("/dashboard/")({
  component: Overview,
});

function Overview() {
  const { state } = useStore();
  const allocated = state.channels.reduce((s, c) => s + c.amount, 0);
  const remaining = Math.max(state.budget - allocated, 0);
  const active = state.campaigns.filter((c) => c.status === "active").length;

  const chartData = state.channels.map((c) => ({ name: c.name, value: c.amount }));
  const palette = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  const upcoming = [...state.campaigns]
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 4);

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="font-display text-3xl lg:text-4xl font-bold">
            Hello, {state.user?.name?.split(" ")[0] ?? "there"} 👋
          </h1>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Wallet, label: "Monthly budget", value: formatCurrency(state.budget) },
          { icon: TrendingUp, label: "Allocated", value: formatCurrency(allocated) },
          { icon: CalendarRange, label: "Active campaigns", value: String(active) },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <s.icon className="h-3.5 w-3.5" /> {s.label}
            </div>
            <p className="font-display text-3xl font-semibold mt-2">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display text-lg font-semibold">Budget allocation</h2>
            <Link to="/dashboard/budget" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {allocated === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">No allocations yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 items-center">
              <div className="h-56">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={palette[i % palette.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(v: number) => formatCurrency(v)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {state.channels.map((c, i) => (
                  <div key={c.id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: palette[i % palette.length] }}
                      />
                      {c.name}
                    </span>
                    <span className="text-muted-foreground">{formatCurrency(c.amount)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50 mt-2">
                  <span className="font-medium">Remaining</span>
                  <span className="font-medium">{formatCurrency(remaining)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">Upcoming campaigns</h2>
            <Link to="/dashboard/campaigns" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">No campaigns yet.</p>
          ) : (
            <div className="space-y-2.5">
              {upcoming.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-border/50 p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground">{c.channel} · {c.startDate}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    c.status === "active" ? "bg-primary/15 text-primary" :
                    c.status === "planned" ? "bg-muted text-muted-foreground" :
                    c.status === "paused" ? "bg-yellow-500/15 text-yellow-500" :
                    "bg-emerald-500/15 text-emerald-500"
                  }`}>{c.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}