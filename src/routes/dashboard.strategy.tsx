import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore, formatCurrency } from "@/lib/store";

export const Route = createFileRoute("/dashboard/strategy")({
  component: Strategy,
});

const businessTypes = ["E-commerce", "Local service", "SaaS", "Coaching", "Restaurant", "Agency"];
const goals = ["Brand awareness", "Lead generation", "Direct sales", "Customer retention"];

function generatePlan({
  type,
  goal,
  budget,
  audience,
}: { type: string; goal: string; budget: number; audience: string }) {
  const split = (pct: number) => formatCurrency(Math.round((budget * pct) / 100));
  return `# Monthly marketing plan for your ${type.toLowerCase()}

Goal: ${goal} · Audience: ${audience || "general"} · Budget: ${formatCurrency(budget)}

## Recommended channel mix
- Paid social (Instagram / TikTok): ${split(40)} — top-of-funnel reach
- Search (Google Ads): ${split(30)} — capture intent and convert
- Email & retention: ${split(15)} — nurture existing audience
- Content / SEO: ${split(15)} — long-term compounding traffic

## Weekly cadence
Week 1 — Launch hero campaign on paid social. Refresh website hero & landing page.
Week 2 — Activate Google Ads with branded + intent keywords. Send re-engagement email.
Week 3 — Publish 2 SEO-focused articles. Run a UGC / testimonials campaign.
Week 4 — Review performance. Reallocate 20% of budget to the best-performing channel.

## KPIs to track
- Cost per acquisition (CPA)
- Click-through rate (CTR) by channel
- Email open & click rates
- Pipeline / revenue attribution

Tip: Review weekly, optimize monthly. Stay consistent — small businesses win on focus, not volume.`;
}

function Strategy() {
  const { state, setStrategy } = useStore();
  const [type, setType] = useState(businessTypes[0]);
  const [goal, setGoal] = useState(goals[0]);
  const [audience, setAudience] = useState("");
  const [budget, setBudget] = useState(state.budget);
  const [copied, setCopied] = useState(false);

  const onGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setStrategy(generatePlan({ type, goal, budget, audience }));
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(state.strategy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Strategy Generator</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Answer a few questions and get a monthly marketing plan you can act on.
        </p>
      </div>

      <form onSubmit={onGenerate} className="glass rounded-2xl p-6 grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Business type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              {businessTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Primary goal</Label>
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              {goals.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="aud">Target audience</Label>
          <Input
            id="aud"
            placeholder="e.g. local home owners 30-50"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="bud">Monthly budget ($)</Label>
          <Input
            id="bud"
            type="number"
            min={0}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value) || 0)}
            className="mt-1.5"
          />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" className="bg-gradient-brand hover:opacity-90 shadow-glow">
            <Sparkles className="h-4 w-4 mr-1.5" /> Generate plan
          </Button>
        </div>
      </form>

      {state.strategy && (
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-semibold">Your monthly plan</h2>
            <Button variant="outline" size="sm" onClick={onCopy}>
              {copied ? <><Check className="h-3.5 w-3.5 mr-1" /> Copied</> : <><Copy className="h-3.5 w-3.5 mr-1" /> Copy</>}
            </Button>
          </div>
          <Textarea
            value={state.strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="font-mono text-sm min-h-[420px] bg-background/40"
          />
        </div>
      )}
    </div>
  );
}