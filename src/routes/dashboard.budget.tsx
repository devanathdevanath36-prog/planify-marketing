import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore, formatCurrency } from "@/lib/store";

export const Route = createFileRoute("/dashboard/budget")({
  component: BudgetPlanner,
});

function BudgetPlanner() {
  const { state, setBudget, addChannel, updateChannel, removeChannel } = useStore();
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const allocated = state.channels.reduce((s, c) => s + c.amount, 0);
  const remaining = state.budget - allocated;
  const pct = state.budget > 0 ? Math.min((allocated / state.budget) * 100, 100) : 0;

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const a = Number(newAmount);
    if (!newName.trim() || !Number.isFinite(a) || a <= 0) return;
    addChannel(newName.trim(), a);
    setNewName("");
    setNewAmount("");
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Budget Planner</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Set your monthly spend and split it across channels.
        </p>
      </div>

      <div className="glass rounded-2xl p-6">
        <Label htmlFor="budget" className="text-xs text-muted-foreground uppercase tracking-wider">
          Monthly budget
        </Label>
        <div className="flex items-center gap-3 mt-2">
          <span className="font-display text-3xl font-semibold text-muted-foreground">$</span>
          <Input
            id="budget"
            type="number"
            min={0}
            value={state.budget}
            onChange={(e) => setBudget(Number(e.target.value) || 0)}
            className="font-display text-3xl h-14 max-w-xs border-0 bg-transparent shadow-none focus-visible:ring-0 px-0"
          />
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Allocated {formatCurrency(allocated)}</span>
            <span className={remaining < 0 ? "text-destructive" : ""}>
              {remaining >= 0 ? "Remaining " : "Over by "}
              {formatCurrency(Math.abs(remaining))}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full ${remaining < 0 ? "bg-destructive" : "bg-gradient-brand"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold mb-4">Channels</h2>
        <div className="space-y-3">
          {state.channels.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/30">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
              <span className="flex-1 font-medium text-sm">{c.name}</span>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground text-sm">$</span>
                <Input
                  type="number"
                  min={0}
                  value={c.amount}
                  onChange={(e) => updateChannel(c.id, Number(e.target.value) || 0)}
                  className="w-28 h-9"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => removeChannel(c.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {state.channels.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No channels yet — add one below.</p>
          )}
        </div>

        <form onSubmit={onAdd} className="mt-5 grid sm:grid-cols-[1fr_140px_auto] gap-2">
          <Input
            placeholder="Channel (e.g. TikTok Ads)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            type="number"
            min={0}
            placeholder="Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
          <Button type="submit" className="bg-gradient-brand hover:opacity-90">
            <Plus className="h-4 w-4 mr-1" /> Add channel
          </Button>
        </form>
      </div>
    </div>
  );
}