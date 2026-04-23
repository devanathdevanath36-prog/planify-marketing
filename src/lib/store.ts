import { useEffect, useState } from "react";

export type Channel = {
  id: string;
  name: string;
  amount: number;
  color: string;
};

export type Campaign = {
  id: string;
  name: string;
  channel: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: "planned" | "active" | "completed" | "paused";
};

export type StratifyrState = {
  user: { name: string; email: string } | null;
  budget: number;
  channels: Channel[];
  campaigns: Campaign[];
  strategy: string;
};

const KEY = "stratifyr.state.v1";

const defaultState: StratifyrState = {
  user: { name: "Demo User", email: "demo@stratifyr.app" },
  budget: 2400,
  channels: [
    { id: "c1", name: "Instagram Ads", amount: 800, color: "var(--chart-1)" },
    { id: "c2", name: "Google Ads", amount: 900, color: "var(--chart-2)" },
    { id: "c3", name: "Email Marketing", amount: 300, color: "var(--chart-3)" },
    { id: "c4", name: "Content / SEO", amount: 400, color: "var(--chart-4)" },
  ],
  campaigns: [
    {
      id: "k1",
      name: "Spring Launch",
      channel: "Instagram Ads",
      budget: 600,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      status: "active",
    },
    {
      id: "k2",
      name: "Search Retargeting",
      channel: "Google Ads",
      budget: 450,
      startDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 28 * 86400000).toISOString().slice(0, 10),
      status: "planned",
    },
  ],
  strategy: "",
};

let listeners: Array<() => void> = [];
let state: StratifyrState = load();

function load(): StratifyrState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

function save() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function setState(updater: (s: StratifyrState) => StratifyrState) {
  state = updater(state);
  save();
  listeners.forEach((l) => l());
}

export function useStore() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const l = () => setTick((t) => t + 1);
    listeners.push(l);
    return () => {
      listeners = listeners.filter((x) => x !== l);
    };
  }, []);

  return {
    state,
    setUser: (user: StratifyrState["user"]) => setState((s) => ({ ...s, user })),
    setBudget: (budget: number) => setState((s) => ({ ...s, budget })),
    setChannels: (channels: Channel[]) => setState((s) => ({ ...s, channels })),
    addChannel: (name: string, amount: number) =>
      setState((s) => ({
        ...s,
        channels: [
          ...s.channels,
          {
            id: crypto.randomUUID(),
            name,
            amount,
            color: `var(--chart-${(s.channels.length % 5) + 1})`,
          },
        ],
      })),
    updateChannel: (id: string, amount: number) =>
      setState((s) => ({
        ...s,
        channels: s.channels.map((c) => (c.id === id ? { ...c, amount } : c)),
      })),
    removeChannel: (id: string) =>
      setState((s) => ({ ...s, channels: s.channels.filter((c) => c.id !== id) })),
    addCampaign: (c: Omit<Campaign, "id">) =>
      setState((s) => ({
        ...s,
        campaigns: [...s.campaigns, { ...c, id: crypto.randomUUID() }],
      })),
    updateCampaign: (id: string, patch: Partial<Campaign>) =>
      setState((s) => ({
        ...s,
        campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      })),
    removeCampaign: (id: string) =>
      setState((s) => ({ ...s, campaigns: s.campaigns.filter((c) => c.id !== id) })),
    setStrategy: (strategy: string) => setState((s) => ({ ...s, strategy })),
  };
}

export function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}