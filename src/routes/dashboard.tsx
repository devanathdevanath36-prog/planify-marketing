import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Wallet,
  CalendarRange,
  Compass,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Stratifyr" },
      { name: "description", content: "Plan your marketing budget and campaigns." },
    ],
  }),
  component: DashboardLayout,
});

type NavItem = {
  to: "/dashboard" | "/dashboard/budget" | "/dashboard/campaigns" | "/dashboard/strategy";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const nav: NavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/budget", label: "Budget Planner", icon: Wallet },
  { to: "/dashboard/campaigns", label: "Campaigns", icon: CalendarRange },
  { to: "/dashboard/strategy", label: "Strategy", icon: Compass },
];

function DashboardLayout() {
  const { state } = useStore();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar hidden md:flex flex-col">
        <Link to="/" className="flex items-center gap-2 px-6 h-16 border-b border-sidebar-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand shadow-glow">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-lg font-semibold">Stratifyr</span>
        </Link>

        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            <div className="h-8 w-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-medium">
              {(state.user?.name ?? "U").slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{state.user?.name ?? "Guest"}</p>
              <p className="text-xs text-muted-foreground truncate">{state.user?.email ?? "—"}</p>
            </div>
            <Link to="/" className="text-muted-foreground hover:text-foreground" title="Sign out">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur">
        <div className="flex justify-around p-2">
          {nav.map((item) => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md text-[10px] ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label.split(" ")[0]}
              </Link>
            );
          })}
        </div>
      </div>

      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}