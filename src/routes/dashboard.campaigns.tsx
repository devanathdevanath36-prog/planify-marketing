import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isWithinInterval,
  parseISO,
  addMonths,
  subMonths,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore, formatCurrency, type Campaign } from "@/lib/store";

export const Route = createFileRoute("/dashboard/campaigns")({
  component: Campaigns,
});

const empty: Omit<Campaign, "id"> = {
  name: "",
  channel: "Instagram Ads",
  budget: 100,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
  status: "planned",
};

function Campaigns() {
  const { state, addCampaign, updateCampaign, removeCampaign } = useStore();
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [draft, setDraft] = useState<Omit<Campaign, "id">>(empty);
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim()) return;
    if (editing) updateCampaign(editing.id, draft);
    else addCampaign(draft);
    setEditing(null);
    setDraft(empty);
    setOpen(false);
  };

  const startEdit = (c: Campaign) => {
    setEditing(c);
    const { id: _id, ...rest } = c;
    void _id;
    setDraft(rest);
    setOpen(true);
  };

  const startNew = () => {
    setEditing(null);
    setDraft(empty);
    setOpen(true);
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Schedule, track, and manage all your marketing campaigns.
          </p>
        </div>
        <Button className="bg-gradient-brand hover:opacity-90" onClick={startNew}>
          <Plus className="h-4 w-4 mr-1" /> New campaign
        </Button>
      </div>

      {/* Calendar */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold">{format(cursor, "MMMM yyyy")}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCursor(subMonths(cursor, 1))}>
              ← Prev
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCursor(addMonths(cursor, 1))}>
              Next →
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-px bg-border/40 rounded-lg overflow-hidden text-xs">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="bg-card/60 px-2 py-2 text-muted-foreground font-medium">
              {d}
            </div>
          ))}
          {days.map((day) => {
            const inMonth = isSameMonth(day, cursor);
            const dayCampaigns = state.campaigns.filter((c) =>
              isWithinInterval(day, {
                start: parseISO(c.startDate),
                end: parseISO(c.endDate),
              })
            );
            return (
              <div
                key={day.toISOString()}
                className={`bg-background/60 min-h-[88px] p-1.5 ${inMonth ? "" : "opacity-40"}`}
              >
                <div className="text-[10px] text-muted-foreground mb-1">{format(day, "d")}</div>
                <div className="space-y-1">
                  {dayCampaigns.slice(0, 2).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => startEdit(c)}
                      className="w-full text-left text-[10px] px-1.5 py-0.5 rounded bg-gradient-brand text-white truncate"
                    >
                      {c.name}
                    </button>
                  ))}
                  {dayCampaigns.length > 2 && (
                    <p className="text-[10px] text-muted-foreground">+{dayCampaigns.length - 2} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Campaign list */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold mb-4">All campaigns</h2>
        {state.campaigns.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No campaigns yet.</p>
        ) : (
          <div className="space-y-2">
            {state.campaigns.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/30"
              >
                <div className="flex-1 min-w-[180px]">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {c.channel} · {c.startDate} → {c.endDate}
                  </p>
                </div>
                <span className="text-sm font-medium">{formatCurrency(c.budget)}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  c.status === "active" ? "bg-primary/15 text-primary" :
                  c.status === "planned" ? "bg-muted text-muted-foreground" :
                  c.status === "paused" ? "bg-yellow-500/15 text-yellow-600" :
                  "bg-emerald-500/15 text-emerald-600"
                }`}>{c.status}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(c)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeCampaign(c.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={onSave}
            className="glass rounded-2xl shadow-glow w-full max-w-md p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold">
                {editing ? "Edit campaign" : "New campaign"}
              </h3>
              <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Label htmlFor="cname">Name</Label>
              <Input
                id="cname"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="mt-1.5"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Channel</Label>
                <Select
                  value={draft.channel}
                  onValueChange={(v) => setDraft({ ...draft, channel: v })}
                >
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {state.channels.map((c) => (
                      <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                    ))}
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Budget ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={draft.budget}
                  onChange={(e) => setDraft({ ...draft, budget: Number(e.target.value) || 0 })}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start</Label>
                <Input
                  type="date"
                  value={draft.startDate}
                  onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>End</Label>
                <Input
                  type="date"
                  value={draft.endDate}
                  onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={draft.status}
                onValueChange={(v) => setDraft({ ...draft, status: v as Campaign["status"] })}
              >
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-brand hover:opacity-90">
                {editing ? "Save changes" : "Create campaign"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}